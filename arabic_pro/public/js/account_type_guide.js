/* global frappe */
// Arabic guidance for ERPNext's Account Type. Never change the stored option values.
;(function () {
	"use strict";

	const TYPES = [
		["Accumulated Depreciation", "مجمع الإهلاك", "حساب مقابل للأصل يجمع الإهلاك منذ بدء استخدامه؛ لا تسجل فيه مصروف الإهلاك الدوري."],
		["Asset Received But Not Billed", "أصل مستلم ولم تُستلم فاتورته", "حساب وسيط لأصل ثابت استُلم قبل تسجيل فاتورة المورّد؛ يُسوّى عند ورود الفاتورة."],
		["Bank", "حساب بنكي", "رصيد حساب الشركة لدى البنك؛ يُستخدم في المدفوعات والتسوية البنكية."],
		["Cash", "صندوق نقدي", "نقد موجود في صندوق أو عهدة نقدية، وليس رصيدًا لدى البنك."],
		["Chargeable", "رسوم قابلة للتحميل", "رسوم أو مبالغ إضافية تُحمّل على المعاملة وفق إعدادات الضرائب والرسوم."],
		["Capital Work in Progress", "أعمال رأسمالية تحت التنفيذ", "تكاليف أصل لم يكتمل أو لم يصبح جاهزًا للاستخدام؛ تُنقل للأصل الثابت عند رسملته."],
		["Cost of Goods Sold", "تكلفة البضاعة المباعة", "تكلفة المخزون المباع التي تظهر ضمن تكلفة المبيعات."],
		["Current Asset", "أصل متداول", "أصل يُتوقع تحويله إلى نقد أو استخدامه خلال الدورة التشغيلية؛ استخدم نوعًا أدق إن وُجد."],
		["Current Liability", "التزام متداول", "التزام يُتوقع سداده خلال الدورة التشغيلية؛ استخدم نوع الموردين للذمم الدائنة."],
		["Depreciation", "مصروف الإهلاك", "مصروف الإهلاك الدوري في قائمة الدخل، وليس مجمع الإهلاك في الميزانية."],
		["Direct Expense", "مصروف مباشر", "مصروف يرتبط مباشرة بإنتاج السلع أو تقديم الخدمة."],
		["Direct Income", "إيراد مباشر", "إيراد ناتج من النشاط الأساسي للشركة."],
		["Equity", "حقوق ملكية", "رأس المال والاحتياطيات والأرباح المبقاة؛ لا يُستخدم للالتزامات تجاه الغير."],
		["Expense Account", "حساب مصروفات", "مصروفات التشغيل العامة عندما لا يلزم تصنيف مباشر أو غير مباشر."],
		["Expenses Included In Asset Valuation", "مصروفات ضمن تكلفة الأصل", "تكاليف تُضاف إلى قيمة الأصل الثابت عند اقتنائه أو تجهيزه."],
		["Expenses Included In Valuation", "مصروفات ضمن تقييم المخزون", "تكاليف شراء أو شحن تُحمّل على قيمة المخزون."],
		["Fixed Asset", "أصل ثابت", "أصل ملموس تستخدمه الشركة لأكثر من فترة، مثل الأثاث والمعدات؛ لا يُخصص للمخزون المعد للبيع."],
		["Income Account", "حساب إيرادات", "إيرادات المبيعات أو الخدمات التي تظهر في قائمة الدخل."],
		["Indirect Expense", "مصروف غير مباشر", "مصروف تشغيلي لا يرتبط مباشرة بوحدة منتج أو خدمة محددة."],
		["Indirect Income", "إيراد غير مباشر", "إيراد عرضي خارج النشاط الأساسي للشركة."],
		["Liability", "التزام", "مبلغ مستحق على الشركة؛ استخدم نوعًا متخصصًا مثل الذمم الدائنة عندما ينطبق."],
		["Payable", "ذمم دائنة للموردين", "حساب رقابي للمبالغ المستحقة للموردين؛ يتتبع النظام رصيد كل مورد على حدة."],
		["Receivable", "ذمم مدينة للعملاء", "حساب رقابي للمبالغ المستحقة من العملاء؛ يتتبع النظام رصيد كل عميل على حدة."],
		["Round Off", "فروق التقريب", "فروق صغيرة ناتجة عن تقريب المبالغ؛ الفروق الكبيرة تحتاج مراجعة سببها."],
		["Round Off for Opening", "فروق تقريب الأرصدة الافتتاحية", "فروق التقريب الخاصة بقيود وأرصدة الافتتاح فقط."],
		["Stock", "حساب المخزون", "قيمة البضاعة المخزنة في المستودعات؛ لا يُستخدم للأصول الثابتة."],
		["Stock Adjustment", "تسويات المخزون", "فروق الجرد أو تعديل قيمة المخزون المسجلة محاسبيًا."],
		["Stock Received But Not Billed", "مخزون مستلم ولم تُستلم فاتورته", "حساب وسيط لمخزون استُلم من المورد ولم تُسجل فاتورته بعد."],
		["Service Received But Not Billed", "خدمة مستلمة ولم تُستلم فاتورتها", "حساب وسيط لخدمة قُدمت للشركة قبل تسجيل فاتورة المورّد."],
		["Tax", "حساب ضريبي", "ضريبة تُسجل على المبيعات أو المشتريات؛ راجع طبيعة الحساب واتجاه رصيده."],
		["Temporary", "حساب مؤقت", "حساب تسوية مؤقت، مثل أرصدة افتتاح الفواتير؛ يجب متابعته وتسويته."],
	].map(function (entry) {
		return { value: entry[0], label: entry[1], help: entry[2] };
	});
	const BY_VALUE = Object.fromEntries(TYPES.map(function (type) { return [type.value, type]; }));

	function isArabic() {
		const lang = frappe.boot && (frappe.boot.lang || (frappe.boot.user && frappe.boot.user.language));
		return /^ar(?:$|-|_)/i.test(lang || document.documentElement.lang || "");
	}

	function normalize(value) {
		return String(value || "").toLowerCase()
			.replace(/[\u064b-\u065f\u0670]/g, "")
			.replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
	}

	function escapeHtml(value) {
		return String(value || "").replace(/[&<>"']/g, function (char) {
			return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
		});
	}

	function suggestion(frm) {
		if (Number(frm.doc.is_group)) return null;
		const root = frm.doc.root_type;
		const name = normalize(frm.doc.account_name);
		const parent = normalize(frm.doc.parent_account);
		const both = name + " " + parent;
		function propose(value, reason, expectedRoot) {
			if (expectedRoot && root && root !== expectedRoot) return null;
			return { type: BY_VALUE[value], reason: reason };
		}
		if (root === "Expense") {
			if (/تكلفه البضاعه المباعه|تكلفه المبيعات/.test(both))
				return propose("Cost of Goods Sold", "لأنه حساب تكلفة مبيعات.", "Expense");
			if (/مصروف.*اهلاك|استهلاك الاصول/.test(both))
				return propose("Depreciation", "لأنه مصروف إهلاك دوري في قائمة الدخل.", "Expense");
			return null;
		}
		if (root === "Income") {
			if (/ايراد|مبيعات/.test(both))
				return propose("Income Account", "لأنه حساب إيراد يظهر في قائمة الدخل.", "Income");
			return null;
		}
		if (root === "Liability") {
			if (/ذمم دائن|موردون|موردين/.test(both))
				return propose("Payable", "لأنه حساب رقابي لمستحقات الموردين.", "Liability");
			return null;
		}
		if (/مجمع.*اهلاك|اهلاك.*متراكم/.test(both))
			return propose("Accumulated Depreciation", "لأنه حساب مجمع الإهلاك، لا مصروف الإهلاك الدوري.", "Asset");
		if (/اعمال راسمالي|اصل.*تحت التنفيذ|مشروع.*تحت التنفيذ/.test(both))
			return propose("Capital Work in Progress", "لأن الأصل لم يكتمل أو لم يصبح جاهزًا للاستخدام.", "Asset");
		if (/بنك|مصرف|حساب جاري/.test(both))
			return propose("Bank", "لأنه يمثل رصيد الشركة لدى بنك.", "Asset");
		if (/صندوق|نقدي|كاش/.test(both))
			return propose("Cash", "لأنه يمثل نقدًا في صندوق الشركة.", "Asset");
		if (/ذمم مدين|عملاء|مدينون/.test(both))
			return propose("Receivable", "لأنه حساب رقابي لمستحقات العملاء.", "Asset");
		if (/بضاع|مخزون|مستودع/.test(both))
			return propose("Stock", "لأنه يمثل قيمة مخزون معد للبيع أو الاستخدام.", "Asset");
		if (/اثاث|مفروش|معدات|الات|اجهزه|مركبات|سيارات|مبان|سرير/.test(both))
			return propose("Fixed Asset", "لأنه ضمن أثاث أو معدات تُستخدم لأكثر من فترة، لا مخزون للبيع.", "Asset");
		return null;
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
		if (!isArabic() || !frm.fields_dict.account_type) return;
		const field = frm.fields_dict.account_type;
		const $wrapper = field.$wrapper;
		if (!$wrapper || !$wrapper.length) return;
		translateOptions(field);
		$wrapper.find(".ap-account-type-helper").remove();
		const current = BY_VALUE[frm.doc.account_type];
		const proposed = suggestion(frm);
		const summary = current
			? "النوع الحالي: " + current.label + " — " + current.help
			: proposed
				? "اقتراح: " + proposed.type.label + " — " + proposed.reason
				: "اختر النوع بحسب وظيفة الحساب في المعاملات، وليس اسمه وحده.";
		const $helper = $(
			'<div class="ap-account-type-helper" dir="rtl">' +
			'<span class="ap-account-type-summary"></span>' +
			'<button type="button" class="ap-account-type-open" aria-label="افتح دليل اختيار نوع الحساب">دليل اختيار النوع ↗</button>' +
			'</div>'
		);
		$helper.find(".ap-account-type-summary").text(summary);
		$helper.find(".ap-account-type-open").on("click", function () { openGuide(frm); });
		$wrapper.append($helper);
	}

	function openGuide(frm) {
		const proposed = suggestion(frm);
		let active = BY_VALUE[frm.doc.account_type] || (proposed && proposed.type) || null;
		const recommendation = proposed && !frm.doc.account_type
			? '<div class="ap-account-guide-recommendation"><strong>الاقتراح لهذا الحساب: ' + escapeHtml(proposed.type.label) + '</strong><span>' + escapeHtml(proposed.reason) + '</span></div>'
			: "";
		const options = TYPES.map(function (type) {
			return '<button type="button" class="ap-account-guide-option' + (active === type ? ' is-active' : '') +
				'" data-account-type="' + escapeHtml(type.value) + '">' + escapeHtml(type.label) + '</button>';
		}).join("");
		const dialog = new frappe.ui.Dialog({
			title: "دليل اختيار نوع الحساب",
			size: "large",
			fields: [{ fieldtype: "HTML", fieldname: "guide_html" }],
			primary_action_label: "استخدام النوع المحدد",
			primary_action: function () {
				if (!active) {
					frappe.msgprint("اختر نوع حساب من القائمة أولًا.");
					return;
				}
				const input = frm.fields_dict.account_type.$input;
				if (!input || input.prop("disabled")) {
					frappe.msgprint("هذا الحساب غير قابل لتعديل نوعه حاليًا.");
					return;
				}
				frm.set_value("account_type", active.value);
				dialog.hide();
			},
		});
		dialog.show();
		const $panel = dialog.fields_dict.guide_html.$wrapper;
		$panel.html(
			'<div class="ap-account-guide" dir="rtl">' +
			'<p class="ap-account-guide-note">نوع الحساب يحدد أين يمكن استخدامه في النظام. الدليل يقترح ولا يغيّر الحساب أو يحفظه تلقائيًا. راجع التصنيف قبل حفظ حساب له قيود سابقة.</p>' +
			recommendation +
			'<div class="ap-account-guide-layout">' +
			'<div><label for="ap-account-type-search">ابحث عن النوع</label><input id="ap-account-type-search" class="form-control ap-account-guide-search" type="search" placeholder="مثل: أصل ثابت أو صندوق نقدي" />' +
			'<div class="ap-account-guide-options" role="group" aria-label="أنواع الحسابات">' + options + '</div></div>' +
			'<div class="ap-account-guide-detail" aria-live="polite"></div>' +
			'</div></div>'
		);
		function showDetail() {
			$panel.find(".ap-account-guide-option").each(function () {
				$(this).toggleClass("is-active", Boolean(active && this.dataset.accountType === active.value));
				$(this).attr("aria-pressed", active && this.dataset.accountType === active.value ? "true" : "false");
			});
			$panel.find(".ap-account-guide-detail").html(active
				? '<span class="ap-account-guide-eyebrow">متى يُستخدم؟</span><h4>' + escapeHtml(active.label) + '</h4><p>' + escapeHtml(active.help) + '</p>'
				: '<p>اختر نوعًا لعرض طريقة استخدامه.</p>');
		}
		$panel.on("click", ".ap-account-guide-option", function () {
			active = BY_VALUE[this.dataset.accountType];
			showDetail();
		});
		$panel.on("input", ".ap-account-guide-search", function () {
			const query = normalize(this.value);
			$panel.find(".ap-account-guide-option").each(function () {
				const type = BY_VALUE[this.dataset.accountType];
				$(this).toggle(!query || normalize(type.label + " " + type.help + " " + type.value).includes(query));
			});
		});
		showDetail();
	}

	frappe.ui.form.on("Account", {
		refresh: render,
		account_type: render,
		account_name: render,
		parent_account: render,
		root_type: render,
		is_group: render,
	});
})();
