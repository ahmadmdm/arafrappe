/* global frappe */
/**
 * Arabic Pro · Font Manager
 * Loads beautiful Arabic fonts and provides a user-friendly font picker.
 * System default: admin only via "Arabic Pro Settings" DocType.
 * Personal preference: every user via the Aa floating button.
 */
;(function () {
	"use strict";

	// ─── Font Catalogue ────────────────────────────────────────────────────────
	var FONTS = [
		{
			id: "Cairo",
			nameAr: "كايرو",
			desc: "عصري · شائع · متعدد الأوزان",
			sample: "نظام إدارة الأعمال بكفاءة عالية",
		},
		{
			id: "Tajawal",
			nameAr: "تجوال",
			desc: "بسيط · خفيف · أنيق",
			sample: "سهولة التعامل مع البيانات المالية",
		},
		{
			id: "Almarai",
			nameAr: "المرعي",
			desc: "مصمَّم للقراءة الرقمية",
			sample: "إدارة الموارد البشرية بذكاء",
		},
		{
			id: "IBM Plex Sans Arabic",
			nameAr: "IBM Plex",
			desc: "احترافي · تقني · حديث",
			sample: "التقارير المالية الشاملة والدقيقة",
		},
		{
			id: "Noto Sans Arabic",
			nameAr: "نوتو سانز",
			desc: "شامل · متوازن · موثوق",
			sample: "مخزون المنتجات وإدارة المشتريات",
		},
		{
			id: "Amiri",
			nameAr: "أميري",
			desc: "نسخي كلاسيكي · أنيق · رسمي",
			sample: "الوثائق الرسمية والعقود التجارية",
		},
		{
			id: "Scheherazade New",
			nameAr: "شهرزاد",
			desc: "تقليدي راقٍ · مميز",
			sample: "إدارة المشاريع وتتبع الإنجازات",
		},
		{
			id: "Reem Kufi",
			nameAr: "ريم كوفي",
			desc: "كوفي هندسي · عصري · مميز",
			sample: "لوحة التحكم والإحصاءات الحية",
		},
		{
			id: "Lateef",
			nameAr: "لطيف",
			desc: "نظيف · سلس · مريح",
			sample: "إدارة علاقات العملاء بفعالية",
		},
		{
			id: "Harmattan",
			nameAr: "هرمتان",
			desc: "خفيف · أنيق · واضح",
			sample: "الفوترة الإلكترونية وضريبة القيمة",
		},
	];

	var SIZE_MAP = {
		Small: { px: "13px", ar: "صغير", en: "S" },
		Medium: { px: "14px", ar: "متوسط", en: "M" },
		Large: { px: "15px", ar: "كبير", en: "L" },
		XLarge: { px: "16px", ar: "XL كبير جداً", en: "XL" },
	};

	// ─── State ─────────────────────────────────────────────────────────────────
	var _current = { font: "Cairo", size: "Medium" };
	var _settings = {
		font: "Cairo",
		size: "Medium",
		system_font: "Cairo",
		system_size: "Medium",
		allow_override: 1,
		is_admin: false,
	};
	var _styleEl = null;
	var _runtimeObserver = null;
	var ARABIC_CHAR_RE = /[\u0600-\u06FF]/;
	var LATIN_CHAR_RE = /[A-Za-z]/;

	var RUNTIME_TEXT_MAP = {
		"Switch to Frappe CRM for smarter sales →": "انتقل إلى Frappe CRM لتجربة مبيعات أذكى →",
		"Saudi HR / الموارد البشرية": "الموارد البشرية السعودية",
		"حضور الموظفين / Attendance": "حضور الموظفين",
		"Attendance Action Hub / لوحة متابعة الحضور": "مركز متابعة الحضور",
		"Attendance Action Hub": "مركز متابعة الحضور",
		"Team Attendance Review / مراجعة حضور الفريق": "مراجعة حضور الفريق",
		"Team Attendance Review": "مراجعة حضور الفريق",
		"Saudi Employee Voice Profile / البصمة الصوتية": "البصمة الصوتية للموظف",
		"Saudi Employee Voice Profile": "البصمة الصوتية للموظف",
		"Shift Type / تعريف وقت الدوام": "نوع الوردية",
		"Shift Assignment / ربط الموظفين": "تعيين الوردية",
		"Shift Assignment": "تعيين الوردية",
		"Shift Assignment Tool / توزيع جماعي": "أداة توزيع الورديات",
		"Shift Assignment Tool": "أداة توزيع الورديات",
		"Attendance Location / سياسة الموقع": "موقع الحضور المعتمد",
		"Attendance Location": "موقع الحضور المعتمد",
		"WPS Submission / متابعة حماية الأجور": "متابعة ملف حماية الأجور",
		"WPS Submission": "متابعة ملف حماية الأجور",
		"WPS Submission Tracker / تقرير متابعة حماية الأجور": "سجل متابعة ملف حماية الأجور",
		"WPS Submission Tracker": "سجل متابعة ملف حماية الأجور",
		"Paid Payroll History / سجل الرواتب المصروفة": "سجل الرواتب المصروفة",
		"Paid Payroll History": "سجل الرواتب المصروفة",
		"Loading paid payroll history...": "جارٍ تحميل سجل الرواتب المصروفة...",
		"Unable to load paid payroll history right now.": "تعذر تحميل سجل الرواتب المصروفة حاليًا.",
		"No paid payroll records were found for this employee.": "لا توجد مسيرات رواتب مصروفة لهذا الموظف.",
		"Active Contracts by Type": "العقود السارية حسب النوع",
		"GOSI Monthly Contributions": "اشتراكات التأمينات الاجتماعية الشهرية",
		"Compliance Actions by Area": "إجراءات الامتثال حسب المجال",
		"Grievances by Type": "التظلمات حسب النوع",
		"Investigations by Case Type": "التحقيقات حسب نوع الحالة",
		"Legal Risk Distribution": "توزيع المخاطر النظامية",
		"Nationality Distribution": "توزيع الجنسيات",
		"Completed Compliance Actions": "إجراءات الامتثال المكتملة",
		"Resolved Grievances": "التظلمات المحسومة",
		"Appeals Under Review": "الاعتراضات قيد المراجعة",
		"High Risk Legal References": "المراجع النظامية عالية المخاطر",
		"Mobile Attendance": "الحضور عبر الجوال",
		"Hiring Requisition": "طلب احتياج وظيفي",
		"Promotion Transfer": "الترقية أو النقل الوظيفي",
		"Exit Clearance": "إخلاء طرف الموظف",
		"Reason / description": "مبرر الطلب",
		"Face photo / face verification": "صورة التحقق",
		"General Manager / CEO": "المدير العام / الرئيس التنفيذي",
		"Head Office": "المكتب الرئيسي",
		"Contract Hours": "ساعات العقد",
		"Coordinates": "إحداثيات",
		"Plus Code": "بلص كود",
		"Plus Code:": "بلص كود:",
		"Present": "حاضر",
		"Absent": "غائب",
		"Half Day": "نصف يوم",
		"On Leave": "في إجازة",
		"Paid": "مدفوع",
		"Draft": "مسودة",
		"Submitted": "معتمد",
		"Bank Transfer": "تحويل بنكي",
		"Capitalized": "مُرسمل",
		"انشاء جديد": "إنشاء",
		"IN": "دخول",
		"OUT": "خروج",
		"انشاء جديد أمر الإنتاج": "إنشاء أمر إنتاج جديد",
		"Saudi HR Mobile": "منصة الحضور الذكي",
		"الاجازات | Leave Application": "الإجازات",
		"نوع التحول": "نوع الوردية",
		"مهمة التحول": "تعيين الوردية",
		"هوية شخصية": "المعرّف",
		"GPS غير محدد بعد": "لم يُحدَّد الموقع بعد",
		"Begin typing for results.": "ابدأ بالكتابة للنتائج.",
		"Reports & Masters": "التقارير والبيانات الرئيسية",
		"Create Your First Purchase Invoice": "إنشاء أول فاتورة مشتريات",
		"Chart Of Accounts": "دليل الحسابات",
		"Learn more about Chart of Accounts": "تعرّف أكثر على دليل الحسابات",
		"Explore Chart of Accounts": "استكشاف دليل الحسابات",
		"You can continue with the onboarding after exploring this page": "يمكنك متابعة الإعداد بعد استكشاف هذه الصفحة",
		"Let’s create your first Purchase Invoice": "لننشئ أول فاتورة مشتريات",
		"A Purchase Invoice is a bill received from a Supplier for a product(s) or service(s) delivery to your company. You can track payables through Purchase Invoice and process Payment Entries against it.": "فاتورة المشتريات هي فاتورة تُستلم من المورد مقابل توريد منتجات أو خدمات إلى شركتك. يمكنك من خلالها تتبّع الذمم الدائنة ومعالجة قيود الدفع المرتبطة بها.",
		"Purchase Invoices can also be created against a Purchase Order or Purchase Receipt.": "يمكن أيضًا إنشاء فواتير المشتريات بالاستناد إلى أمر شراء أو إيصال شراء.",
		"ERPNext sets up a simple chart of accounts for each Company you create, but you can modify it according to business and legal requirements.": "ينشئ ERPNext دليل حسابات مبسطًا لكل شركة تقوم بإنشائها، ويمكنك تعديله بما يتوافق مع احتياجات العمل والمتطلبات النظامية.",
		"Selling Settings": "إعدادات المبيعات",
		"CRM and Selling module’s features are configurable as per your business needs. Selling Settings is the place where you can set your preferences for:": "خصائص إدارة علاقات العملاء والمبيعات قابلة للتهيئة بحسب احتياجات عملك. في إعدادات المبيعات يمكنك تحديد تفضيلاتك لما يلي:",
		"Customer naming and default values": "تسمية العملاء والقيم الافتراضية",
		"Billing and shipping preference in sales transactions": "تفضيلات الفاتورة والشحن في معاملات البيع",
		"Let’s walk-through Selling Settings": "تصفح إعدادات المبيعات",
		"Buying Settings": "إعدادات المشتريات",
		"Buying module’s features are highly configurable as per your business needs. Buying Settings is the place where you can set your preferences for:": "خصائص إدارة المشتريات قابلة للتهيئة بدرجة كبيرة بحسب احتياجات عملك. في إعدادات المشتريات يمكنك تحديد تفضيلاتك لما يلي:",
		"Supplier naming and default values": "تسمية الموردين والقيم الافتراضية",
		"Billing and shipping preference in buying transactions": "تفضيلات الفاتورة والشحن في معاملات الشراء",
		"Let’s walk-through few Buying Settings": "تصفح إعدادات المشتريات",
		"Review Stock Settings": "مراجعة إعدادات المخزون",
		"In ERPNext, the Stock module’s features are configurable as per your business needs. Stock Settings is the place where you can set your preferences for:": "في ERPNext، خصائص إدارة المخزون قابلة للتهيئة بحسب احتياجات عملك. في إعدادات المخزون يمكنك تحديد تفضيلاتك لما يلي:",
		"Default values for Item and Pricing": "القيم الافتراضية للصنف والتسعير",
		"Default valuation method for inventory valuation": "طريقة التقييم الافتراضية لتقييم المخزون",
		"Set preference for serialization and batching of item": "تحديد تفضيلات الترقيم التسلسلي والدفعات للأصناف",
		"Set tolerance for over-receipt and delivery of items": "تحديد حدود السماح في الزيادة عند الاستلام وتسليم الأصناف",
		"Fixed Asset Accounts": "حسابات الأصول الثابتة",
		"With the company, a host of fixed asset accounts are pre-configured. To ensure your asset transactions are leading to correct accounting entries, you can review and set up following asset accounts as per your business requirements.": "مع إنشاء الشركة، يتم تجهيز مجموعة من حسابات الأصول الثابتة مسبقًا. ولضمان أن معاملات الأصول تولد القيود المحاسبية الصحيحة، يمكنك مراجعة وإعداد حسابات الأصول التالية بما يتوافق مع احتياجات عملك.",
		"With the company, a host of fixed asset accounts are pre-configured. To ensure your asset transactions are leading to correct accounting entries, you can review and set up following asset accounts as per your business  requirements.": "مع إنشاء الشركة، يتم تجهيز مجموعة من حسابات الأصول الثابتة مسبقًا. ولضمان أن معاملات الأصول تولد القيود المحاسبية الصحيحة، يمكنك مراجعة وإعداد حسابات الأصول التالية بما يتوافق مع احتياجات عملك.",
		"Fixed asset accounts (Asset account)": "حسابات الأصول الثابتة (حساب الأصل)",
		"Accumulated depreciation": "الإهلاك المتراكم",
		"Capital Work in progress (CWIP) account": "حساب الأعمال الرأسمالية قيد التنفيذ (CWIP)",
		"Asset Depreciation account (Expense account)": "حساب إهلاك الأصل الثابت (حساب المصروف)",
		"Introduction to Website": "مقدمة إلى الموقع الإلكتروني",
		"Create Blogger": "إنشاء مدوّن",
		"Add Blog Category": "إضافة تصنيف للمدونة",
		"Enable Website Tracking": "تمكين تتبع الموقع الإلكتروني",
		"Learn about Web Pages": "التعرّف على صفحات الويب",
		"Alerts and Notifications": "التنبيهات والإشعارات",
		"Print Format Builder (New)": "منشئ تنسيق الطباعة (الجديد)",
		"ERPNext Settings": "إعدادات النظام",
		"إعدادات ERPNext": "إعدادات النظام",
		"ERPNext Integrations": "تكاملات النظام",
		"دمج ERPNext": "تكاملات النظام",
		"SMS Settings": "إعدادات الرسائل النصية",
		"SMS إعدادات": "إعدادات الرسائل النصية",
		"SMS Message Center": "مركز الرسائل النصية",
		"SMS Center": "مركز الرسائل النصية",
		"مركز رسائل SMS": "مركز الرسائل النصية",
		"SMS Log": "سجل الرسائل النصية",
		"SMS سجل رسائل": "سجل الرسائل النصية",
		"سجل رسائل SMS": "سجل الرسائل النصية",
		"BOM Comparison Tool": "أداة مقارنة قائمة المواد",
		"أداة مقارنة BOM": "أداة مقارنة قائمة المواد",
		"VAT Return": "إقرار ضريبة القيمة المضافة",
		"VAT Return2": "إقرار ضريبة القيمة المضافة 2",
		"Stores...": "المستودعات...",
		"Jan ...": "يناير ...",
		"Feb ...": "فبراير ...",
		"Mar ...": "مارس ...",
		"Apr ...": "أبريل ...",
		"May ...": "مايو ...",
		"Jun ...": "يونيو ...",
		"Jul ...": "يوليو ...",
		"Aug ...": "أغسطس ...",
		"Sep ...": "سبتمبر ...",
		"Oct ...": "أكتوبر ...",
		"Nov ...": "نوفمبر ...",
		"Dec ...": "ديسمبر ...",
		" To Deliver": " للتسليم",
		" Pending": " معلّق",
		" To Receive": " للاستلام",
		" To Bill": " للفوترة",
	};

	var TECHNICAL_FIELD_MAP = {
		name: "المعرّف",
		supplier: "المورّد",
		supplier_name: "اسم المورّد",
		company: "الشركة",
		status: "الحالة",
		payment_type: "نوع الدفع",
		party_type: "نوع الطرف",
		party: "الطرف",
		customer: "العميل",
		customer_name: "اسم العميل",
		transaction_date: "تاريخ المعاملة",
		delivery_status: "حالة التسليم",
		billing_status: "حالة الفوترة",
		item_name: "اسم الصنف",
		item_group: "مجموعة الصنف",
		has_variants: "له متغيرات",
		variant_of: "متغير من",
		item_code: "رمز الصنف",
		asset_name: "اسم الأصل",
		asset_category: "فئة الأصل",
		production_item: "الصنف المنتج",
		inspection_type: "نوع الفحص",
		reference_name: "اسم المرجع",
		job_title: "المسمى الوظيفي",
		company_name: "اسم الشركة",
		territory: "الإقليم",
	};

	function isArabicInterface() {
		var lang = "";

		try {
			lang = ((window.frappe || {}).boot || {}).lang || "";
		} catch (e) {
			lang = "";
		}

		if (!lang && document.documentElement) {
			lang = document.documentElement.getAttribute("lang") || "";
		}

		return /^ar\b/i.test(lang) || (document.documentElement && document.documentElement.dir === "rtl");
	}

	function polishArabicUiPhrase(text) {
		if (!text) return text;

		return text
			.replace(/\bHR\b/g, "الموارد البشرية")
			.replace(/\bCEO\b/g, "الرئيس التنفيذي")
			.replace(/\bWPS\b/g, "حماية الأجور")
			.replace(/\s{2,}/g, " ")
			.replace(/\s+([،.:])/g, "$1")
			.trim();
	}

	function stripBilingualUiLabel(text) {
		if (!text || (text.indexOf("/") === -1 && text.indexOf("|") === -1)) return text;

		var segments = text
			.split(/[\/|]/)
			.map(function (segment) {
				return segment.trim();
			})
			.filter(Boolean);

		if (segments.length < 2) return text;

		var hasLatin = segments.some(function (segment) {
			return LATIN_CHAR_RE.test(segment);
		});
		var arabicSegments = segments.filter(function (segment) {
			return ARABIC_CHAR_RE.test(segment);
		});

		if (!hasLatin || !arabicSegments.length) return text;

		return polishArabicUiPhrase(arabicSegments.join(" / "));
	}

	function translateTechnicalFieldToken(text) {
		if (!text) return null;

		var trimmedText = text.trim();
		if (!trimmedText) return null;

		if (trimmedText === "undefined") {
			return "";
		}

		if (Object.prototype.hasOwnProperty.call(TECHNICAL_FIELD_MAP, trimmedText)) {
			return TECHNICAL_FIELD_MAP[trimmedText];
		}

		return null;
	}

	function translateRuntimeString(text) {
		if (!text || !isArabicInterface()) return text;

		var technicalFieldTranslation = translateTechnicalFieldToken(text);
		if (technicalFieldTranslation !== null) {
			return technicalFieldTranslation;
		}

		var translatedText = text;

		Object.keys(RUNTIME_TEXT_MAP).forEach(function (sourceText) {
			if (translatedText.indexOf(sourceText) !== -1) {
				translatedText = translatedText.split(sourceText).join(RUNTIME_TEXT_MAP[sourceText]);
			}
		});

		translatedText = stripBilingualUiLabel(translatedText);

		var moreCharsMatch = translatedText.match(/^Type (\d+) or more characters for results\.$/);
		if (moreCharsMatch) {
			return "اكتب " + moreCharsMatch[1] + " أحرف أو أكثر لعرض النتائج.";
		}

		translatedText = translatedText.replace(
			/Type (\d+) or more characters for results\./g,
			function (_match, count) {
				return "اكتب " + count + " أحرف أو أكثر لعرض النتائج.";
			}
		);

		translatedText = translatedText.replace(
			/Buying module’s features are highly configurable as per your business needs\. إعدادات المشتريات is the place where you can set your preferences for:/g,
			"خصائص إدارة المشتريات قابلة للتهيئة بدرجة كبيرة بحسب احتياجات عملك. في إعدادات المشتريات يمكنك تحديد تفضيلاتك لما يلي:"
		);

		translatedText = translatedText.replace(
			/Let’s walk-through few إعدادات المشتريات/g,
			"تصفح إعدادات المشتريات"
		);

		translatedText = translatedText.replace(
			/Jan \.{3}/g,
			"يناير ..."
		);
		translatedText = translatedText.replace(
			/Feb \.{3}/g,
			"فبراير ..."
		);
		translatedText = translatedText.replace(
			/Mar \.{3}/g,
			"مارس ..."
		);
		translatedText = translatedText.replace(
			/Apr \.{3}/g,
			"أبريل ..."
		);
		translatedText = translatedText.replace(
			/May \.{3}/g,
			"مايو ..."
		);
		translatedText = translatedText.replace(
			/Jun \.{3}/g,
			"يونيو ..."
		);
		translatedText = translatedText.replace(
			/Jul \.{3}/g,
			"يوليو ..."
		);
		translatedText = translatedText.replace(
			/Aug \.{3}/g,
			"أغسطس ..."
		);
		translatedText = translatedText.replace(
			/Sep \.{3}/g,
			"سبتمبر ..."
		);
		translatedText = translatedText.replace(
			/Oct \.{3}/g,
			"أكتوبر ..."
		);
		translatedText = translatedText.replace(
			/Nov \.{3}/g,
			"نوفمبر ..."
		);
		translatedText = translatedText.replace(
			/Dec \.{3}/g,
			"ديسمبر ..."
		);

		translatedText = translatedText.replace(
			/Warehouse Wise Stock Balance/g,
			"رصيد المخزون حسب المستودع"
		);

		translatedText = translatedText.replace(/\bERPNext Settings\b/g, "إعدادات النظام");
		translatedText = translatedText.replace(/\bERPNext Integrations\b/g, "تكاملات النظام");
		translatedText = translatedText.replace(/إعدادات ERPNext/g, "إعدادات النظام");
		translatedText = translatedText.replace(/دمج ERPNext/g, "تكاملات النظام");
		translatedText = translatedText.replace(/\bSMS Settings\b/g, "إعدادات الرسائل النصية");
		translatedText = translatedText.replace(/\bSMS (?:Message )?Center\b/g, "مركز الرسائل النصية");
		translatedText = translatedText.replace(/\bSMS Log\b/g, "سجل الرسائل النصية");
		translatedText = translatedText.replace(/SMS إعدادات/g, "إعدادات الرسائل النصية");
		translatedText = translatedText.replace(/إعدادات SMS/g, "إعدادات الرسائل النصية");
		translatedText = translatedText.replace(/مركز رسائل SMS/g, "مركز الرسائل النصية");
		translatedText = translatedText.replace(/SMS سجل رسائل/g, "سجل الرسائل النصية");
		translatedText = translatedText.replace(/سجل رسائل SMS/g, "سجل الرسائل النصية");
		translatedText = translatedText.replace(/\bBOM Comparison Tool\b/g, "أداة مقارنة قائمة المواد");
		translatedText = translatedText.replace(/أداة مقارنة BOM/g, "أداة مقارنة قائمة المواد");
		translatedText = translatedText.replace(/\bVAT Return\s*2\b/g, "إقرار ضريبة القيمة المضافة 2");
		translatedText = translatedText.replace(/\bVAT Return\b/g, "إقرار ضريبة القيمة المضافة");
		translatedText = translatedText.replace(/\bStores\.\.\./g, "المستودعات...");
		translatedText = translatedText.replace(/\bانشاء جديد\b/g, "إنشاء");

		translatedText = translatedText.replace(/ Published\b/g, " منشور");
		translatedText = translatedText.replace(/ Active\b/g, " نشط");

		translatedText = translatedText.replace(/\bJan\b/g, "يناير");
		translatedText = translatedText.replace(/\bFeb\b/g, "فبراير");
		translatedText = translatedText.replace(/\bMar\b/g, "مارس");
		translatedText = translatedText.replace(/\bApr\b/g, "أبريل");
		translatedText = translatedText.replace(/\bMay\b/g, "مايو");
		translatedText = translatedText.replace(/\bJun\b/g, "يونيو");
		translatedText = translatedText.replace(/\bJul\b/g, "يوليو");
		translatedText = translatedText.replace(/\bAug\b/g, "أغسطس");
		translatedText = translatedText.replace(/\bSep\b/g, "سبتمبر");
		translatedText = translatedText.replace(/\bOct\b/g, "أكتوبر");
		translatedText = translatedText.replace(/\bNov\b/g, "نوفمبر");
		translatedText = translatedText.replace(/\bDec\b/g, "ديسمبر");

		return polishArabicUiPhrase(translatedText);
	}

	function translateRuntimeNode(root) {
		if (!root) return;

		if (root.nodeType === Node.TEXT_NODE) {
			var translatedText = translateRuntimeString(root.textContent);
			if (translatedText !== root.textContent) {
				root.textContent = translatedText;
			}
			return;
		}

		if (root.nodeType !== Node.ELEMENT_NODE) return;

		if (root.placeholder) {
			var translatedPlaceholder = translateRuntimeString(root.placeholder);
			if (translatedPlaceholder !== root.placeholder) {
				root.placeholder = translatedPlaceholder;
			}
		}

		if (root.title) {
			var translatedTitle = translateRuntimeString(root.title);
			if (translatedTitle !== root.title) {
				root.title = translatedTitle;
			}
		}

		var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		var currentNode;
		while ((currentNode = walker.nextNode())) {
			var translated = translateRuntimeString(currentNode.textContent);
			if (translated !== currentNode.textContent) {
				currentNode.textContent = translated;
			}
		}
	}

	function ensureRuntimeTranslations() {
		if (document.body) {
			translateRuntimeNode(document.body);
		}

		if (_runtimeObserver || !window.MutationObserver || !document.body) return;

		_runtimeObserver = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === "characterData") {
					translateRuntimeNode(mutation.target);
					return;
				}

				mutation.addedNodes.forEach(function (node) {
					translateRuntimeNode(node);
				});
			});
		});

		_runtimeObserver.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
		});
	}

	function getFontStack(font) {
		return (
			'"' +
			font +
			'","Noto Sans Arabic","Geeza Pro","Segoe UI",Tahoma,Arial,sans-serif'
		);
	}

	function getFontMeta(font) {
		return FONTS.find(function (item) {
			return item.id === font;
		});
	}

	function getFontLabel(font) {
		var meta = getFontMeta(font);
		return meta ? meta.nameAr : font;
	}

	// ─── Font Application ──────────────────────────────────────────────────────
	function getStyleEl() {
		if (!_styleEl) {
			_styleEl = document.getElementById("ap-font-style");
			if (!_styleEl) {
				_styleEl = document.createElement("style");
				_styleEl.id = "ap-font-style";
				document.head.appendChild(_styleEl);
			}
		}
		return _styleEl;
	}

	function applyFont(font, size) {
		font = font || "Cairo";
		size = size || "Medium";
		_current.font = font;
		_current.size = size;

		var px = (SIZE_MAP[size] && SIZE_MAP[size].px) || "14px";

		getStyleEl().textContent =
			':root{--ap-font-family:' +
			getFontStack(font) +
			';--ap-font-size:' +
			px +
			";}";

		// Persist in localStorage for fast next-load
		try {
			localStorage.setItem("arabic_pro_font", font);
			localStorage.setItem("arabic_pro_font_size", size);
		} catch (e) {
			// ignore
		}

		updateNavbarItem();
	}

	function updateNavbarItem() {
		var item = document.getElementById("ap-navbar-font-item");
		if (!item) return;

		item.innerHTML =
			'<span class="ap-navbar-icon">🔤</span>' +
			'<span class="ap-navbar-font-label">الخط العربي</span>' +
			'<span class="ap-navbar-font-value">' +
			getFontLabel(_current.font) +
			"</span>";
	}

	// ─── Navbar Item Injection ──────────────────────────────────────────────────
	function injectNavbarItem() {
		if (document.getElementById("ap-navbar-font-item")) return;

		var menu = document.getElementById("toolbar-user");
		if (!menu) return;

		// Create divider
		var divider = document.createElement("div");
		divider.className = "dropdown-divider";
		divider.id = "ap-navbar-font-divider";

		// Create menu item
		var item = document.createElement("a");
		item.className = "dropdown-item ap-navbar-font-item";
		item.id = "ap-navbar-font-item";
		item.href = "#";
		item.innerHTML =
			'<span class="ap-navbar-icon">🔤</span>' +
			'<span class="ap-navbar-font-label">الخط العربي</span>' +
			'<span class="ap-navbar-font-value">' +
			getFontLabel(_current.font) +
			"</span>";

		item.addEventListener("click", function (e) {
			e.preventDefault();
			setTimeout(showFontPicker, 150);
		});

		// Insert before the last divider (before Logout section)
		var dividers = menu.querySelectorAll(".dropdown-divider");
		var lastDivider = dividers.length ? dividers[dividers.length - 1] : null;

		if (lastDivider) {
			menu.insertBefore(item, lastDivider);
			menu.insertBefore(divider, item);
		} else {
			menu.appendChild(divider);
			menu.appendChild(item);
		}
	}

	// ─── Font Picker Dialog ────────────────────────────────────────────────────
	function showFontPicker() {
		var allowOverride = !!_settings.allow_override;
		var isAdmin = !!_settings.is_admin;

		var d = new frappe.ui.Dialog({
			title: "🔤 اختيار الخط العربي",
			size: "extra-large",
			secondary_action_label: __("↩ إعادة للافتراضي"),
		});

		d.$wrapper.addClass("ap-font-picker-dialog");

		// ── Size selector ──
		var sizeHtml =
			'<div class="ap-size-row"><label>حجم الخط:</label><div class="ap-size-btns">';
		Object.keys(SIZE_MAP).forEach(function (key) {
			var s = SIZE_MAP[key];
			sizeHtml +=
				'<button class="ap-size-btn' +
				(_current.size === key ? " selected" : "") +
				'" data-size="' +
				key +
				'">' +
				'<b class="ap-size-en">' +
				s.en +
				"</b> " +
				s.ar +
				"</button>";
		});
		sizeHtml += "</div></div>";

		// ── Current font info ──
		var currentHtml =
			'<div class="ap-current-font-info">الخط الحالي: <span>' +
			_current.font +
			'</span></div>';

		// ── Font grid ──
		var gridHtml = '<div class="ap-font-grid">';
		FONTS.forEach(function (f) {
			var isSelected = _current.font === f.id;
			var isDefault = _settings.system_font === f.id;
			var isUserPref = _settings.user_font === f.id;

			gridHtml +=
				'<div class="ap-font-card' +
				(isSelected ? " selected" : "") +
				'" data-font="' +
				f.id +
				'">' +
				'<div class="ap-font-card-header">' +
				'<span class="ap-font-name-en">' +
				f.id +
				"</span>" +
				(isDefault
					? '<span class="ap-default-badge">افتراضي النظام</span>'
					: "") +
				(isUserPref && !isDefault
					? '<span class="ap-selected-badge">المحفوظ</span>'
					: "") +
				"</div>" +
				'<div class="ap-font-sample" style=\'font-family:"' +
				f.id +
				"\",sans-serif'>" +
				f.sample +
				"</div>" +
				'<div class="ap-font-name-ar" style=\'font-family:"' +
				f.id +
				"\",sans-serif'><b>" +
				f.nameAr +
				"</b> · " +
				f.desc +
				"</div>" +
				"</div>";
		});
		gridHtml += "</div>";

		// ── Locked notice (non-admin when override disabled) ──
		var lockedHtml = "";
		if (!allowOverride && !isAdmin) {
			lockedHtml =
				'<div class="ap-locked-notice">🔒 تغيير الخط الشخصي غير مسموح به حالياً. يمكنك معاينة الخطوط فقط.</div>';
		}

		// ── Admin section ──
		var adminHtml = "";
		if (isAdmin) {
			adminHtml =
				'<div class="ap-admin-section">' +
				'<div class="ap-admin-label">⚙️ صلاحيات المسؤول</div>' +
				'<div class="ap-admin-row">' +
				'<button class="btn btn-sm btn-primary" id="ap-set-system-default">تعيين كخط افتراضي للنظام</button>' +
				'<button class="btn btn-sm btn-default" id="ap-open-settings">إعدادات الخط المتقدمة ↗</button>' +
				"</div>" +
				"</div>";
		}

		var html =
			'<div class="ap-font-picker-wrapper">' +
			sizeHtml +
			currentHtml +
			gridHtml +
			lockedHtml +
			adminHtml +
			"</div>";

		d.$body.html(html);

		// ── Events: font card click ──
		d.$body.on("click", ".ap-font-card", function () {
			if (!allowOverride && !isAdmin) return;
			d.$body.find(".ap-font-card").removeClass("selected");
			$(this).addClass("selected");
			var font = $(this).data("font");
			applyFont(font, _current.size);
			d.$body.find(".ap-current-font-info span").text(font);
		});

		// ── Events: size button click ──
		d.$body.on("click", ".ap-size-btn", function () {
			d.$body.find(".ap-size-btn").removeClass("selected");
			$(this).addClass("selected");
			applyFont(_current.font, $(this).data("size"));
		});

		// ── Events: admin buttons ──
		d.$body.on("click", "#ap-open-settings", function () {
			d.hide();
			frappe.set_route("Form", "Arabic Pro Settings");
		});

		d.$body.on("click", "#ap-set-system-default", function () {
			frappe.confirm(
				"هل تريد تعيين خط <b>" +
					_current.font +
					"</b> كخط افتراضي للنظام لجميع المستخدمين؟",
				function () {
					frappe.call({
						method: "frappe.client.set_value",
						args: {
							doctype: "Arabic Pro Settings",
							name: "Arabic Pro Settings",
							fieldname: { default_font: _current.font },
						},
						callback: function (r) {
							if (!r.exc) {
								_settings.system_font = _current.font;
								frappe.show_alert({
									message:
										"تم تعيين <b>" +
										_current.font +
										"</b> كخط افتراضي للنظام",
									indicator: "green",
								});
								// Refresh badge
								d.$body
									.find(".ap-default-badge")
									.remove();
								d.$body
									.find(
										'.ap-font-card[data-font="' +
											_current.font +
											'"] .ap-font-card-header'
									)
									.append(
										'<span class="ap-default-badge">افتراضي النظام</span>'
									);
							}
						},
					});
				}
			);
		});

		// ── Primary action: Save ──
		d.set_primary_action(__("حفظ"), function () {
			if (!allowOverride && !isAdmin) {
				d.hide();
				return;
			}
			frappe.call({
				method: "arabic_pro.api.save_user_font",
				args: { font: _current.font, size: _current.size },
				callback: function (r) {
					if (!r.exc) {
						_settings.user_font = _current.font;
						_settings.user_size = _current.size;
						frappe.show_alert({
							message:
								"✅ تم حفظ الخط: <b>" +
								_current.font +
								"</b>",
							indicator: "green",
						});
						d.hide();
					}
				},
			});
		});

		// ── Secondary action: Reset ──
		d.set_secondary_action(function () {
			frappe.call({
				method: "arabic_pro.api.reset_user_font",
				callback: function (r) {
					if (!r.exc) {
						var sysFont = _settings.system_font || "Cairo";
						var sysSize = _settings.system_size || "Medium";
						applyFont(sysFont, sysSize);
						_settings.user_font = "";
						_settings.user_size = "";
						frappe.show_alert({
							message: "تم إعادة تعيين الخط للافتراضي: <b>" + sysFont + "</b>",
							indicator: "blue",
						});
						d.hide();
					}
				},
			});
		});

		d.show();
	}

	// ─── Initialization ────────────────────────────────────────────────────────
	function init() {
		// Get settings from bootinfo
		if (window.frappe && frappe.boot && frappe.boot.arabic_pro) {
			_settings = frappe.boot.arabic_pro;
		}

		// Apply font from bootinfo or localStorage fallback
		var font = _settings.font || lsGet("arabic_pro_font") || "Cairo";
		var size = _settings.size || lsGet("arabic_pro_font_size") || "Medium";
		applyFont(font, size);

		// Inject navbar item
		setTimeout(injectNavbarItem, 600);
		setTimeout(updateNavbarItem, 700);
		setTimeout(ensureRuntimeTranslations, 200);
	}

	function lsGet(key) {
		try {
			return localStorage.getItem(key);
		} catch (e) {
			return null;
		}
	}

	// ─── Early font application (before frappe is ready) ───────────────────────
	// Apply from localStorage immediately so there's no FOUT (Flash of Unstyled Text)
	(function earlyApply() {
		var f = lsGet("arabic_pro_font");
		var s = lsGet("arabic_pro_font_size");
		if (f) applyFont(f, s);
	})();

	// ─── Bootstrap ─────────────────────────────────────────────────────────────
	// Use multiple reliable hooks to ensure init runs in all scenarios

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () {
			setTimeout(init, 300);
		});
	} else {
		setTimeout(init, 100);
	}

	// frappe's startup event (fired after boot session is loaded)
	if (window.$) {
		$(document).on("startup", function () {
			init();
		});

		// frappe page change event - ensure navbar item is present after navigation
		$(document).on("page-change", function () {
			if (!document.getElementById("ap-navbar-font-item")) {
				setTimeout(injectNavbarItem, 300);
			}
			setTimeout(ensureRuntimeTranslations, 200);
		});
	}
})();
