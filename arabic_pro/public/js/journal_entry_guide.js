/* global frappe */
// Contextual explanations only. ERPNext's Journal Entry type values are untouched.
;(function () {
	"use strict";

	const TYPES = [
		["Journal Entry", "قيد يومية عام", "تسوية أو استحقاق أو تصحيح محاسبي لا يوجد له مستند متخصص.", "للفواتير والمدفوعات المعتادة استخدم مستند الفاتورة أو قيد الدفع."],
		["Inter Company Journal Entry", "قيد بين شركتين", "لتسجيل أثر عملية بين شركتين مرتبطتين؛ لكل شركة قيد مستقل ومتوازن.", "راجع القيد المقابل في الشركة الثانية ولا تخلط حسابات الشركتين في قيد واحد."],
		["Bank Entry", "حركة بنكية بقيد يومية", "لقيد بنكي يحتاج معالجة محاسبية مباشرة.", "لتحصيل فاتورة عميل أو دفع مورد استخدم قيد الدفع غالبًا."],
		["Cash Entry", "حركة صندوق بقيد يومية", "لقيد حركة نقدية تخص صندوق الشركة.", "للمدفوعات والتحصيلات المرتبطة بفواتير استخدم قيد الدفع غالبًا."],
		["Credit Card Entry", "حركة بطاقة ائتمان", "لتصنيف حركة بطاقة مسجلة بقيد يومية.", "تحقق من حساب البطاقة والمستند الأصلي وسياسة تسوية البطاقة."],
		["Debit Note", "قيد إشعار مدين", "لتصنيف تسوية تُنشئ مطالبة مدينة أو تخفّض مستحقًا.", "لمرتجع مشتريات مرتبط بفاتورة استخدم إشعار المدين أو مرتجع الشراء المخصص."],
		["Credit Note", "قيد إشعار دائن", "لتصنيف تسوية تُنشئ رصيدًا دائنًا أو تخفّض مستحقًا.", "لمرتجع مبيعات مرتبط بفاتورة استخدم إشعار الدائن أو مرتجع البيع المخصص."],
		["Contra Entry", "تحويل داخلي بين النقد والبنوك", "لنقل مبلغ بين صندوق وبنك أو بين حسابين بنكيين للشركة.", "التحويل الداخلي ليس إيرادًا ولا مصروفًا."],
		["Excise Entry", "قيد ضريبة انتقائية", "لتصنيف قيد متعلق بالضريبة الانتقائية عند تطبيقها.", "لا تستخدمه للضريبة العامة؛ راجع إعدادات الضريبة والمتطلبات المحلية."],
		["Write Off Entry", "قيد شطب رصيد", "لشطب رصيد عميل أو مورد بعد اعتماد سبب الشطب.", "راجع الفاتورة والطرف وسياسة الديون المعدومة قبل الاعتماد."],
		["Opening Entry", "قيد أرصدة افتتاحية", "لإدخال أرصدة الانتقال إلى ERPNext عند بدء التشغيل أو الترحيل من نظام سابق.", "لا تنشئ قيدًا افتتاحيًا جديدًا تلقائيًا كل سنة؛ أرصدة الميزانية تستمر."],
		["Depreciation Entry", "قيد إهلاك أصل", "لتسجيل مصروف الإهلاك ومجمع الإهلاك للأصول.", "إذا كانت الأصول مُدارة في النظام، راجع جدول الإهلاك وسير عمل الأصل أولًا."],
		["Exchange Rate Revaluation", "قيد إعادة تقييم عملة", "لإثبات أثر إعادة تقييم أرصدة العملات الأجنبية بسعر نهاية الفترة.", "راجع مستند إعادة تقييم سعر الصرف وسعره وتاريخه قبل اعتماد القيد."],
		["Exchange Gain Or Loss", "قيد فروق عملة", "لتسجيل ربح أو خسارة ناتجة من فرق سعر الصرف.", "تحقق من سبب الفرق ومن حساب الربح أو الخسارة المرتبط به."],
		["Deferred Revenue", "قيد إيراد مؤجل", "لإثبات أو تسوية إيراد يُعترف به على فترات لاحقة.", "استخدم إعدادات الإيراد المؤجل في المستند الأصلي عندما تنطبق."],
		["Deferred Expense", "قيد مصروف مؤجل", "لإثبات أو تسوية مصروف يُحمّل على فترات لاحقة.", "استخدم إعدادات المصروف المؤجل في المستند الأصلي عندما تنطبق."],
	].map(function (item) {
		return { value: item[0], label: item[1], use: item[2], caution: item[3] };
	});
	const BY_VALUE = Object.fromEntries(TYPES.map(function (type) { return [type.value, type]; }));

	function isArabic() {
		const lang = frappe.boot && (frappe.boot.lang || (frappe.boot.user && frappe.boot.user.language));
		return /^ar(?:$|-|_)/i.test(lang || document.documentElement.lang || "");
	}

	function escapeHtml(value) {
		return String(value || "").replace(/[&<>"']/g, function (char) {
			return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
		});
	}

	function normalize(value) {
		return String(value || "").toLowerCase().replace(/[\u064b-\u065f\u0670]/g, "")
			.replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
	}

	function translateOptions(field) {
		const select = field && field.$input && field.$input[0];
		if (!select || select.tagName !== "SELECT") return;
		Array.from(select.options).forEach(function (option) {
			const type = BY_VALUE[option.value];
			if (type) option.textContent = type.label;
		});
	}

	function render(frm) {
		if (!isArabic() || !frm.fields_dict.voucher_type) return;
		const field = frm.fields_dict.voucher_type;
		const $wrapper = field.$wrapper;
		if (!$wrapper || !$wrapper.length) return;
		translateOptions(field);
		$wrapper.find(".ap-journal-type-helper").remove();
		const selected = BY_VALUE[frm.doc.voucher_type];
		const $helper = $(
			'<div class="ap-journal-type-helper" dir="rtl">' +
			'<span class="ap-journal-type-summary"></span>' +
			'<span class="ap-journal-type-actions"><button type="button" class="ap-journal-type-open">شرح أنواع القيود</button>' +
			'<a href="/app/arabic-pro-accounting-guide" target="_blank" rel="noopener noreferrer">دليل الدورة المحاسبية ↗</a></span></div>'
		);
		$helper.find(".ap-journal-type-summary").text(selected ? selected.use : "اختر نوع القيد بحسب الغرض المحاسبي للعملية.");
		$helper.find(".ap-journal-type-open").on("click", function () { openGuide(frm); });
		$wrapper.append($helper);
	}

	function openGuide(frm) {
		let active = BY_VALUE[frm.doc.voucher_type] || TYPES[0];
		const dialog = new frappe.ui.Dialog({
			title: "متى أستخدم كل نوع قيد؟",
			size: "large",
			fields: [{ fieldtype: "HTML", fieldname: "guide_html" }],
		});
		dialog.show();
		const $panel = dialog.fields_dict.guide_html.$wrapper;
		$panel.html(
			'<div class="ap-journal-guide" dir="rtl">' +
			'<p class="ap-journal-guide-note">اختر النوع وفق العملية، ثم راجع الحسابات والمدين والدائن. حفظ المسودة لا يرحّلها؛ الترحيل إلى دفتر الأستاذ يحدث بعد الاعتماد.</p>' +
			'<div class="ap-journal-guide-layout"><div><label for="ap-journal-type-search">ابحث عن نوع القيد</label>' +
			'<input id="ap-journal-type-search" type="search" class="form-control" placeholder="مثل: افتتاحي أو تحويل داخلي" />' +
			'<div class="ap-journal-guide-options" role="group" aria-label="أنواع القيود">' +
			TYPES.map(function (type) { return '<button type="button" class="ap-journal-guide-option" data-entry-type="' + escapeHtml(type.value) + '">' + escapeHtml(type.label) + '</button>'; }).join("") +
			'</div></div><div class="ap-journal-guide-detail" aria-live="polite"></div></div>' +
			'<div class="ap-journal-guide-footer"><a href="/app/arabic-pro-accounting-guide" target="_blank" rel="noopener noreferrer">اقرأ رحلة القيد حتى القوائم المالية ←</a>' +
			'<a href="https://docs.frappe.io/erpnext/journal-entry" target="_blank" rel="noopener noreferrer">وثائق ERPNext الرسمية ↗</a></div></div>'
		);
		function showDetail() {
			$panel.find(".ap-journal-guide-option").each(function () {
				const selected = this.dataset.entryType === active.value;
				$(this).toggleClass("is-active", selected).attr("aria-pressed", selected ? "true" : "false");
			});
			$panel.find(".ap-journal-guide-detail").html(
				'<span class="ap-journal-guide-eyebrow">نوع القيد</span><h4>' + escapeHtml(active.label) + '</h4>' +
				'<h5>متى يفيدك؟</h5><p>' + escapeHtml(active.use) + '</p>' +
				'<h5>انتبه إلى</h5><p>' + escapeHtml(active.caution) + '</p>'
			);
		}
		$panel.on("click", ".ap-journal-guide-option", function () {
			active = BY_VALUE[this.dataset.entryType];
			showDetail();
		});
		$panel.on("input", "#ap-journal-type-search", function () {
			const query = normalize(this.value);
			$panel.find(".ap-journal-guide-option").each(function () {
				const type = BY_VALUE[this.dataset.entryType];
				$(this).toggle(!query || normalize(type.label + " " + type.use + " " + type.caution).includes(query));
			});
		});
		showDetail();
	}

	frappe.ui.form.on("Journal Entry", { refresh: render, voucher_type: render });
})();
