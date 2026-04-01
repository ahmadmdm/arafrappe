# Changelog

جميع التغييرات الجوهرية لهذا المشروع موثّقة في هذا الملف.

---

## [2.2.8] - 2026-04-01

### إضافة 54 ترجمة للمصطلحات غير المُترجمة

#### واجهة المستخدم والثيم
- `Aurora / Editorial / Luxury / Sunrise` → أسماء الثيمات المُترجمة
- `Report an Issue` → الإبلاغ عن مشكلة
- `User Forum` → منتدى المستخدمين
- `Hide Saved` → إخفاء المحفوظة

#### قيود اليومية (Journal Entry Types)
- `Advance Payment Entry` → قيد دفعة مقدّمة
- `Exchange Gain Or Loss` → أرباح/خسائر فروق الصرف
- `Accounts Opening Balance` → قيد الأرصدة الافتتاحية
- `Recurring Purchase Invoice / Sales Invoice` → فاتورة متكررة
- `Partly Paid and Discounted` → مدفوع جزئياً ومخصوم

#### معالج الإعداد — المحاسبة والمخزون والمشتريات
- مصطلحات wizard بدء التشغيل: دليل الحسابات، مراكز التكلفة، الأرصدة الافتتاحية، تحويل الأسهم
- مصطلحات wizard المخزون: 12 مصطلح (إعداد المستودع، طرق التقييم، الدُّفعات، التسامح)
- مصطلحات wizard المشتريات: إعدادات الشراء، تفضيلات الفاتورة والشحن، الموردين

#### الأصول الثابتة والتصنيع
- حسابات الأصول الثابتة، CWIP، رسملة الأصل، مراجعة الحسابات
- `Downtime Entry` → قيد وقت التوقف
- `Work Order Consumed Materials` → المواد المستهلكة في أمر الإنتاج
- `Item, BOM` → الصنف وقائمة المواد

---

## [2.2.7] - 2026-04-01

### مراجعة شاملة للمصطلحات — 22 إصلاحاً

#### تصادم في الترجمات (Collision Fixes)
- `Amend` → `تصحيح` (كان مطابقاً لـ Edit = تعديل؛ Amend في ERPNext يعني نسخة معدَّلة بعد الإلغاء)
- `Duplicate` → `تكرار` (كان نسخ وهي نفس ترجمة Copy)
- `Quality Action` → `إجراء الجودة التصحيحي` (كان مطابقاً لـ Quality Procedure)
- `Quality Procedure` → `إجراء توثيق الجودة`

#### محاسبة مالية وأصول ثابتة
- `Written Down Value` → `صافي القيمة الدفترية` (المصطلح المعياري وفق معايير IFRS/المحاسبة السعودية)
- `Landed Cost` → `تكاليف الاستيراد`
- `Landed Cost Voucher` → `سند تكاليف الاستيراد`
- `Credit Days` → `أيام الأجل` (المصطلح التجاري السعودي المعتمد)
- `Journal Entry Account` → `حساب قيد اليومية`
- `Total Number of Depreciations` → `عدد فترات الإهلاك`

#### إدارة الجودة (ISO 9001)
- `Non Conformance` → `عدم المطابقة` (المصطلح المعياري في ISO 9001 بالعربية)

#### المخزون وطرق التقييم
- `FIFO` → `الوارد أولاً صادر أولاً`
- `LIFO` → `الوارد أخيراً صادر أولاً`
- `Bin` → `حاوية التخزين` (Stock Bin في ERPNext)

#### التصنيع
- `By Product` → `ناتج ثانوي`
- `Manufacturing Settings` → `إعدادات وحدة التصنيع`

#### الموارد البشرية
- `Employee Warning Notice` → `إشعار تحذير للموظف` (تحذير ≠ إنذار في سياق التأديب)
- `Mobile Allowance` → `بدل الجوال` (المصطلح السعودي)

#### زاتكا
- `ZATCA Self billed Invoice` → `فاتورة ذاتية التحصيل - زاتكا` (وفق مواصفات هيئة الزكاة)

#### مفاهيم خاطئة
- `Partially Ordered` → `مُنفَّذ جزئياً` (كانت ترجمة مُوَرَّد خاطئة المفهوم)
- `Fully Ordered` → `مُنفَّذ بالكامل`

---

## [2.2.6] - 2026-04-01

### إصلاحات
- تسجيل أمر `bench arabic-pro-audit-translations` في `hooks.py` بصورة صريحة حتى يُكتشف تلقائياً عند تثبيت التطبيق.
- إضافة `[tool.flit.module]` إلى `pyproject.toml` لإصلاح بناء الحزمة عبر flit عند استخدام `dynamic = ["version"]`.

---

## [2.2.5] - 2026-03-27

### إصلاحات
- إصلاح أيقونات القوائم المنسدلة في Frappe عبر استثناء عناصر `Font Awesome` من تطبيق الخط العربي العام.
- تحديث أرقام أصول CSS/JS لضمان تحميل ملفات `Arabic Pro` الجديدة فوراً بعد مسح الكاش.
- إضافة ترجمات جديدة لمساحة عمل Saudi HR والإجراءات السريعة والتقارير الخاصة بالقروض ومراحل دورة الحياة.

### التبعيات
- لا توجد تبعيات Python إضافية؛ يبقى تعريف الحزمة كما هو مع `dependencies = []` و `install_requires = []`.

## [2.2.3] - 2026-03-26

### تحسينات الترجمة
- إضافة ترجمات مفقودة لمساحة عمل Saudi HR وعناصرها السريعة مثل:
  - `Employment Contracts`
  - `Monthly Payroll`
  - `Compliance Tracker`
  - `Core Areas`
  - `Setup & Policy`
  - `People & Contracts`
  - `Attendance & Payroll`
  - `Leaves & Benefits`
  - `Compliance & Legal`
- إضافة ترجمات لعناوين المخططات والاختصارات الظاهرة في Saudi HR:
  - `Active Contracts by Type`
  - `GOSI Monthly Contributions`
  - `Mobile Attendance`
  - `Saudi Employee Checkin`
  - `Saudi Daily Attendance`

---

## [2.2.0] - 2026-03-22

### مميزات جديدة
- **نقل منتقي الخط إلى شريط التنقل**: تم نقل أداة اختيار الخط العربي من الزر العائم (FAB) إلى قائمة المستخدم في شريط التنقل العلوي لتجربة أكثر انسجاماً مع واجهة ERPNext.

### تحسينات الترجمة
- إضافة ترجمات لعناصر قائمة المستخدم: `My Profile` ← ملفي الشخصي، `My Settings` ← إعداداتي
- إضافة ~40 ترجمة جديدة تشمل:
  - صفحات CRM: Sales Pipeline Analytics، Opportunity Summary by Sales Stage، CRM Settings
  - صفحات HR والرواتب: HR Dashboard، Recruitment Dashboard، Employee Lifecycle Dashboard، Attendance Dashboard، Expense Claims Dashboard، Shift & Attendance، Salary Payout، Tax & Benefits، Outgoing Salary
  - صفحات المخزون: Total Stock Value، Total Warehouses، Total Active Items، Items & Pricing
  - صفحات المبيعات والمشتريات: Territory Wise Sales
  - صفحات التصنيع: BOM Creator، Forecasting
  - نصوص الإعداد التمهيدي للوحدات (Buying، Selling، Stock، HR، Payroll)
  - تعابير "تعلّم" للوحدات المختلفة: Learn Procurement، Learn Sales Management، Learn Inventory Management، Learn Manufacturing، Learn Project Management

---

## [2.2.1] - 2026-03-23

### إصلاحات
- توحيد رقم الإصدار بين `arabic_pro/__init__.py` و `hooks.py` و `setup.py`.
- إزالة صف ترجمة مكرر من ملف `translations/ar.csv` لضمان مرور أمر التدقيق بنجاح.
- تحسين جاهزية الحزمة للنقل إلى نظام جديد.

---

## [2.2.2] - 2026-03-23

### إصلاحات
- إصدار patch لرفع تحسينات الجاهزية للنقل والتثبيت على نظام جديد.

---

## [2.1.0] - 2026-03-10

### مميزات جديدة
- **منتقي الخط العربي**: إضافة أداة لاختيار الخط العربي مع نظام إدارة مدعوم من المسؤول لتحديد الخط الافتراضي.

---

## [2.0.0] - 2026-03-01

### مميزات جديدة
- مراجعة شاملة للترجمات العربية لـ Frappe وERPNext.
- دعم رمز التطبيق وتكامل شاشة التطبيقات.

---

## [1.0.0]

- الإصدار الأولي: ترجمات عربية أساسية لـ Frappe وERPNext.
