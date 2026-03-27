from . import __version__ as app_version


app_name = "arabic_pro"
app_title = "Arabic Pro Translations"
app_publisher = "IdeaOrbit"
app_description = "ترجمة عربية احترافية شاملة لـ Frappe و ERPNext ‒ تغطي مصطلحات المحاسبة والمبيعات والمشتريات والمخزون والموارد البشرية بلغة عربية فصيحة ومعيارية."
app_email = "info@ideaorbit.net"
app_license = "MIT"
app_icon = "octicon octicon-globe"
app_color = "#1a7f37"
app_logo_url = "/assets/arabic_pro/images/logo.svg"

add_to_apps_screen = [
        {
                "name": "arabic_pro",
                "logo": "/assets/arabic_pro/images/logo.svg",
                "title": "Arabic Pro",
                "route": "/app/arabic-pro-settings",
        },
]

# arabic_pro is a translation-only app; no required_apps beyond frappe core
required_apps = ["frappe"]

# ── Font Manager ───────────────────────────────────────────────────────────────
boot_session = "arabic_pro.boot.boot_session"

app_include_js = ["/assets/arabic_pro/js/arabic_pro_font.js?v=20260327b"]
app_include_css = ["/assets/arabic_pro/css/arabic_pro_font.css?v=20260327b"]
web_include_js = "/assets/arabic_pro/js/arabic_pro_font.js?v=20260327b"
web_include_css = "/assets/arabic_pro/css/arabic_pro_font.css?v=20260327b"
