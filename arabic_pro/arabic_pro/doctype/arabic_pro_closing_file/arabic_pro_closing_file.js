/* global frappe */
const AP_CLOSE_METHOD = "arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file";

function apCloseNumber(value) {
	return Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function apCloseEscape(value) {
	return frappe.utils.escape_html(String(value || ""));
}

function apCloseSignal(signal) {
	return signal?.available ? apCloseNumber(signal.count) : "—";
}

function apCloseComparison(state) {
	const report = state?.report;
	if (!report) return `<div class="ap-close-verify ap-close-verify--pending"><strong>لم تُفحص التقارير بعد</strong><p>يمكنك تشغيل الفحص أو متابعة العمل بدونه. النتيجة إرشادية ولا تمنع المحاسب من المتابعة.</p></div>`;
	const rows = (state.report_comparison || []).map((row) => `<tr>
		<td>${apCloseEscape(row.label)}</td><td dir="ltr">${apCloseNumber(row.entered)}</td>
		<td dir="ltr">${apCloseNumber(row.calculated)}</td><td class="${row.matched ? "ap-close-match" : "ap-close-mismatch"}" dir="ltr">${row.matched ? "مطابق" : apCloseNumber(row.difference)}</td>
	</tr>`).join("");
	const stale = Boolean(state?.drift || state?.invalidation_reason);
	const allMatch = !stale && (state.report_comparison || []).length === 6 && state.report_comparison.every((row) => row.matched);
	return `<section class="ap-close-verify ${allMatch ? "ap-close-verify--matched" : "ap-close-verify--pending"}" aria-label="مطابقة التقارير">
		<div class="ap-close-verify-head"><div><strong>مطابقة تقارير ERPNext</strong><small>${apCloseEscape(report.scope)} · <bdi>${apCloseEscape(report.currency)}</bdi> · فُحصت <bdi>${apCloseEscape(report.checked_at)}</bdi></small></div><span>${stale ? "لقطة سابقة — يُفضّل إعادة الفحص" : allMatch ? "٦ من ٦ مطابقة" : "فروق مقترح مراجعتها"}</span></div>
		<div class="ap-close-table-wrap"><table><thead><tr><th>البند</th><th>المُدخل</th><th>من التقرير</th><th>النتيجة / الفرق</th></tr></thead><tbody>${rows}</tbody></table></div>
		<p>يُقرأ ميزان المراجعة من الأرصدة الختامية، وقائمة الدخل للفترة، والميزانية حتى نهاية الفترة. طابق نسخ التقارير المرفقة مع نطاق الملف نفسه.</p>
	</section>`;
}

function apCloseGuidance(state) {
	const guidance = state?.guidance;
	if (!guidance) return "";
	const summary = guidance.checklist || {};
	const recommendations = (guidance.recommendations || []).slice(0, 6).map((item) => `<article class="ap-close-tip ap-close-tip--${apCloseEscape(item.level)}">
		<div><strong>${apCloseEscape(item.title)}</strong><p>${apCloseEscape(item.detail)}</p></div>
		${item.route ? `<a href="${apCloseEscape(item.route)}">${apCloseEscape(item.action_label || "فتح")}</a>` : ""}
	</article>`).join("") || `<article class="ap-close-tip ap-close-tip--success"><div><strong>لا توجد ملاحظات آلية بارزة</strong><p>أكمل المراجعة المهنية للمستندات والتقديرات وفق سياسة المنشأة.</p></div></article>`;
	const next = guidance.next_step || {};
	return `<section class="ap-close-advisor" aria-label="مساعد الإقفال الإرشادي">
		<div class="ap-close-advisor-head"><div><span>مساعد الإقفال الإرشادي</span><h3>جاهزية المتابعة <bdi>${apCloseNumber(guidance.score)}%</bdi></h3><p>المؤشر توجيهي فقط؛ لا يمنع الحفظ أو العمل المحاسبي.</p></div><div class="ap-close-progress" aria-label="نسبة اكتمال القائمة"><i style="width:${Math.max(0, Math.min(100, Number(guidance.score || 0)))}%"></i></div></div>
		<div class="ap-close-check-stats"><span>مكتمل <bdi>${apCloseNumber(summary["مكتمل"])}</bdi></span><span>قيد المراجعة <bdi>${apCloseNumber(summary["قيد المراجعة"])}</bdi></span><span>غير منطبق <bdi>${apCloseNumber(summary["غير منطبق"])}</bdi></span><span>لم يبدأ <bdi>${apCloseNumber(summary["لم يبدأ"])}</bdi></span></div>
		<div class="ap-close-next"><span>الخطوة المقترحة الآن</span><strong>${apCloseEscape(next.title)}</strong><p>${apCloseEscape(next.detail)}</p>${next.route ? `<a href="${apCloseEscape(next.route)}">${apCloseEscape(next.action_label || "فتح")}</a>` : ""}</div>
		<div class="ap-close-tips">${recommendations}</div>
	</section>`;
}

function apCloseRender(frm, state) {
	const doc = frm.doc;
	const status = state?.status || doc.status || "مسودة";
	const exceptions = state?.exceptions || { total: (doc.exceptions || []).length, open: (doc.exceptions || []).filter((row) => row.status !== "مغلق").length, high: 0, unassigned: 0 };
	const signals = state?.signals || {};
	const drift = Boolean(state?.drift);
	const hasSnapshot = Boolean(state?.snapshot_at);
	const effectiveStatus = drift ? "تغيّرت حركات الفترة" : status;
	const statusClass = drift || status === "بحاجة إلى إعادة مراجعة" ? "drift" : status === "معتمد" ? "approved" : status === "جاهز للمراجعة" ? "review" : "draft";
	const company = apCloseEscape(doc.company || "اختر الشركة");
	const reportQuery = doc.company && doc.from_date && doc.to_date ? `?${new URLSearchParams({ company: doc.company, from_date: doc.from_date, to_date: doc.to_date })}` : "";
	const trialFilters = doc.company && doc.from_date && doc.to_date ? { company: doc.company, from_date: doc.from_date, to_date: doc.to_date, include_default_book_entries: "1" } : null;
	if (trialFilters && state?.report?.fiscal_year) trialFilters.fiscal_year = state.report.fiscal_year;
	const trialQuery = trialFilters ? `?${new URLSearchParams(trialFilters)}` : "";
	const statementsQuery = doc.company && doc.from_date && doc.to_date ? `?${new URLSearchParams({ company: doc.company, filter_based_on: "Date Range", period_start_date: doc.from_date, period_end_date: doc.to_date, periodicity: "Yearly", accumulated_values: "1", include_default_book_entries: "1" })}` : "";
	const period = doc.from_date && doc.to_date ? `<bdi>${apCloseEscape(doc.from_date)}</bdi> — <bdi>${apCloseEscape(doc.to_date)}</bdi>` : "حدد بداية الفترة ونهايتها";
	const line = state?.invalidation_reason
		? apCloseEscape(state.invalidation_reason)
		: drift
		? `تغيّر دفتر الأستاذ بعد التقاط البصمة: ${apCloseNumber(state.ledger.changed_count)} سطر أضيف أو عُدّل، أو تغيرت مجاميع الفترة. راجع أثر ذلك وأعد إرسال الملف للمراجعة.`
		: hasSnapshot
			? `آخر بصمة بتاريخ <bdi>${apCloseEscape(state.snapshot_at)}</bdi>. لا تعني هذه البصمة تجميد الفترة أو صحة التصنيف.`
			: "بعد توثيق الفروق وإرفاق التقارير، أرسل الملف للمراجعة لالتقاط بصمة دفتر الأستاذ.";
	const metrics = [
		["الفروق المفتوحة", apCloseNumber(exceptions.open), exceptions.open ? "تحتاج معالجة" : "لا توجد فروق مفتوحة"],
		["عالية الأولوية", apCloseNumber(exceptions.high), "بحسب حد الأهمية الذي حددته"],
		["بلا مسؤول", apCloseNumber(exceptions.unassigned), "من الفروق المفتوحة"],
		["قيود مسودة", apCloseSignal(signals.draft_journals), "تحقق هل تخص الفترة"],
		["بنك غير مطابق", apCloseSignal(signals.unreconciled_bank_transactions), "ضمن المعاملات المستوردة"],
		["دفعات غير مخصصة", apCloseSignal(signals.unallocated_payments), "قد تكون سلفًا مقصودة"],
	];
	const cards = metrics.map(([label, value, hint]) => `<div class="ap-close-metric"><span>${label}</span><strong dir="ltr">${value}</strong><small>${hint}</small></div>`).join("");
	const html = `
		<section class="ap-close-desk" dir="rtl" lang="ar" aria-label="ملخص ملف مراجعة الإقفال">
			<header class="ap-close-head">
				<div><span class="ap-close-kicker">Arabic Pro · ورقة عمل للمحاسب</span><h2>ملف مراجعة الإقفال</h2><p>${company} <span aria-hidden="true">·</span> ${period}</p></div>
				<span class="ap-close-status ap-close-status--${statusClass}">${apCloseEscape(effectiveStatus)}</span>
			</header>
			<div class="ap-close-stage" aria-label="مراحل الملف"><span>١ استرشاد وفحص</span><span>٢ مراجعة اختيارية</span><span>٣ اعتماد مستقل عند الحاجة</span></div>
			<div class="ap-close-metrics">${cards}</div>
			<div class="ap-close-ledger ${drift || state?.invalidation_reason ? "ap-close-ledger--alert" : ""}"><strong>${drift || state?.invalidation_reason ? "تنبيه: يجب إعادة المراجعة" : "بصمة حركة الفترة"}</strong><p>${line}</p></div>
			${apCloseGuidance(state)}
			${apCloseComparison(state)}
			<div class="ap-close-bottom"><p><b>غير ملزم:</b> هذه ورقة توجيه وليست قيد إقفال. لا ينشئ النظام أي قيد أو يغلق فترة أو يمنع المحاسب من المتابعة. المراجع مستقل فقط إذا اختارت المنشأة استخدام الاعتماد الرسمي داخل الأداة.</p><nav aria-label="تقارير ومهام مرتبطة"><a href="/app/query-report/Trial%20Balance${trialQuery}">ميزان المراجعة</a><a href="/app/query-report/Profit%20and%20Loss%20Statement${statementsQuery}">قائمة الدخل</a><a href="/app/query-report/Balance%20Sheet${statementsQuery}">الميزانية العمومية</a><a href="/app/query-report/General%20Ledger${reportQuery}">دفتر الأستاذ</a><a href="/app/period-closing-voucher">قيد الإقفال</a><a href="/app/accounting-period">الفترة المحاسبية</a></nav></div>
		</section>`;
	frm.get_field("review_dashboard").$wrapper.html(html);
}

async function apCloseAction(frm, method, message) {
	if (frm.is_dirty()) {
		frappe.msgprint("احفظ تغييرات الملف أولًا، ثم أعد تنفيذ الإجراء.");
		return;
	}
	frappe.confirm(message, async () => {
		try {
			await frappe.call({ method: `${AP_CLOSE_METHOD}.${method}`, args: { name: frm.doc.name }, freeze: true });
			await frm.reload_doc();
		} catch (error) {
			console.error("Arabic Pro closing review action failed", error);
		}
	});
}

async function apCloseVerify(frm) {
	if (frm.is_dirty()) {
		frappe.msgprint("احفظ تغييرات الملف أولًا، ثم افحص التقارير.");
		return;
	}
	try {
		await frappe.call({ method: `${AP_CLOSE_METHOD}.verify_reports`, args: { name: frm.doc.name }, freeze: true });
		await frm.reload_doc();
	} catch (error) {
		console.error("Arabic Pro report verification failed", error);
	}
}

function apCloseApplySuggestions(frm) {
	if (frm.is_dirty()) {
		frappe.msgprint("احفظ تغييرات الملف أولًا، ثم اطلب التعبئة المقترحة.");
		return;
	}
	frappe.confirm("سيتم نسخ القيم الحالية من تقارير ERPNext إلى حقول المطابقة فقط. لن يُنشأ أي قيد ولن تُغلق الفترة. هل تريد المتابعة؟", async () => {
		try {
			await frappe.call({ method: `${AP_CLOSE_METHOD}.apply_report_suggestions`, args: { name: frm.doc.name }, freeze: true });
			await frm.reload_doc();
		} catch (error) {
			console.error("Arabic Pro suggested values failed", error);
		}
	});
}

function apCloseDownload(frm) {
	const method = `${AP_CLOSE_METHOD}.download_closing_package`;
	window.open(`/api/method/${method}?name=${encodeURIComponent(frm.doc.name)}`, "_blank", "noopener");
}

function apCloseReopen(frm) {
	if (frm.is_dirty()) {
		frappe.msgprint("احفظ تغييرات الملف أولًا، ثم أعد فتح المراجعة.");
		return;
	}
	frappe.prompt([{ fieldname: "reason", fieldtype: "Small Text", label: "سبب إعادة فتح المراجعة", reqd: 1 }], async (values) => {
		try {
			await frappe.call({ method: `${AP_CLOSE_METHOD}.reopen_review`, args: { name: frm.doc.name, reason: values.reason }, freeze: true });
			await frm.reload_doc();
		} catch (error) {
			console.error("Arabic Pro review reopening failed", error);
		}
	}, "توثيق سبب إعادة الفتح", "إعادة فتح");
}

frappe.ui.form.on("Arabic Pro Closing File", {
	onload(frm) {
		if (!frm.is_new()) return;
		const today = frappe.datetime.get_today();
		if (!frm.doc.from_date) frm.set_value("from_date", `${today.slice(0, 4)}-01-01`);
		if (!frm.doc.to_date) frm.set_value("to_date", today);
		const company = frappe.defaults?.get_user_default?.("Company");
		if (company && !frm.doc.company) frm.set_value("company", company);
	},
	async refresh(frm) {
		if (frm.is_new()) {
			apCloseRender(frm, null);
			return;
		}
		try {
			const response = await frappe.call({ method: `${AP_CLOSE_METHOD}.get_review_state`, args: { name: frm.doc.name } });
			const state = response.message;
			apCloseRender(frm, state);
			if (["مسودة", "بحاجة إلى إعادة مراجعة"].includes(state.status)) {
				frm.add_custom_button("تحقق من التقارير", () => apCloseVerify(frm), "مساعد الإقفال");
				frm.add_custom_button("تعبئة القيم المقترحة", () => apCloseApplySuggestions(frm), "مساعد الإقفال");
				frm.add_custom_button("إرسال لمراجع مستقل", () => apCloseAction(frm, "submit_for_review", "هذا إجراء اختياري. سيُحفظ خط أساس لحركات الأستاذ وتُرسل الورقة للمراجع المكلّف حتى مع وجود توصيات غير مكتملة. هل تريد المتابعة؟"));
			}
			frm.add_custom_button("تنزيل حزمة الإقفال PDF", () => apCloseDownload(frm), "مساعد الإقفال");
			if (state.status === "جاهز للمراجعة" && state.can_review && !state.drift) {
				frm.add_custom_button("اعتماد المراجعة", () => apCloseAction(frm, "approve_review", "هل راجعت المستندات والفروق والتقارير بنفسك؟ الاعتماد لا يُنشئ قيد إقفال ولا يُجمّد الفترة."));
			}
			if (["جاهز للمراجعة", "معتمد"].includes(state.status) && (frappe.user.has_role("Accounts Manager") || frappe.user.has_role("System Manager") || frappe.session.user === "Administrator")) {
				frm.add_custom_button("إعادة فتح للمراجعة", () => apCloseReopen(frm), "الإجراءات");
			}
		} catch (error) {
			apCloseRender(frm, null);
			frappe.msgprint("تعذر قراءة مؤشرات ملف الإقفال. تحقق من صلاحيات الشركة وحاول تحديث الصفحة.");
		}
	},
	company(frm) { apCloseRender(frm, null); },
	from_date(frm) { apCloseRender(frm, null); },
	to_date(frm) { apCloseRender(frm, null); },
});
