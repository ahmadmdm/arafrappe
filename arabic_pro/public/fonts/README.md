# خط ثمانية · Thmanyah Sans

معظم خطوط «عربي برو» تُحمَّل من Google Fonts عبر `@import` في
`public/css/arabic_pro_font.css`. **خط ثمانية** استثناء: ملفاته مرفقة هنا
ويُقدَّم من خادمك مباشرة.

Most of Arabic Pro's typefaces load from Google Fonts. **Thmanyah Sans** is the
exception: its files are bundled here and served from your own site.

```
thmanyahsans-Light.woff2      300
thmanyahsans-Regular.woff2    400
thmanyahsans-Medium.woff2     500
thmanyahsans-Bold.woff2       700
thmanyahsans-Black.woff2      900
```

اختره من مدير الخطوط أو من `Arabic Pro Settings → default_font`، ثم
`bench build --app arabic_pro`.

## الحقوق · Rights

الخط من إنتاج **شركة ثمانية للنشر والتوزيع** — <https://thmanyah.com> — وليس
جزءًا من هذا التطبيق ولا يشمله ترخيصه. نسختا الترخيص مرفقتان:

The typeface is © **thmanyah Publishing and Distribution**. It is **not** part of
this application and is **not** covered by this application's licence. Both
copies of its licence travel with it:

- [`THMANYAH-LICENSE.pdf`](THMANYAH-LICENSE.pdf) — English
- [`THMANYAH-LICENSE-ar.pdf`](THMANYAH-LICENSE-ar.pdf) — العربية، وهي المرجع

### اقرأ الترخيص قبل إعادة الاستخدام · Read it before reusing

الاستخدام الشخصي والتجاري مسموح بلا مقابل. لكن الترخيص يفرّق بين **الاستخدام**
و**إعادة التوزيع**، وينصّ تحت «PROHIBITED ACTIONS» على منع رفع ملفات الخط أو
استضافتها أو إتاحتها للتنزيل، وعلى أن مصدر التنزيل هو الموقع الرسمي وحده.

Personal and commercial **use** is granted free of charge. Redistribution is
treated separately: the licence's PROHIBITED ACTIONS section restricts
uploading, hosting or making the font files available for download, and names
the official site as the only download source.

وجودها في هذا المستودع قرار صاحبه. إن كنت تستنسخ هذا المشروع وتنوي إعادة نشره،
راجع الترخيص بنفسك، أو راسل `ask@thmanyah.com` — الترخيص ينصّ على أن الاستثناءات
والحقوق الموسّعة تُمنح بالمراسلة.

Their presence here is the repository owner's decision. If you are cloning this
and intend to republish, read the licence yourself or write to
`ask@thmanyah.com` — the licence states that exceptions and extended rights are
granted on request.

## بدونها · Without them

لو حُذفت الملفات، التطبيق يعمل كما هو: تعريفات `@font-face` تفشل بصمت وتتراجع
سلسلة الخطوط إلى `Noto Sans Arabic`. لا شيء ينكسر.

Remove them and nothing breaks: the `@font-face` rules fail silently and the
stack falls back to `Noto Sans Arabic`.
