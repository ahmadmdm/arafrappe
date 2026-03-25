# 🌙 Arabic Pro Translations — ترجمة عربية احترافية

[![Version](https://img.shields.io/badge/version-2.2.3-green)](https://github.com/ahmadmdm/arafrappe)
[![Frappe](https://img.shields.io/badge/Frappe-v15-blue)](https://frappeframework.com)
[![ERPNext](https://img.shields.io/badge/ERPNext-v15-orange)](https://erpnext.com)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](license.txt)
[![Arabic](https://img.shields.io/badge/lang-العربية-red)](https://github.com/ahmadmdm/arafrappe)

---

## 📋 نظرة عامة | Overview

**Arabic Pro** هو تطبيق ترجمة عربية احترافية لـ **Frappe Framework** و**ERPNext v15**، يوفر أكثر من **1,700 مصطلح مترجم** بعناية لتغطية شاملة لكامل واجهة النظام باللغة العربية.

**Arabic Pro** is a professional Arabic translation application for **Frappe Framework** and **ERPNext v15**, providing over **1,700 carefully translated terms** for comprehensive Arabic coverage across the entire system interface.

---

## ✨ المميزات | Features

| الميزة | التفاصيل |
|--------|----------|
| 🗂️ **تغطية شاملة** | 1,700+ مصطلح يشمل جميع وحدات النظام |
| 📊 **المحاسبة** | دفتر الأستاذ، ميزان المراجعة، الذمم، التقارير المالية |
| 👥 **الموارد البشرية** | الموظفون، الرواتب، الإجازات، الحضور |
| 🏢 **المبيعات والمشتريات** | الفواتير، الأوامر، العملاء، الموردون |
| 📦 **المخزون** | الأصناف، المستودعات، قيود المخزون |
| 🧾 **ZATCA** | كامل حقول الفوترة الإلكترونية السعودية |
| 🏛️ **Saudi HR** | جميع مصطلحات الموارد البشرية السعودية |
| 🔤 **مدير الخطوط** | اختيار خط عربي مخصص لكل مستخدم مع خط افتراضي للنظام |
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
# 1. تثبيت التطبيق
bench get-app https://github.com/ahmadmdm/arafrappe.git

# 2. تثبيته على الموقع
bench --site YOUR_SITE install-app arabic_pro

# 3. مسح الكاش لتفعيل الترجمات
bench --site YOUR_SITE clear-cache
```

**تأكد من أن لغة النظام مضبوطة على العربية:**
- اذهب إلى **إعدادات النظام** ← اضبط **اللغة** على `Arabic (ar)`

---

## 🔄 التحديث | Update

```bash
cd apps/arabic_pro
git pull origin main

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
│       └── ar.csv          # ملف الترجمات (1,700+ مصطلح)
├── pyproject.toml
├── setup.py
└── README.md
```

---

## 📊 إحصائيات الترجمة | Translation Stats

| الفئة | عدد المصطلحات |
|-------|--------------|
| المحاسبة والمالية | ~400 |
| الموارد البشرية والرواتب | ~350 |
| المبيعات والمشتريات | ~300 |
| المخزون والمستودعات | ~200 |
| ZATCA والفوترة الإلكترونية | ~80 |
| الموارد البشرية السعودية | ~150 |
| الواجهة العامة والنظام | ~220 |
| **الإجمالي** | **~1,700+** |

---

## 🛠️ المتطلبات | Requirements

| المتطلب | الإصدار |
|---------|---------|
| Python | ≥ 3.10 |
| Frappe Framework | v15 |
| ERPNext | v15 (اختياري) |
| HRMS | v15 (اختياري) |

---

## � مدير الخطوط العربية | Arabic Font Manager

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
