from . import __version__ as app_version
from hashlib import sha256
from pathlib import Path


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

# ── Bench CLI Commands ────────────────────────────────────────────────────────
commands = ["arabic_pro.commands.arabic_pro_audit_translations"]

# ── Font Manager ───────────────────────────────────────────────────────────────
boot_session = "arabic_pro.boot.boot_session"

# Static app assets are cached for a long time. Derive their version from
# content so rebuilding a local/deployed image actually refreshes the browser.
_public = Path(__file__).parent / "public"
_font_revision = sha256(
    (_public / "js/arabic_pro_font.js").read_bytes()
    + (_public / "css/arabic_pro_font.css").read_bytes()
).hexdigest()[:12]
app_include_js = [f"/assets/arabic_pro/js/arabic_pro_font.js?v={_font_revision}"]
app_include_css = [f"/assets/arabic_pro/css/arabic_pro_font.css?v={_font_revision}"]
web_include_js = app_include_js[0]
web_include_css = app_include_css[0]
