# 🌙 Arabic Pro Translations — ترجمة عربية احترافية

[![Version](https://img.shields.io/badge/version-2.4.0-green)](https://github.com/ahmadmdm/arafrappe)
[![Frappe](https://img.shields.io/badge/Frappe-v15-blue)](https://frappeframework.com)
[![ERPNext](https://img.shields.io/badge/ERPNext-v15-orange)](https://erpnext.com)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](license.txt)
[![Arabic](https://img.shields.io/badge/lang-العربية-red)](https://github.com/ahmadmdm/arafrappe)

---

## 📋 نظرة عامة | Overview

**Arabic Pro** هو تطبيق ترجمة عربية احترافية لـ **Frappe Framework** و**ERPNext v15**، يوفر أكثر من **2,400 مصطلح مترجم** بعناية مع تحسينات ترجمة ديناميكية لتغطية أوسع لكامل واجهة النظام باللغة العربية.

**Arabic Pro** is a professional Arabic translation application for **Frappe Framework** and **ERPNext v15**, providing over **2,400 carefully translated terms** plus runtime translation enhancements for broader Arabic coverage across the full system interface.

---

## ✨ المميزات | Features

| الميزة | التفاصيل |
|--------|----------|
| 🗂️ **تغطية شاملة** | 2,400+ مصطلح يشمل جميع وحدات النظام |
| 📊 **المحاسبة** | دفتر الأستاذ، ميزان المراجعة، الذمم، التقارير المالية |
| 👥 **الموارد البشرية** | الموظفون، الرواتب، الإجازات، الحضور |
| 🏢 **المبيعات والمشتريات** | الفواتير، الأوامر، العملاء، الموردون |
| 📦 **المخزون** | الأصناف، المستودعات، قيود المخزون |
| 🧾 **ZATCA** | كامل حقول الفوترة الإلكترونية السعودية |
| 🏛️ **Saudi HR** | جميع مصطلحات الموارد البشرية السعودية |
| 🔤 **مدير الخطوط** | اختيار خط عربي مخصص لكل مستخدم مع خط افتراضي للنظام |
| ⚡ **ترجمة ديناميكية** | معالجة النصوص التي تظهر عبر JavaScript أو البطاقات التفاعلية خارج مسار CSV التقليدي |
| ✅ **جودة عالية** | لا تكرارات، لا ترجمات فارغة، مراجعة احترافية |

---

## 🇸🇦 وحدات مدعومة | Supported Modules

- **المحاسبة** — Accounting
- **المبيعات** — Sales  
- **المشتريات** — Purchasing
- **المخزون** — Stock / Inventory
- **الموارد البشرية** — Human Resources (HRMS)
- **الأصول الثابتة** — Assets
- **مسير الرواتب** — Payroll
- **الموارد البشرية السعودية** — Saudi HR (saudi_hr)
- **ZATCA** — الفوترة الإلكترونية السعودية
- **إدارة الجودة** — Quality Management
- **المشاريع** — Projects
- **إدارة علاقات العملاء** — CRM

---

## 📦 التثبيت | Installation

```bash
# 1. من داخل bench يعمل على Frappe v15، اسحب الإصدار المطلوب من GitHub
bench get-app --branch v2.4.0 https://github.com/ahmadmdm/arafrappe.git

# 2. تثبيته على الموقع
bench --site YOUR_SITE install-app arabic_pro

# 3. مسح الكاش لتفعيل الترجمات
bench --site YOUR_SITE clear-cache
```

**الاعتماديات | Dependencies:**
- لا توجد تبعيات Python إضافية خارج Frappe/ERPNext؛ ملف `pyproject.toml` يعلن `dependencies = []`
- التطبيق يتطلب Bench جاهزاً على `Frappe v15` و`Python >= 3.10` قبل تنفيذ `bench get-app`
- التطبيق يضيف مدير الخطوط وصفحة الإعدادات عبر المسار: `/app/arabic-pro-settings`
- يتضمن التطبيق طبقة ترجمة ديناميكية لعناصر الواجهة التي لا تمر عبر آلية الترجمة القياسية في Frappe

**الإصدار الحالي | Current Release:**
- Git tag: `v2.4.0`
- المستودع: `https://github.com/ahmadmdm/arafrappe.git`

**تأكد من أن لغة النظام مضبوطة على العربية:**
- اذهب إلى **إعدادات النظام** ← اضبط **اللغة** على `Arabic (ar)`

---

## 🔄 التحديث | Update

```bash
cd apps/arabic_pro
git pull origin version-15

bench --site YOUR_SITE clear-cache
```

## 🔍 تدقيق ملف الترجمة | Translation Audit

أضيف للتطبيق أمر تدقيق سريع لاكتشاف مشاكل ملف الترجمة مثل:
- الصفوف المكررة
- الترجمة الفارغة
- المصطلح نفسه مع أكثر من ترجمة
- الصفوف ذات الأعمدة الزائدة

يمكن تشغيله من مجلد bench كالتالي:

```bash
bench arabic-pro-audit-translations
```

وإذا أردت أن يفشل الأمر عند وجود مشاكل، استخدم:

```bash
bench arabic-pro-audit-translations --strict
```

ولعرض النتيجة بصيغة JSON:

```bash
bench arabic-pro-audit-translations --json
```

---

## 📁 هيكل التطبيق | App Structure

```
arabic_pro/
├── arabic_pro/
│   ├── __init__.py          # رقم الإصدار
│   ├── hooks.py             # إعدادات التطبيق (boot_session, app_include_js/css)
│   ├── api.py               # واجهات الخطوط (save_user_font, reset_user_font)
│   ├── boot.py              # حقن إعدادات الخط في frappe.boot
│   ├── arabic_pro/
│   │   └── doctype/
│   │       └── arabic_pro_settings/   # DocType إعدادات الخط (Admin فقط)
│   ├── config/
│   │   └── arabic_pro.py   # إعدادات الوحدة
│   ├── public/
│   │   ├── js/
│   │   │   └── arabic_pro_font.js    # محرك الخطوط + واجهة الاختيار
│   │   └── css/
│   │       └── arabic_pro_font.css   # تنسيقات FAB والحوار وشبكة الخطوط
│   └── translations/
│       └── ar.csv          # ملف الترجمات (2,400+ مصطلح)
├── pyproject.toml
├── setup.py
└── README.md
```

---

## 📊 إحصائيات الترجمة | Translation Stats

| المؤشر | القيمة |
|-------|--------|
| إجمالي صفوف الترجمة الصالحة | 2,359 |
| التكرارات | 0 |
| الترجمات الفارغة | 0 |
| الصفوف ذات الأعمدة الزائدة | 0 |
| **التغطية الحالية** | **2,400+ مصطلح مترجم** |

---

## 🛠️ المتطلبات | Requirements

| المتطلب | الإصدار |
|---------|---------|
| Python | ≥ 3.10 |
| Bench | متوافق مع Frappe Bench v15 |
| Frappe Framework | v15 |
| ERPNext | v15 (اختياري) |
| HRMS | v15 (اختياري) |

---

## مدير الخطوط العربية | Arabic Font Manager

منذ الإصدار **v2.2.3**، يتضمن التطبيق نظام اختيار خطوط عربية احترافي يعمل على كامل واجهة Frappe Desk.

### الخطوط المدعومة

| الخط | اسمه بالعربية | الطابع |
|------|--------------|--------|
| Cairo | كايرو | عصري شائع |
| Tajawal | تجوال | بسيط أنيق |
| Almarai | المرعي | مصمَّم للقراءة الرقمية |
| IBM Plex Sans Arabic | IBM Plex | احترافي تقني |
| Noto Sans Arabic | نوتو سانز | شامل متوازن |
| Amiri | أميري | نسخي كلاسيكي |
| Scheherazade New | شهرزاد | تقليدي راقٍ |
| Reem Kufi | ريم كوفي | كوفي هندسي |
| Lateef | لطيف | نظيف سلس |
| Harmattan | هرمتان | خفيف أنيق |

### كيفية الاستخدام

- **زر «Aa»** يظهر في أسفل يسار الشاشة — انقر عليه لفتح منتقي الخطوط
- اختر الخط والحجم (صغير / متوسط / كبير / كبير جداً) وانقر **حفظ**
- لإعادة تعيين الخط الشخصي: زر **↩ إعادة للافتراضي**
- **المسؤولون فقط** يمكنهم تغيير الخط الافتراضي للنظام من **إعدادات Arabic Pro**

### إعدادات المسؤول

افتح **إعدادات Arabic Pro** من: `http://YOUR_SITE/app/arabic-pro-settings`

| الحقل | الوصف |
|-------|-------|
| `default_font` | الخط الافتراضي لكامل النظام |
| `font_size` | الحجم الافتراضي (Small/Medium/Large/XLarge) |
| `allow_user_font_override` | السماح للمستخدمين بتغيير خطهم الشخصي |

---

## 📝 سجل التغييرات | Changelog

### v2.4.0 — 2026-04-27
- ✅ توسيع طبقة الترجمة الديناميكية لتغطي صفحات القوائم والمرشحات داخل المحاسبة والمشتريات والمبيعات والمخزون والأصول والتصنيع والجودة وCRM
- ✅ إزالة ظهور مفاتيح الحقول التقنية الخام مثل `name` و`supplier_name` و`reference_name` و`payment_type` و`undefined` من الواجهة العربية الحية
- ✅ تحسين المصطلحات العربية الوظيفية في Saudi HR وERPNext مثل `طلب احتياج وظيفي` و`إخلاء طرف الموظف` و`الصنف المنتج` و`اسم المرجع` و`نوع الفحص`
- ✅ إضافة overrides جديدة للمفاتيح العامة والنصوص التشغيلية مثل `Create New` و`Show Tags` و`Bank Transfer` و`Capitalized` مع استمرار اجتياز تدقيق ملف الترجمة دون ملاحظات

### v2.3.0 — 2026-04-07
- ✅ توسعة التغطية العربية إلى أكثر من 2,300 مصطلح مع تنظيف ملف الترجمة بالكامل حتى يمر تدقيق `bench arabic-pro-audit-translations` دون أي ملاحظات
- ✅ إصلاح ترجمات وحدات متعددة على مستوى النظام مثل المحاسبة، المبيعات، المشتريات، المخزون، التصنيع، المشاريع، الجودة، الأصول، CRM، الموقع الإلكتروني، والأدوات
- ✅ إضافة طبقة ترجمة ديناميكية للنصوص التي تُحقن في الواجهة عبر JavaScript مثل بطاقات onboarding، عناوين التقارير، الحالات المختصرة، وبعض النصوص المساعدة التي لا يغطيها CSV وحده
- ✅ تحديث أصول JavaScript لكسر الكاش وضمان وصول الترجمات الجديدة مباشرة بعد التحديث

### v2.2.10 — 2026-04-06
- ✅ إضافة ترجمات Saudi HR الجديدة الخاصة بدورة الأداء والمغادرة: `Salary Adjustment`, `Promotion Transfer`, `Exit Interview`
- ✅ إضافة ترجمة حالات ورسائل مرتبطة بالميزات الجديدة مثل `Exit Interview Completed` و`Salary Adjustment Recommended`
- ✅ تحديث تغطية واجهة Saudi HR حتى تظهر المصطلحات الجديدة مترجمة مباشرة داخل المساحات والنماذج العربية

### v2.2.9 — 2026-04-02
- ✅ تحليل تغطية النظام نقطةً نقطة عبر مقارنة `arabic_pro` مع `saudi_hr` لاستخراج الفجوات الفعلية بدل التخمين
- ✅ إضافة 250+ ترجمة مفقودة من Saudi HR إلى `arabic_pro/translations/ar.csv` تشمل الرواتب والإجازات والامتثال والتفتيش العمالي
- ✅ إضافة ترجمات عناوين `Arabic Pro Settings` و`Arabic Pro Translations` لتغطية واجهة التطبيق نفسه
- ✅ إصلاح صف CSV مكسور عند `Time, Leave & Payroll` وإزالة تكرار `Mobile Attendance` بحيث يعود ملف الترجمة نظيفاً في التدقيق

### v2.2.8 — 2026-04-01
- ✅ إصلاح 22 مصطلحاً بمراجعة شاملة لكل قسم وتخصص:
  - **تصادم في الترجمات:** `Amend` → `تصحيح` (كان مطابقاً لـ Edit)؛ `Duplicate` → `تكرار`؛ `Quality Action` و `Quality Procedure` أصبح لكل منهما ترجمة مستقلة
  - **محاسبة وأصول ثابتة:** `Written Down Value` → `صافي القيمة الدفترية`؛ `Landed Cost` → `تكاليف الاستيراد`؛ `Credit Days` → `أيام الأجل`؛ `Total Number of Depreciations` → `عدد فترات الإهلاك`
  - **إدارة الجودة (ISO 9001):** `Non Conformance` → `عدم المطابقة`؛ `Quality Procedure` → `إجراء توثيق الجودة`؛ `Quality Action` → `إجراء الجودة التصحيحي`
  - **مخزون:** `FIFO` → `الوارد أولاً صادر أولاً`؛ `LIFO` → `الوارد أخيراً صادر أولاً`؛ `Bin` → `حاوية التخزين`
  - **تصنيع:** `By Product` → `ناتج ثانوي`
  - **موارد بشرية:** `Employee Warning Notice` → `إشعار تحذير للموظف`؛ `Mobile Allowance` → `بدل الجوال`
  - **زاتكا:** `ZATCA Self billed Invoice` → `فاتورة ذاتية التحصيل`
  - **مفاهيم خاطئة:** `Partially Ordered/Fully Ordered` → `مُنفَّذ` (بدلاً من مُوَرَّد)

### v2.2.6 — 2026-04-01
- ✅ تسجيل أمر `bench arabic-pro-audit-translations` في `hooks.py` حتى يُكتشف تلقائياً بعد التثبيت
- ✅ إضافة `[tool.flit.module]` إلى `pyproject.toml` لإصلاح بناء الحزمة عبر flit وحل مشكلة `dynamic = ["version"]`
- ✅ التحقق من اكتمال جميع تبعيات التثبيت (لا تبعيات Python إضافية مطلوبة)

### v2.2.5 — 2026-03-27
- ✅ إصلاح ظهور رموز مثل `` و `` في القوائم المنسدلة عبر إبقاء `Font Awesome` خارج تطبيق الخط العربي
- ✅ إضافة ترجمات جديدة للعناصر الظاهرة في مساحة عمل Saudi HR مثل `Quick Actions` و `Lifecycle Stages` وتقارير القروض
- ✅ تحديث نسخة أصول `Arabic Pro` لضمان تحميل الإصلاحات مباشرة بعد `clear-cache`

### v2.2.4 — 2026-03-26
- ✅ تحميل خطوط الويب العربية صراحةً لضمان تغيّر الخط فعلياً عند التبديل
- ✅ إظهار اسم الخط الحالي داخل قائمة المستخدم لتوضيح الخط المطبّق مباشرةً
- ✅ تطبيق حجم الخط المختار بشكل شامل على الواجهة وتحسين مظهر عنصر القائمة
- ✅ تحديث أرقام أصول JS/CSS لكسر الكاش بعد تعديل مدير الخطوط

### v2.2.3 — 2026-03-26
- ✅ إضافة ترجمات مفقودة لمساحة عمل Saudi HR مثل `Employment Contracts` و`Monthly Payroll` و`Compliance Tracker`
- ✅ ترجمة عناوين بطاقات ومخططات Saudi HR مثل `Active Contracts by Type` و`GOSI Monthly Contributions`
- ✅ ترجمة عناصر `Mobile Attendance` وحقول الحضور اليومية الظاهرة في مساحة العمل

### v2.2.2 — 2026-03-23
- ✅ توحيد رقم الإصدار بين `__init__` و `hooks.py` و `setup.py`
- ✅ إزالة صف ترجمة مكرر من `translations/ar.csv`
- ✅ تحسين جاهزية الحزمة للنقل والتثبيت على بيئة جديدة

### v2.1.0 — 2026-03-22
- ✅ إضافة **مدير الخطوط العربية** مع 10 خطوط Google Fonts
- ✅ زر FAB «Aa» عائم لفتح منتقي الخطوط
- ✅ تفضيل شخصي لكل مستخدم (محفوظ في Frappe Defaults)
- ✅ DocType `Arabic Pro Settings` للمسؤولين (خط افتراضي للنظام)
- ✅ محدد حجم الخط: صغير / متوسط / كبير / XL
- ✅ حفظ فوري في localStorage (بلا FOUT)
- ✅ دعم الوضع الداكن Dark Mode
- ✅ إضافة `boot.py` و`api.py` لدعم الخطوط من طرف الخادم

### v2.0.0 — 2026-03-21
- ✅ إضافة شعار SVG للتطبيق وأيقونة في شاشة التطبيقات

### v1.2.0 — 2026-03-17
- ✅ إضافة 202 مصطلح جديد
- ✅ ترجمة كاملة لحقول ZATCA والفوترة الإلكترونية
- ✅ ترجمة كاملة لتقارير المحاسبة (دفتر الأستاذ، ميزان المراجعة، الذمم)
- ✅ ترجمة مصطلحات الموارد البشرية السعودية
- ✅ إصلاح ملف `config/arabic_pro.py` (كان بصيغة INI)
- ✅ إضافة `pyproject.toml` لتوافق Frappe v15
- ✅ ترجمة مصطلحات العملاء والموردين مع حقول ZATCA

### v1.1.0 — 2026-02-01
- ✅ إضافة ترجمات وحدة saudi_hr (65 مصطلح)
- ✅ إصلاح 31 تكراراً في ملف الترجمات
- ✅ إصلاح 3 صفوف تالفة في CSV
- ✅ تحديث `hooks.py` بإضافة `app_version` و`required_apps`
- ✅ تحديث `setup.py` وإزالة قراءة ملف requirements.txt الفارغ

### v1.0.0 — الإصدار الأولي
- ✅ 1,485 مصطلح عربي
- ✅ تغطية أساسية لـ Frappe + ERPNext

---

## 🤝 المساهمة | Contributing

نرحب بمساهماتكم! لإضافة أو تحسين ترجمة:

1. Fork المشروع
2. أضف/عدّل الترجمات في `arabic_pro/translations/ar.csv`
3. تأكد من صحة صيغة CSV (3 أعمدة: المصدر، الترجمة، السياق)
4. أرسل Pull Request

---

## 📄 الترخيص | License

MIT License — اقرأ ملف [license.txt](license.txt) للتفاصيل.

---

## 👨‍💻 المطور | Developer

**IdeaOrbit** — [info@ideaorbit.net](mailto:info@ideaorbit.net)

> صُنع بـ ❤️ للمجتمع العربي | Made with ❤️ for the Arabic community
