"""Focused smoke checks for the close-review workflow on a development site."""

from pathlib import Path

import frappe

from arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file import (
    SIGNAL_CONTROLS,
    _report_values,
    _save_action,
    approve_review,
    build_closing_package_pdf,
    get_review_state,
    on_gl_entry_change,
    reopen_review,
    submit_for_review,
)


def ensure_visual_sample():
    """Create one clearly labelled local-only sample for UI and PDF inspection."""
    frappe.set_user("Administrator")
    company = "جزيرة التوت" if frappe.db.exists("Company", "جزيرة التوت") else frappe.get_all("Company", pluck="name", limit=1)[0]
    existing = frappe.db.exists("Arabic Pro Closing File", {"company": company, "from_date": "2026-01-01", "to_date": "2026-09-19"})
    if existing:
        return existing
    doc = frappe.get_doc({
        "doctype": "Arabic Pro Closing File",
        "company": company,
        "from_date": "2026-01-01",
        "to_date": "2026-09-19",
        "materiality_threshold": 500,
        "review_note": "ملف محلي لمعاينة المساعد الإرشادي وحزمة الإقفال.",
    }).insert()
    for index, row in enumerate(doc.checklist):
        row.status = "مكتمل" if index < 3 else "قيد المراجعة" if index == 3 else "غير منطبق" if index == 8 else "لم يبدأ"
        if index == 3:
            row.notes = "مراجعة أعمار الذمم والدفعات غير المخصصة قبل نهاية الفترة."
    doc.append("exceptions", {
        "category": "أخرى", "title": "مثال توجيهي: توثيق تفسير فرق قبل اعتماده",
        "amount": 750, "status": "مفتوح", "reason": "بانتظار مراجعة المستند المؤيد",
    })
    _save_action(doc)
    frappe.db.commit()
    return doc.name


def write_visual_pdf(name, path="/tmp/arabic-pro-closing-review.pdf"):
    doc = frappe.get_doc("Arabic Pro Closing File", name)
    payload = build_closing_package_pdf(doc)
    Path(path).write_bytes(payload)
    return {"path": path, "bytes": len(payload)}


def _other_manager():
    candidates = frappe.get_all(
        "Has Role",
        filters={"role": "Accounts Manager", "parenttype": "User", "parent": ["!=", "Administrator"]},
        pluck="parent",
        limit=20,
    )
    return next((user for user in candidates if frappe.db.get_value("User", user, "enabled")), None)


def smoke_check():
    """Confirm incomplete guidance is visible but never blocks review submission."""
    frappe.set_user("Administrator")
    company = frappe.get_all("Company", pluck="name", limit=1)[0]
    other_manager = _other_manager()
    assert other_manager, "An active Accounts Manager is needed for this smoke check"
    evidence = frappe.get_all("File", fields=["file_url"], filters={"file_url": ["is", "set"]}, limit=1)[0].file_url
    savepoint = "arabic_pro_close_smoke"
    frappe.db.savepoint(savepoint)
    try:
        doc = frappe.get_doc({
            "doctype": "Arabic Pro Closing File",
            "company": company,
            "from_date": "2025-02-01",
            "to_date": "2025-02-28",
            "materiality_threshold": 100,
            "reviewer": other_manager,
            "trial_balance_debit": 1000,
            "trial_balance_credit": 1000,
            "reports_file": evidence,
        })
        doc.append("exceptions", {
            "category": "البنك", "title": "فرق اختبار غير محفوظ", "amount": 120,
            "status": "مفتوح", "responsible": "Administrator",
        })
        doc.insert()
        state = get_review_state(doc.name)
        assert state["exceptions"]["open"] == 1
        assert state["exceptions"]["high"] == 1
        assert state["snapshot_at"] is None
        submitted = submit_for_review(doc.name)
        assert submitted["status"] == "جاهز للمراجعة"
        assert submitted["guidance"]["advisory_only"] is True
        assert submitted["guidance"]["recommendations"]
        return {"created": doc.name, "open": state["exceptions"]["open"], "priority": "مرتفعة", "guidance": "non_blocking"}
    finally:
        frappe.db.rollback(save_point=savepoint)


def smoke_review_flow():
    """Exercise report matching, approval, audit reopening and automatic revocation."""
    frappe.set_user("Administrator")
    company = frappe.get_all("Company", pluck="name", limit=1)[0]
    other_manager = _other_manager()
    assert other_manager, "An active Accounts Manager is needed for this smoke check"
    evidence = frappe.get_all("File", fields=["file_url"], filters={"file_url": ["is", "set"]}, limit=1)[0].file_url
    savepoint = "arabic_pro_close_review_flow"
    frappe.db.savepoint(savepoint)
    try:
        doc = frappe.get_doc({
            "doctype": "Arabic Pro Closing File",
            "company": company,
            "from_date": "2025-03-01",
            "to_date": "2025-03-31",
            "reviewer": "Administrator",
            "materiality_threshold": 100,
            "reports_file": evidence,
        })
        for field, amount in _report_values(doc)["values"].items():
            doc.set(field, amount)
        for control in SIGNAL_CONTROLS.values():
            doc.append("exceptions", {
                "category": "أخرى", "title": f"مراجعة مؤشر {control}", "control_signal": control,
                "amount": 0, "status": "مغلق", "reason": "اختبار",
                "action_taken": "تأكد المحاسب من المستندات", "evidence_file": evidence,
                "responsible": "Administrator",
            })
        doc.insert()
        try:
            submit_for_review(doc.name)
        except frappe.ValidationError:
            pass
        else:
            raise AssertionError("The preparer must not review their own file")
        doc.prepared_by = other_manager
        _save_action(doc)
        doc.reload()
        doc.net_profit = doc.net_profit + 1
        doc.save()
        state = submit_for_review(doc.name)
        assert state["status"] == "جاهز للمراجعة"
        assert any("تختلف" in item["title"] for item in state["guidance"]["recommendations"])
        assert approve_review(doc.name)["status"] == "معتمد"
        assert reopen_review(doc.name, "اختبار سبب إعادة الفتح")["status"] == "بحاجة إلى إعادة مراجعة"
        assert submit_for_review(doc.name)["status"] == "جاهز للمراجعة"
        assert approve_review(doc.name)["status"] == "معتمد"
        frappe.db.set_value("Arabic Pro Closing File", doc.name, "ledger_entry_count", -1, update_modified=False)
        state = get_review_state(doc.name)
        assert state["drift"] is True
        assert state["status"] == "بحاجة إلى إعادة مراجعة"
        assert state["invalidation_reason"]
        assert frappe.db.exists("Comment", {"reference_doctype": doc.doctype, "reference_name": doc.name})
        return {"report_mismatch": "advisory", "approval": "approved", "drift": "revoked", "audit": "recorded"}
    finally:
        frappe.db.rollback(save_point=savepoint)


def smoke_gl_event():
    """Ensure a posted GL document revokes only the matching approved period."""
    frappe.set_user("Administrator")
    company = frappe.get_all("Company", pluck="name", limit=1)[0]
    savepoint = "arabic_pro_close_gl_event"
    frappe.db.savepoint(savepoint)
    try:
        doc = frappe.get_doc({
            "doctype": "Arabic Pro Closing File", "company": company,
            "from_date": "2025-05-01", "to_date": "2025-05-31",
        }).insert()
        doc.status = "معتمد"
        _save_action(doc)
        on_gl_entry_change(frappe._dict({
            "company": company, "posting_date": "2025-06-01", "name": "TEST-OUTSIDE",
        }), "after_insert")
        assert frappe.db.get_value(doc.doctype, doc.name, "status") == "معتمد"
        on_gl_entry_change(frappe._dict({
            "company": company, "posting_date": "2025-05-15", "name": "TEST-INSIDE",
        }), "after_insert")
        assert frappe.db.get_value(doc.doctype, doc.name, "status") == "بحاجة إلى إعادة مراجعة"
        assert "TEST-INSIDE" in frappe.db.get_value(doc.doctype, doc.name, "invalidation_reason")
        return {"outside_period": "unchanged", "inside_period": "revoked"}
    finally:
        frappe.db.rollback(save_point=savepoint)
