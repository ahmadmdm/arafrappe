# الخطوط المحلّية · Local fonts

معظم خطوط «عربي برو» تُحمَّل من Google Fonts عبر `@import` في
`public/css/arabic_pro_font.css`. خط **ثمانية (Thmanyah Sans)** استثناء: يُثبَّت
محليًا، وملفاته **غير مُضمَّنة في هذا المستودع** عن قصد.

Most of Arabic Pro's typefaces come from Google Fonts. **Thmanyah Sans** is the
exception — it is installed locally, and its files are deliberately **not**
committed here.

## لماذا · Why

ترخيص ثمانية يسمح بتضمين الخط داخل منتج، ويمنع صراحةً رفعه أو استضافته أو
إتاحته للتنزيل على أي منصّة رقمية. المستودع العام هو تحديدًا تلك الحالة.

> **PROHIBITED — You may NOT:** Redistribute, share, upload, host, or make the
> Font Software available for download on any website, server, digital platform,
> or file-sharing service.
>
> **PERMITTED:** Embed the Font Software in websites, web applications, mobile
> applications, or software products only as part of a compiled, packaged, or
> obfuscated product.

نسخ الملفات إلى هذا المجلّد على خادمك تضمين مسموح به. إيداعها في git ليس كذلك.

## كيف تُثبّته · How to install it

1. نزّل عائلة الخط من الموقع الرسمي: <https://thmanyah.com>
2. حوّل الأوزان الخمسة إلى `woff2` وسمّها:

```
thmanyahsans-Light.woff2      300
thmanyahsans-Regular.woff2    400
thmanyahsans-Medium.woff2     500
thmanyahsans-Bold.woff2       700
thmanyahsans-Black.woff2      900
```

3. ضعها في هذا المجلّد، ثم:

```bash
bench build --app arabic_pro
```

4. اختر «ثمانية» من مدير الخطوط أو من `Arabic Pro Settings → default_font`.

## بدون الملفات · Without the files

التطبيق يعمل كما هو. تعريفات `@font-face` تفشل بصمت وتتراجع سلسلة الخطوط إلى
`Noto Sans Arabic`، فلا شيء ينكسر — الخيار في القائمة فقط لا يعطي مظهرًا مختلفًا.

The app works unchanged: the `@font-face` rules fail silently and the stack falls
back to `Noto Sans Arabic`. Nothing breaks; the menu entry simply looks like the
fallback until the files are in place.
