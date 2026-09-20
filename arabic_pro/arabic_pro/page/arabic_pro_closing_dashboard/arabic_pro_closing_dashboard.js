/* global frappe */
const AP_CLOSE_DASH_METHOD = "arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file.get_closing_dashboard";

function apDashEscape(value) {
	return frappe.utils.escape_html(String(value || ""));
}

function apDashRender(page, data, filters, refresh) {
	const counts = data.status_counts || {};
	const companyOptions = [`<option value="">كل الشركات</option>`].concat((data.companies || []).map((row) => `<option value="${apDashEscape(row.name)}" ${row.name === filters.company ? "selected" : ""}>${apDashEscape(row.name)}</option>`)).join("");
	const rows = (data.items || []).map((item) => `<tr>
		<td><a href="/app/arabic-pro-closing-file/${encodeURIComponent(item.name)}">${apDashEscape(item.name)}</a></td>
		<td>${apDashEscape(item.company)}</td><td><bdi>${apDashEscape(item.from_date)}</bdi> — <bdi>${apDashEscape(item.to_date)}</bdi></td>
		<td><span class="ap-dash-state">${apDashEscape(item.status)}</span></td>
		<td><div class="ap-dash-score"><i style="width:${Math.max(0, Math.min(100, Number(item.readiness_score || 0)))}%"></i></div><bdi>${Number(item.readiness_score || 0)}%</bdi></td>
		<td><bdi>${Number(item.checklist_done || 0)}/${Number(item.checklist_applicable || 0)}</bdi></td><td>${Number(item.open_exceptions || 0)}</td>
	</tr>`).join("") || `<tr><td colspan="7" class="ap-dash-empty">لا توجد ملفات ضمن المرشحات الحالية.</td></tr>`;
	page.main.html(`<main class="ap-close-dashboard" dir="rtl" lang="ar">
		<header><div><span>Arabic Pro · رؤية شهرية وسنوية</span><h1>لوحة متابعة الإقفال</h1><p>مؤشرات توجيهية تساعد فريق المحاسبة على معرفة ما يحتاج انتباهًا، ولا تمنع أي إجراء محاسبي.</p></div><a href="/app/arabic-pro-closing-file/new-arabic-pro-closing-file">إنشاء ملف إرشادي</a></header>
		<section class="ap-dash-filters" aria-label="مرشحات لوحة الإقفال"><label>الشركة<select data-ap-dash-company>${companyOptions}</select></label><label>السنة<input data-ap-dash-year type="number" min="2000" max="2100" value="${Number(filters.year)}"></label><button type="button" data-ap-dash-refresh>تطبيق</button><small>يمكنك عرض كل الشركات أو متابعة سنة محددة.</small></section>
		<section class="ap-dash-cards"><article><span>كل الملفات</span><strong>${(data.items || []).length}</strong></article><article><span>مسودة</span><strong>${counts["مسودة"] || 0}</strong></article><article><span>قيد المراجعة</span><strong>${counts["جاهز للمراجعة"] || 0}</strong></article><article><span>معتمد</span><strong>${counts["معتمد"] || 0}</strong></article><article class="alert"><span>إعادة مراجعة</span><strong>${counts["بحاجة إلى إعادة مراجعة"] || 0}</strong></article></section>
		<section class="ap-dash-table"><div><h2>الفترات</h2><p>نسبة الجاهزية ناتجة من قائمة الفحوص الاختيارية فقط.</p></div><div class="ap-close-table-wrap"><table><thead><tr><th>الملف</th><th>الشركة</th><th>الفترة</th><th>الحالة</th><th>الجاهزية</th><th>الفحوص</th><th>استثناءات مفتوحة</th></tr></thead><tbody>${rows}</tbody></table></div></section>
	</main>`);
	page.main.find("[data-ap-dash-refresh]").on("click", () => {
		filters.company = page.main.find("[data-ap-dash-company]").val() || "";
		filters.year = Number(page.main.find("[data-ap-dash-year]").val()) || new Date().getFullYear();
		refresh();
	});
}

frappe.pages["arabic-pro-closing-dashboard"].on_page_load = function (wrapper) {
	const page = frappe.ui.make_app_page({ parent: wrapper, title: "لوحة متابعة الإقفال", single_column: true });
	const filters = { company: "", year: new Date().getFullYear() };
	async function refresh() {
		page.main.html(`<div class="text-muted" style="padding:32px;text-align:center">جارٍ قراءة ملفات الإقفال…</div>`);
		const response = await frappe.call({ method: AP_CLOSE_DASH_METHOD, args: filters, freeze: false });
		apDashRender(page, response.message || {}, filters, refresh);
	}
	page.set_primary_action("تحديث", refresh, "refresh");
	refresh();
};
