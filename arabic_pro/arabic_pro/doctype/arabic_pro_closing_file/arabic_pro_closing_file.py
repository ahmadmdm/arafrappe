"""Evidence-led accounting close review; never posts or freezes ledger entries."""

import json
from html import escape

import frappe
from frappe.model.document import Document
from frappe.utils import flt, getdate, now_datetime

from arabic_pro.accounting_diagnostic import get_period_signals


REVIEW_ROLES = {"Accounts Manager", "System Manager"}
PROTECTED_FIELDS = (
    "status", "prepared_by", "snapshot_at", "ledger_entry_count",
    "ledger_period_debit", "ledger_period_credit", "reviewed_at", "reviewed_by",
    "report_checked_at", "report_snapshot", "invalidation_at", "invalidation_reason",
)
REPORT_FIELDS = {
    "trial_balance_debit": "مدين الأرصدة الختامية بميزان المراجعة",
    "trial_balance_credit": "دائن الأرصدة الختامية بميزان المراجعة",
    "net_profit": "صافي الربح أو الخسارة",
    "total_assets": "الأصول",
    "total_liabilities": "الالتزامات",
    "total_equity": "حقوق الملكية قبل الربح المؤقت",
}
SIGNAL_CONTROLS = {
    "draft_journals": "قيود مسودة",
    "unreconciled_bank_transactions": "عمليات بنك غير مطابقة",
    "unallocated_payments": "دفعات غير مخصصة",
}

DEFAULT_CHECKLIST = (
    ("تهيئة الفترة", "راجع الشركة والسنة المالية ونطاق التاريخ", "تأكد أن كل التقارير تستخدم الشركة والفترة نفسيهما، وأن الحسابات النهائية ليست مجموعات.", "دليل الحسابات", "/app/account"),
    ("القيود", "راجع القيود المسودة والتعديلات الجوهرية", "افحص القيود غير المعتمدة والقيود اليدوية الكبيرة أو غير المعتادة قبل الاعتماد على النتائج.", "القيود اليومية", "/app/journal-entry"),
    ("البنوك والنقد", "طابق البنوك والصناديق", "قارن كشف البنك مع الحساب الدفتري، وافهم العمليات غير المطابقة والشيكات المعلقة بدل تصفيرها آليًا.", "مطابقة البنك", "/app/bank-reconciliation-tool"),
    ("العملاء", "راجع أرصدة العملاء والتحصيلات", "راجع الأعمار، الدفعات غير المخصصة، الإشعارات الدائنة، والأرصدة القديمة أو السالبة غير المعتادة.", "أعمار الذمم المدينة", "/app/query-report/Accounts%20Receivable"),
    ("الموردون", "راجع أرصدة الموردين والمدفوعات", "راجع الأعمار، الدفعات المقدمة، الإشعارات المدينة، والفواتير أو الدفعات غير المسواة.", "أعمار الذمم الدائنة", "/app/query-report/Accounts%20Payable"),
    ("المخزون", "راجع الكميات والتقييم والمخزون السالب", "تحقق من الحركات المتأخرة، المخزون السالب، فروق الجرد، وطريقة التقييم قبل اعتماد تكلفة المبيعات.", "ميزان المخزون", "/app/query-report/Stock%20Balance"),
    ("الأصول الثابتة", "راجع الإهلاك والإضافات والاستبعادات", "تأكد من ترحيل الإهلاك، صحة تواريخ بدء الإهلاك، ورسملة أو استبعاد الأصول وفق المستندات.", "الأصول", "/app/asset"),
    ("الضرائب", "طابق الضرائب والإقرارات", "قارن حسابات ضريبة المدخلات والمخرجات مع التقارير والإقرار، وافهم الفروق والتسويات.", "دفتر الأستاذ", "/app/query-report/General%20Ledger"),
    ("الرواتب", "راجع الرواتب والمستحقات", "تأكد من ترحيل الرواتب والبدلات والاستقطاعات والمستحقات ذات العلاقة إلى الفترة الصحيحة.", "قيود الرواتب", "/app/journal-entry"),
    ("الاستحقاقات", "راجع المصروفات والإيرادات المستحقة والمقدمة", "ابحث عن الخدمات المستلمة غير المفوترة، المصروفات المقدمة، والإيرادات أو المصروفات المؤجلة.", "القيود اليومية", "/app/journal-entry"),
    ("التقارير المالية", "طابق ميزان المراجعة مع القوائم", "راجع تساوي المدين والدائن، وصافي الربح، ومعادلة الأصول = الالتزامات + حقوق الملكية + الربح المؤقت.", "ميزان المراجعة", "/app/query-report/Trial%20Balance"),
    ("الإقفال والترحيل", "راجع قيد الإقفال والفترة المحاسبية", "أنشئ قيد الإقفال أو أغلق الفترة فقط بعد المراجعة وبحسب سياسة المنشأة. الأداة لا تنفذ ذلك نيابة عنك.", "قيد الإقفال", "/app/period-closing-voucher"),
)


def _populate_default_checklist(doc):
    if doc.checklist:
        return
    for category, title, guidance, action_label, action_route in DEFAULT_CHECKLIST:
        doc.append("checklist", {
            "category": category,
            "title": title,
            "status": "لم يبدأ",
            "guidance": guidance,
            "action_label": action_label,
            "action_route": action_route,
        })


def _checklist_summary(doc):
    rows = list(doc.checklist or [])
    counts = {status: sum(row.status == status for row in rows) for status in ("لم يبدأ", "قيد المراجعة", "مكتمل", "غير منطبق")}
    applicable = max(len(rows) - counts["غير منطبق"], 0)
    score = round((counts["مكتمل"] / applicable) * 100) if applicable else 100
    return {"total": len(rows), "applicable": applicable, "score": score, **counts}


def _append_event(doc, event_type, note, score=None):
    doc.append("review_events", {
        "event_at": now_datetime(),
        "event_type": event_type,
        "actor": frappe.session.user,
        "readiness_score": score if score is not None else _checklist_summary(doc)["score"],
        "note": note,
    })


def _company_is_visible(company):
    return bool(frappe.get_list("Company", filters={"name": company}, fields=["name"], limit_page_length=1))


def _ledger_totals(doc, changed_since=None):
    changed_clause = ""
    params = []
    if changed_since:
        changed_clause = ", SUM(CASE WHEN creation > %s OR modified > %s THEN 1 ELSE 0 END) changed_count"
        params.extend([changed_since, changed_since])
    params.extend([doc.company, doc.from_date, doc.to_date])
    row = frappe.db.sql(
        "SELECT COUNT(name) entry_count, COALESCE(SUM(debit), 0) debit, "
        "COALESCE(SUM(credit), 0) credit" + changed_clause +
        " FROM `tabGL Entry` WHERE company = %s AND posting_date BETWEEN %s AND %s",
        tuple(params), as_dict=True,
    )[0]
    return {
        "entry_count": int(row.entry_count or 0),
        "debit": flt(row.debit, 2),
        "credit": flt(row.credit, 2),
        "changed_count": int(row.get("changed_count") or 0),
    }


def _open_exception_summary(doc):
    rows = list(doc.exceptions or [])
    open_rows = [row for row in rows if row.status != "مغلق"]
    return {
        "total": len(rows),
        "open": len(open_rows),
        "high": sum(row.priority == "مرتفعة" for row in open_rows),
        "medium": sum(row.priority == "متوسطة" for row in open_rows),
        "unassigned": sum(not row.responsible for row in open_rows),
    }


def _review_role(user):
    return user == "Administrator" or bool(REVIEW_ROLES.intersection(frappe.get_roles(user)))


def _report_values(doc):
    """Use ERPNext's own report controllers, with one explicit company-wide scope."""
    from erpnext.accounts.report.balance_sheet.balance_sheet import execute as balance_sheet
    from erpnext.accounts.report.profit_and_loss_statement.profit_and_loss_statement import (
        execute as profit_and_loss,
    )
    from erpnext.accounts.report.trial_balance.trial_balance import execute as trial_balance
    from erpnext.accounts.utils import get_fiscal_year

    start_fy = get_fiscal_year(doc.from_date, company=doc.company)[0]
    end_fy = get_fiscal_year(doc.to_date, company=doc.company)[0]
    if start_fy != end_fy:
        frappe.throw("مطابقة التقارير تتطلب فترة ضمن سنة مالية واحدة. أنشئ ملفًا منفصلًا لكل سنة مالية.")

    currency = frappe.get_cached_value("Company", doc.company, "default_currency")
    period = {"company": doc.company, "from_date": doc.from_date, "to_date": doc.to_date}
    tb_filters = frappe._dict({
        **period, "fiscal_year": start_fy, "presentation_currency": currency,
        "with_period_closing_entry_for_opening": 1,
        "with_period_closing_entry_for_current_period": 1,
        "include_default_book_entries": 1, "show_net_values": 1,
    })
    _, tb_rows = trial_balance(tb_filters)
    if not tb_rows or tb_rows[-1].get("closing_debit") is None:
        frappe.throw("تعذر استخراج إجمالي الأرصدة الختامية من ميزان المراجعة.")
    tb_total = tb_rows[-1]

    financial_filters = {
        "company": doc.company, "filter_based_on": "Date Range",
        "period_start_date": doc.from_date, "period_end_date": doc.to_date,
        "from_fiscal_year": start_fy, "to_fiscal_year": end_fy,
        "periodicity": "Yearly", "accumulated_values": 1,
        "include_default_book_entries": 1, "presentation_currency": currency,
        "selected_view": "Report",
    }
    pl_result = profit_and_loss(frappe._dict(financial_filters.copy()))
    bs_result = balance_sheet(frappe._dict(financial_filters.copy()))
    pl_summary = pl_result[4] if len(pl_result) > 4 else None
    bs_summary = bs_result[4] if len(bs_result) > 4 else None
    if not pl_summary or len(pl_summary) < 5 or not bs_summary or len(bs_summary) < 4:
        frappe.throw("تعذر استخراج مجاميع قائمة الدخل أو الميزانية العمومية.")

    values = {
        "trial_balance_debit": flt(tb_total.get("closing_debit"), 2),
        "trial_balance_credit": flt(tb_total.get("closing_credit"), 2),
        "net_profit": flt(pl_summary[4].get("value"), 2),
        "total_assets": flt(bs_summary[0].get("value"), 2),
        "total_liabilities": flt(bs_summary[1].get("value"), 2),
        "total_equity": flt(bs_summary[2].get("value"), 2),
    }
    provisional_profit_loss = flt(bs_summary[3].get("value"), 2)
    return {
        "checked_at": now_datetime().isoformat(),
        "currency": currency,
        "fiscal_year": start_fy,
        "scope": "عملة الشركة · جميع مراكز التكلفة · بلا فلتر دفتر مالي",
        "values": values,
        "provisional_profit_loss": provisional_profit_loss,
        "balance_sheet_difference": flt(
            values["total_assets"] - values["total_liabilities"]
            - values["total_equity"] - provisional_profit_loss, 2,
        ),
    }


def _report_comparison(doc, report):
    values = (report or {}).get("values") or {}
    rows = []
    for field, label in REPORT_FIELDS.items():
        if field not in values:
            continue
        entered = flt(doc.get(field), 2)
        calculated = flt(values[field], 2)
        rows.append({
            "field": field, "label": label, "entered": entered,
            "calculated": calculated, "difference": flt(entered - calculated, 2),
            "matched": abs(entered - calculated) <= 0.01,
        })
    return rows


def _signal_counts(signals):
    return {
        key: {
            "available": bool((signals.get(key) or {}).get("available")),
            "count": (signals.get(key) or {}).get("count"),
        }
        for key in SIGNAL_CONTROLS
    }


def _assert_reviewer(doc, current_user=False):
    reviewer = frappe.session.user if current_user else doc.reviewer
    if not reviewer or reviewer == doc.prepared_by:
        frappe.throw("يجب تكليف مراجع مختلف عن مُعدّ الملف.")
    if not frappe.db.get_value("User", reviewer, "enabled") or not _review_role(reviewer):
        frappe.throw("يجب أن يكون المراجع مستخدمًا نشطًا بدور مدير الحسابات أو مدير النظام.")
    if current_user and reviewer != doc.reviewer:
        frappe.throw("الاعتماد متاح للمراجع المكلّف فقط.", frappe.PermissionError)


def _safe_report_values(doc):
    # frappe.throw records a UI message before raising.  This helper deliberately
    # turns report failures into non-blocking guidance, so do not leak that
    # recorded message back to the browser as if the whole request had failed.
    message_count = len(frappe.get_message_log())
    try:
        return _report_values(doc), None
    except Exception as exc:
        while len(frappe.get_message_log()) > message_count:
            frappe.clear_last_message()
        frappe.log_error(title=f"تعذر فحص تقارير ملف الإقفال {doc.name}")
        return None, str(exc)


def _build_guidance(doc, signals=None, report=None, report_error=None):
    """Return accountant-facing suggestions only; none of them is a workflow gate."""
    signals = signals or get_period_signals(doc.company, str(doc.from_date), str(doc.to_date))
    checklist = _checklist_summary(doc)
    exceptions = _open_exception_summary(doc)
    recommendations = []

    def add(level, title, detail, action_label=None, route=None):
        recommendations.append({
            "level": level, "title": title, "detail": detail,
            "action_label": action_label, "route": route,
        })

    if checklist["score"] < 100:
        add("info", "استكمل ما يناسبك من قائمة الإقفال", f"اكتمل {checklist['مكتمل']} من {checklist['applicable']} فحصًا منطبقًا. يمكنك تجاهل غير المناسب أو اختياره «غير منطبق».")
    if exceptions["open"]:
        add("warning", "راجع الاستثناءات المفتوحة", f"يوجد {exceptions['open']} استثناء مفتوح، منها {exceptions['high']} عالي الأولوية. يمكنك المتابعة مع توثيق سبب قبول الفرق.")
    if not doc.reports_file:
        add("info", "احتفظ بنسخة التقارير إن كانت سياسة المنشأة تتطلب ذلك", "إرفاق التقارير اختياري، لكنه يسهل إثبات ما راجعه المحاسب والمراجع.")
    for key, label in SIGNAL_CONTROLS.items():
        signal = signals.get(key) or {}
        if not signal.get("available"):
            add("info", f"تعذر قراءة مؤشر {label}", "لا تملك الصلاحية أو أن الوحدة غير متاحة؛ راجعه يدويًا إذا كان مهمًا للفترة.")
        elif signal.get("count", 0):
            add("warning", f"مؤشر يحتاج نظرًا: {label}", f"وجد النظام {signal['count']} عنصرًا. العدد تنبيه استكشافي وليس حكمًا بأن المعالجة خاطئة.")
    if report_error:
        add("warning", "تعذر احتساب القوائم آليًا", report_error, "افتح ميزان المراجعة", "/app/query-report/Trial%20Balance")
    elif report:
        if abs(report["values"]["trial_balance_debit"] - report["values"]["trial_balance_credit"]) > 0.01:
            add("critical", "ميزان المراجعة المحسوب غير متساوٍ", "راجع القيود والفلاتر قبل الاعتماد على القوائم.")
        if abs(report["balance_sheet_difference"]) > 0.01:
            add("critical", "معادلة الميزانية تحتاج مراجعة", f"فرق المعادلة الحالي {report['balance_sheet_difference']:.2f} بعملة الشركة.")
        mismatches = [row["label"] for row in _report_comparison(doc, report) if not row["matched"]]
        if mismatches:
            add("warning", "الأرقام المدخلة تختلف عن تقارير ERPNext", "الفروق في: " + "، ".join(mismatches) + ". استخدم زر التعبئة المقترحة إذا أردت نسخ القيم المحسوبة.")
    if not (signals.get("covering_closing_vouchers") or {}).get("count"):
        add("info", "لا يظهر قيد إقفال يغطي كامل الفترة", "هذا طبيعي أثناء المراجعة. أنشئه فقط عندما تقرر المنشأة إقفال السنة أو الفترة.", "فتح قيود الإقفال", "/app/period-closing-voucher")
    if not doc.reviewer:
        add("info", "عيّن مراجعًا مستقلًا إذا رغبت في اعتماد رسمي", "يمكن استخدام جميع التوجيهات دون مراجع؛ يلزم المراجع فقط لزر الاعتماد داخل هذه الأداة.")

    next_step = recommendations[0] if recommendations else {
        "level": "success", "title": "لا توجد ملاحظات آلية بارزة",
        "detail": "انتقل إلى المراجعة المهنية للمستندات والتقديرات ثم نفّذ الإقفال حسب سياسة المنشأة.",
        "action_label": "فتح قيد الإقفال", "route": "/app/period-closing-voucher",
    }
    return {
        "advisory_only": True,
        "checklist": checklist,
        "recommendations": recommendations,
        "next_step": next_step,
        "score": checklist["score"],
    }


def _save_action(doc):
    previous = getattr(frappe.flags, "in_closing_review_action", False)
    frappe.flags.in_closing_review_action = True
    try:
        doc.save(ignore_permissions=True)
    finally:
        frappe.flags.in_closing_review_action = previous


class ArabicProClosingFile(Document):
    def before_insert(self):
        self.prepared_by = frappe.session.user
        self.status = "مسودة"
        _populate_default_checklist(self)
        _append_event(self, "إنشاء الملف", "أُنشئ ملف إقفال إرشادي؛ لم ينفذ النظام أي قيد أو إقفال تلقائي.")

    def validate(self):
        if not getattr(frappe.flags, "in_closing_review_action", False) and not _company_is_visible(self.company):
            frappe.throw("الشركة غير متاحة لحسابك.", frappe.PermissionError)
        if not self.from_date or not self.to_date or getdate(self.from_date) > getdate(self.to_date):
            frappe.throw("تحقق من تاريخ بداية الفترة ونهايتها.")
        if (getdate(self.to_date) - getdate(self.from_date)).days > 400:
            frappe.throw("ملف المراجعة مخصص لفترة لا تتجاوز 400 يوم.")
        if flt(self.materiality_threshold) < 0:
            frappe.throw("حد الأهمية النسبية لا يمكن أن يكون سالبًا.")

        duplicate = frappe.db.exists("Arabic Pro Closing File", {
            "company": self.company, "from_date": self.from_date,
            "to_date": self.to_date, "name": ["!=", self.name],
        })
        if duplicate:
            frappe.throw("يوجد ملف مراجعة لنفس الشركة والفترة. افتح الملف الموجود بدل إنشاء نسخة أخرى.")

        old = self.get_doc_before_save()
        if old and (
            self.company != old.company
            or getdate(self.from_date) != getdate(old.from_date)
            or getdate(self.to_date) != getdate(old.to_date)
        ):
            frappe.throw("نطاق الشركة والفترة ثابت بعد إنشاء الملف. أنشئ ملفًا جديدًا لفترة أخرى.")
        if old and not getattr(frappe.flags, "in_closing_review_action", False):
            if old.status in ("جاهز للمراجعة", "معتمد"):
                frappe.throw("الملف في مرحلة المراجعة أو معتمد. أعد فتحه قبل التعديل.")
            if any(self.get(field) != old.get(field) for field in PROTECTED_FIELDS):
                frappe.throw("حقول حالة المراجعة والبصمة تُحدّث من أزرار المراجعة فقط.")

        threshold = flt(self.materiality_threshold)
        for row in self.exceptions or []:
            if row.account and frappe.db.get_value("Account", row.account, "company") != self.company:
                frappe.throw(f"الحساب في الاستثناء {row.idx} لا يتبع الشركة المختارة.")
            amount = abs(flt(row.amount))
            row.priority = (
                "غير محددة" if not threshold or not amount else
                "مرتفعة" if amount >= threshold else
                "متوسطة" if amount >= threshold * 0.25 else "منخفضة"
            )
            if row.evidence_file and not frappe.db.exists("File", {"file_url": row.evidence_file}):
                frappe.throw(f"الاستثناء {row.idx}: ملف الدليل غير موجود ضمن ملفات النظام.")
        for row in self.checklist or []:
            if row.evidence_file and not frappe.db.exists("File", {"file_url": row.evidence_file}):
                frappe.throw(f"الفحص الإرشادي {row.idx}: ملف الدليل غير موجود ضمن ملفات النظام.")
        if self.reports_file and not frappe.db.exists("File", {"file_url": self.reports_file}):
            frappe.throw("ملف التقارير المرفق غير موجود ضمن ملفات النظام.")


def _load_doc(name, permission):
    doc = frappe.get_doc("Arabic Pro Closing File", name)
    doc.check_permission(permission)
    if not _company_is_visible(doc.company):
        frappe.throw("الشركة غير متاحة لحسابك.", frappe.PermissionError)
    return doc


def _snapshot_drift(doc, current):
    return bool(doc.snapshot_at and (
        current["changed_count"]
        or current["entry_count"] != int(doc.ledger_entry_count or 0)
        or abs(current["debit"] - flt(doc.ledger_period_debit, 2)) > 0.01
        or abs(current["credit"] - flt(doc.ledger_period_credit, 2)) > 0.01
    ))


def _invalidate_review(doc, reason):
    if doc.status not in ("جاهز للمراجعة", "معتمد"):
        return False
    doc.status = "بحاجة إلى إعادة مراجعة"
    doc.invalidation_at = now_datetime()
    doc.invalidation_reason = reason
    _append_event(doc, "إعادة مراجعة مطلوبة", reason)
    _save_action(doc)
    doc.add_comment("Info", text=f"أُبطلت مراجعة ملف الإقفال: {reason}")
    return True


def _invalidate_if_ledger_changed(doc):
    if doc.status not in ("جاهز للمراجعة", "معتمد") or not doc.snapshot_at:
        return False
    current = _ledger_totals(doc, doc.snapshot_at)
    if not _snapshot_drift(doc, current):
        return False
    reason = (
        f"تغيّرت حركة دفتر الأستاذ للفترة بعد البصمة: "
        f"السطور {doc.ledger_entry_count or 0} ← {current['entry_count']}، "
        f"المدين {flt(doc.ledger_period_debit, 2)} ← {current['debit']}، "
        f"الدائن {flt(doc.ledger_period_credit, 2)} ← {current['credit']}، "
        f"والسطور المضافة أو المعدلة {current['changed_count']}."
    )
    return _invalidate_review(doc, reason)


def on_gl_entry_change(gl_entry, method=None):
    """Immediately revoke affected reviews for ordinary GL document changes."""
    if not gl_entry.company or not gl_entry.posting_date:
        return
    try:
        names = frappe.get_all("Arabic Pro Closing File", filters={
            "company": gl_entry.company,
            "from_date": ["<=", gl_entry.posting_date],
            "to_date": [">=", gl_entry.posting_date],
            "status": ["in", ["جاهز للمراجعة", "معتمد"]],
        }, pluck="name", limit_page_length=0)
        for name in names:
            doc = frappe.get_doc("Arabic Pro Closing File", name)
            _invalidate_review(doc, f"تغيّر سطر الأستاذ {gl_entry.name} بتاريخ {gl_entry.posting_date} ({method or 'تحديث'}). راجع التقارير وأعد الاعتماد.")
    except Exception:
        # A review aid must never make an otherwise valid accounting posting fail.
        frappe.log_error("تعذر تحديث ملف مراجعة الإقفال بعد حركة الأستاذ")


def scan_ledger_changes():
    """Catch bulk SQL changes that bypass GL Entry document hooks."""
    names = frappe.get_all("Arabic Pro Closing File", filters={
        "status": ["in", ["جاهز للمراجعة", "معتمد"]],
    }, pluck="name", limit_page_length=0)
    for name in names:
        try:
            _invalidate_if_ledger_changed(frappe.get_doc("Arabic Pro Closing File", name))
        except Exception:
            frappe.log_error(f"تعذر فحص بصمة ملف الإقفال {name}")


def backfill_closing_checklists():
    """Add the advisory checklist to files created before this feature existed."""
    for name in frappe.get_all("Arabic Pro Closing File", pluck="name", limit_page_length=0):
        doc = frappe.get_doc("Arabic Pro Closing File", name)
        if doc.checklist:
            continue
        _populate_default_checklist(doc)
        _append_event(doc, "إضافة المساعد الإرشادي", "أضيفت قائمة الفحوص الاختيارية إلى الملف القديم؛ لم تتغير القيود المحاسبية.")
        _save_action(doc)


@frappe.whitelist()
def get_closing_dashboard(company=None, year=None):
    """Permission-aware monthly/yearly overview; every indicator remains advisory."""
    filters = {}
    if company:
        if not _company_is_visible(company):
            frappe.throw("الشركة غير متاحة لحسابك.", frappe.PermissionError)
        filters["company"] = company
    if year:
        try:
            numeric_year = int(year)
        except (TypeError, ValueError):
            frappe.throw("السنة غير صحيحة.")
        filters["from_date"] = [">=", f"{numeric_year}-01-01"]
        filters["to_date"] = ["<=", f"{numeric_year}-12-31"]

    rows = frappe.get_list(
        "Arabic Pro Closing File",
        filters=filters,
        fields=["name", "company", "from_date", "to_date", "status", "reviewer", "modified"],
        order_by="to_date desc, modified desc",
        limit_page_length=200,
    )
    items = []
    status_counts = {status: 0 for status in ("مسودة", "جاهز للمراجعة", "معتمد", "بحاجة إلى إعادة مراجعة")}
    for row in rows:
        doc = frappe.get_doc("Arabic Pro Closing File", row.name)
        checklist = _checklist_summary(doc)
        exceptions = _open_exception_summary(doc)
        status_counts[row.status] = status_counts.get(row.status, 0) + 1
        items.append({
            **row,
            "from_date": str(row.from_date), "to_date": str(row.to_date),
            "readiness_score": checklist["score"],
            "checklist_done": checklist["مكتمل"],
            "checklist_applicable": checklist["applicable"],
            "open_exceptions": exceptions["open"],
        })
    return {
        "advisory_only": True,
        "filters": {"company": company, "year": year},
        "companies": frappe.get_list("Company", fields=["name"], order_by="name asc", limit_page_length=0),
        "status_counts": status_counts,
        "items": items,
    }


@frappe.whitelist()
def get_review_state(name):
    doc = _load_doc(name, "read")
    _invalidate_if_ledger_changed(doc)
    current = _ledger_totals(doc, doc.snapshot_at if doc.snapshot_at else None)
    drift = _snapshot_drift(doc, current)
    report_snapshot = json.loads(doc.report_snapshot) if doc.report_snapshot else None
    report_error = report_snapshot.get("error") if report_snapshot else None
    report = report_snapshot if report_snapshot and report_snapshot.get("values") else None
    signals = get_period_signals(doc.company, str(doc.from_date), str(doc.to_date))
    guidance = _build_guidance(doc, signals=signals, report=report, report_error=report_error)
    return {
        "status": doc.status,
        "exceptions": _open_exception_summary(doc),
        "signals": signals,
        "ledger": current,
        "snapshot_at": str(doc.snapshot_at) if doc.snapshot_at else None,
        "drift": drift,
        "report": report,
        "report_comparison": _report_comparison(doc, report),
        "guidance": guidance,
        "review_events": [
            {
                "event_at": str(row.event_at), "event_type": row.event_type,
                "actor": row.actor, "readiness_score": row.readiness_score,
                "note": row.note,
            }
            for row in reversed(list(doc.review_events or [])[-12:])
        ],
        "invalidation_reason": doc.invalidation_reason,
        "invalidation_at": str(doc.invalidation_at) if doc.invalidation_at else None,
        "can_review": doc.reviewer == frappe.session.user and _review_role(frappe.session.user),
    }


@frappe.whitelist()
def verify_reports(name):
    doc = _load_doc(name, "write")
    if doc.status not in ("مسودة", "بحاجة إلى إعادة مراجعة"):
        frappe.throw("أعد فتح ملف المراجعة قبل إعادة حساب التقارير.")
    report, report_error = _safe_report_values(doc)
    snapshot = report or {"checked_at": now_datetime().isoformat(), "error": report_error}
    if report:
        report["signal_counts"] = _signal_counts(get_period_signals(doc.company, str(doc.from_date), str(doc.to_date)))
    doc.report_snapshot = json.dumps(snapshot, ensure_ascii=False)
    doc.report_checked_at = now_datetime()
    _append_event(doc, "فحص التقارير", "اكتملت قراءة التقارير الإرشادية." if report else f"تعذر فحص التقارير: {report_error}")
    _save_action(doc)
    return get_review_state(name)


@frappe.whitelist()
def apply_report_suggestions(name):
    """Copy calculated values only after an explicit accountant action."""
    doc = _load_doc(name, "write")
    if doc.status not in ("مسودة", "بحاجة إلى إعادة مراجعة"):
        frappe.throw("أعد فتح الملف قبل تعبئة القيم المقترحة.")
    report = _report_values(doc)
    for field in REPORT_FIELDS:
        doc.set(field, report["values"][field])
    report["signal_counts"] = _signal_counts(get_period_signals(doc.company, str(doc.from_date), str(doc.to_date)))
    doc.report_snapshot = json.dumps(report, ensure_ascii=False)
    doc.report_checked_at = now_datetime()
    _append_event(doc, "تعبئة مقترحة", "نسخ المحاسب قيم تقارير ERPNext إلى حقول المطابقة بقرار صريح؛ لم يُنشأ أي قيد.")
    _save_action(doc)
    return get_review_state(name)


@frappe.whitelist()
def submit_for_review(name):
    doc = _load_doc(name, "write")
    if doc.status not in ("مسودة", "بحاجة إلى إعادة مراجعة"):
        frappe.throw("الملف ليس في حالة تسمح بإرساله للمراجعة.")
    _assert_reviewer(doc)
    report, report_error = _safe_report_values(doc)
    signals = get_period_signals(doc.company, str(doc.from_date), str(doc.to_date))
    snapshot = report or {"checked_at": now_datetime().isoformat(), "error": report_error}
    if report:
        report["signal_counts"] = _signal_counts(signals)
    totals = _ledger_totals(doc)
    doc.report_snapshot = json.dumps(snapshot, ensure_ascii=False)
    doc.report_checked_at = now_datetime()
    doc.snapshot_at = now_datetime()
    doc.ledger_entry_count = totals["entry_count"]
    doc.ledger_period_debit = totals["debit"]
    doc.ledger_period_credit = totals["credit"]
    doc.status = "جاهز للمراجعة"
    doc.reviewed_at = None
    doc.reviewed_by = None
    doc.invalidation_at = None
    doc.invalidation_reason = None
    guidance = _build_guidance(doc, signals=signals, report=report, report_error=report_error)
    _append_event(doc, "إرسال للمراجعة", f"أُرسلت للمراجعة المستقلة مع {len(guidance['recommendations'])} توصية إرشادية غير مانعة.", guidance["score"])
    _save_action(doc)
    return get_review_state(name)


@frappe.whitelist()
def approve_review(name):
    doc = _load_doc(name, "write")
    if _invalidate_if_ledger_changed(doc):
        return get_review_state(name)
    if doc.status != "جاهز للمراجعة":
        frappe.throw("أرسل الملف للمراجعة أولًا.")
    _assert_reviewer(doc, current_user=True)
    state = get_review_state(name)
    if state["drift"]:
        frappe.throw("تغيّرت حركات دفتر الأستاذ بعد التقاط البصمة. أعد فتح الملف وراجع الأثر ثم أرسله مجددًا.")
    report, report_error = _safe_report_values(doc)
    if report:
        report["signal_counts"] = _signal_counts(get_period_signals(doc.company, str(doc.from_date), str(doc.to_date)))
        doc.report_snapshot = json.dumps(report, ensure_ascii=False)
        doc.report_checked_at = now_datetime()
    doc.status = "معتمد"
    doc.reviewed_at = now_datetime()
    doc.reviewed_by = frappe.session.user
    guidance = _build_guidance(doc, report=report, report_error=report_error)
    _append_event(doc, "اعتماد المراجعة", f"اعتمد المراجع الملف مع بقاء {len(guidance['recommendations'])} توصية إرشادية غير مانعة.", guidance["score"])
    _save_action(doc)
    return get_review_state(name)


@frappe.whitelist()
def reopen_review(name, reason=None):
    doc = _load_doc(name, "write")
    if doc.status not in ("جاهز للمراجعة", "معتمد"):
        frappe.throw("لا يحتاج الملف إلى إعادة فتح.")
    if not _review_role(frappe.session.user):
        frappe.throw("إعادة الفتح متاحة لمدير الحسابات أو مدير النظام.", frappe.PermissionError)
    if not reason or not reason.strip():
        frappe.throw("اكتب سبب إعادة فتح المراجعة لحفظه في سجل الملف.")
    _invalidate_review(doc, f"أعاد {frappe.session.user} فتح الملف: {reason.strip()}")
    return get_review_state(name)


def _company_header_html(company):
    try:
        from smart_statement.branding import BRANDS, _header_html
        brand = BRANDS.get(company)
        if brand:
            return _header_html(company, brand)
    except Exception:
        pass
    return f'<div class="pdf-brand"><strong>{escape(company)}</strong><span>حزمة مراجعة الإقفال · Arabic Pro</span></div>'


def build_closing_package_pdf(doc):
    """Build a human-readable advisory package; this does not approve or post anything."""
    from frappe.utils.pdf import get_pdf

    report_snapshot = json.loads(doc.report_snapshot) if doc.report_snapshot else None
    report = report_snapshot if report_snapshot and report_snapshot.get("values") else None
    report_error = report_snapshot.get("error") if report_snapshot else None
    signals = get_period_signals(doc.company, str(doc.from_date), str(doc.to_date))
    guidance = _build_guidance(doc, signals=signals, report=report, report_error=report_error)
    comparison = _report_comparison(doc, report)

    checklist_rows = "".join(
        f"<tr><td>{row.idx}</td><td>{escape(row.category or '')}</td><td>{escape(row.title or '')}</td>"
        f"<td><span class='tag'>{escape(row.status or 'لم يبدأ')}</span></td><td>{escape(row.notes or '')}</td></tr>"
        for row in doc.checklist or []
    ) or "<tr><td colspan='5'>لا توجد فحوص مسجلة.</td></tr>"
    recommendation_rows = "".join(
        f"<li class='{item['level']}'><strong>{escape(item['title'])}</strong><span>{escape(item['detail'])}</span></li>"
        for item in guidance["recommendations"]
    ) or "<li class='success'><strong>لا توجد ملاحظات آلية بارزة</strong><span>أكمل المراجعة المهنية للمستندات والتقديرات.</span></li>"
    comparison_rows = "".join(
        f"<tr><td>{escape(row['label'])}</td><td>{row['entered']:,.2f}</td><td>{row['calculated']:,.2f}</td>"
        f"<td class='{'ok' if row['matched'] else 'warn'}'>{'مطابق' if row['matched'] else format(row['difference'], ',.2f')}</td></tr>"
        for row in comparison
    ) or "<tr><td colspan='4'>لم تُحتسب مقارنة التقارير بعد.</td></tr>"
    exception_rows = "".join(
        f"<tr><td>{row.idx}</td><td>{escape(row.category or '')}</td><td>{escape(row.title or '')}</td>"
        f"<td>{flt(row.amount):,.2f}</td><td>{escape(row.status or '')}</td><td>{escape(row.action_taken or '')}</td></tr>"
        for row in doc.exceptions or []
    ) or "<tr><td colspan='6'>لا توجد استثناءات مسجلة.</td></tr>"
    events = "".join(
        f"<tr><td>{escape(str(row.event_at or ''))}</td><td>{escape(row.event_type or '')}</td>"
        f"<td>{escape(row.actor or '')}</td><td>{flt(row.readiness_score):.0f}%</td><td>{escape(row.note or '')}</td></tr>"
        for row in reversed(list(doc.review_events or [])[-20:])
    ) or "<tr><td colspan='5'>لا توجد أحداث.</td></tr>"

    html = f"""
    <html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
    @page {{ size:A4 landscape; margin:13mm 11mm 14mm; }}
    body {{ font-family:'Noto Sans Arabic','Segoe UI',Arial,sans-serif; color:#183241; font-size:10px; direction:rtl; }}
    .pdf-brand {{border-bottom:3px solid #0d7168;padding:8px 0 12px;font-size:18px}} .pdf-brand strong,.pdf-brand span{{display:block}} .pdf-brand span{{font-size:9px;color:#697b84;margin-top:3px}}
    h1{{font-size:22px;margin:14px 0 3px}} h2{{font-size:14px;margin:20px 0 8px;color:#0b625b;border-right:4px solid #c18a31;padding-right:8px;page-break-after:avoid}} .new-page{{page-break-before:always;margin-top:0}}
    .sub{{color:#667b85;margin-bottom:13px}} .advisory{{background:#fff6df;border:1px solid #e6c77f;padding:9px 12px;border-radius:7px;line-height:1.8}}
    .summary{{width:100%;border-collapse:separate;border-spacing:7px;margin:10px -7px 12px}} .summary td{{border:1px solid #d7e2e5;background:#f8fbfb;border-radius:7px;padding:9px 12px;vertical-align:middle}} .summary .score{{width:12%;background:#15394c;color:#fff;border-color:#15394c;text-align:center;font-size:18px;font-weight:800}} .summary strong{{display:block;font-size:16px}}
    table{{width:100%;border-collapse:collapse;page-break-inside:auto}} tr{{page-break-inside:avoid}} th{{background:#15394c;color:#fff;text-align:right;padding:7px}} td{{border:1px solid #dbe4e7;padding:6px;vertical-align:top}} .tag{{font-weight:700;color:#0b625b}} .ok{{color:#087455;font-weight:800}} .warn{{color:#a33a2d;font-weight:800}}
    ul{{list-style:none;padding:0;margin:0}} li{{border-right:4px solid #5b8796;background:#f5f9fa;padding:7px 10px;margin:5px 0}} li.warning,li.critical{{border-color:#c18124;background:#fff8e9}} li.critical{{border-color:#b43e35;background:#fff1ef}} li strong,li span{{display:block}} li span{{color:#566e78;margin-top:3px;line-height:1.7}}
    .footer{{margin-top:16px;border-top:1px solid #d4dfe2;padding-top:7px;color:#74858c;font-size:8px;text-align:center}}
    </style></head><body>
    {_company_header_html(doc.company)}
    <h1>حزمة مراجعة الإقفال</h1><div class="sub">{escape(doc.company)} · {escape(str(doc.from_date))} إلى {escape(str(doc.to_date))} · الحالة: {escape(doc.status)}</div>
    <div class="advisory"><b>تنبيه مهني:</b> هذه الحزمة توجيه ومساندة للمحاسب وليست اعتمادًا تلقائيًا، ولا تنشئ قيودًا ولا تغلق فترة ولا تمنع المحاسب من المتابعة.</div>
    <table class="summary" role="presentation"><tr><td class="score">{guidance['score']}%</td><td>فحوص مكتملة<strong>{guidance['checklist']['مكتمل']}</strong></td><td>استثناءات مفتوحة<strong>{_open_exception_summary(doc)['open']}</strong></td><td>قيود مسودة<strong>{(signals.get('draft_journals') or {}).get('count') if (signals.get('draft_journals') or {}).get('available') else '—'}</strong></td></tr></table>
    <h2>التوصيات الحالية</h2><ul>{recommendation_rows}</ul>
    <h2 class="new-page">قائمة الإقفال الإرشادية</h2><table><thead><tr><th>#</th><th>المجال</th><th>الفحص</th><th>الحالة</th><th>ملاحظة المحاسب</th></tr></thead><tbody>{checklist_rows}</tbody></table>
    <h2>مطابقة القوائم</h2><table><thead><tr><th>البند</th><th>المُدخل</th><th>المحسوب</th><th>النتيجة</th></tr></thead><tbody>{comparison_rows}</tbody></table>
    <h2>الاستثناءات</h2><table><thead><tr><th>#</th><th>الفئة</th><th>العنوان</th><th>المبلغ</th><th>الحالة</th><th>الإجراء</th></tr></thead><tbody>{exception_rows}</tbody></table>
    <h2>سجل إجراءات الأداة</h2><table><thead><tr><th>الوقت</th><th>الحدث</th><th>المستخدم</th><th>الجاهزية</th><th>التفاصيل</th></tr></thead><tbody>{events}</tbody></table>
    <div class="footer">مولّدة من Arabic Pro · ملف إرشادي للمراجعة الداخلية · {escape(str(now_datetime()))}</div>
    </body></html>"""
    return get_pdf(html, {"orientation": "Landscape", "page-size": "A4", "margin-top": "10mm", "margin-right": "8mm", "margin-bottom": "10mm", "margin-left": "8mm"})


@frappe.whitelist()
def download_closing_package(name):
    doc = _load_doc(name, "read")
    frappe.local.response.filename = f"closing-review-{doc.name}.pdf"
    frappe.local.response.filecontent = build_closing_package_pdf(doc)
    frappe.local.response.type = "pdf"
