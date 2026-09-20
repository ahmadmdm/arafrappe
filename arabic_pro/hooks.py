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

# ── Bench CLI Commands ────────────────────────────────────────────────────────
commands = ["arabic_pro.commands.arabic_pro_audit_translations"]

# ── Font Manager ───────────────────────────────────────────────────────────────
boot_session = "arabic_pro.boot.boot_session"

app_include_js = ["/assets/arabic_pro/js/arabic_pro_font.js?v=20260910c"]
app_include_css = ["/assets/arabic_pro/css/arabic_pro_font.css?v=20260910c"]
web_include_js = "/assets/arabic_pro/js/arabic_pro_font.js?v=20260910c"
web_include_css = "/assets/arabic_pro/css/arabic_pro_font.css?v=20260910c"

# Accountant-facing guidance on Account.account_type. Values remain ERPNext's
# original English identifiers; only labels and help content are localized.
doctype_js = {
    "Account": "public/js/account_type_guide.js",
    "Journal Entry": "public/js/journal_entry_guide.js",
}
app_include_css += ["/assets/arabic_pro/css/account_type_guide.css?v=20260912a"]
app_include_css += ["/assets/arabic_pro/css/accounting_cycle_guide.css?v=20260912c"]
app_include_css += ["/assets/arabic_pro/css/closing_review.css?v=20260919b"]

# Keep a discoverable link in Accounting without replacing user shortcuts.
after_migrate = [
    "arabic_pro.workspace.ensure_accounting_guide_shortcut",
    "arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file.backfill_closing_checklists",
]

# A posting can invalidate a previously reviewed close. The scheduled sweep also
# catches batched ledger changes that do not fire GL Entry document hooks.
doc_events = {
    "GL Entry": {
        "after_insert": "arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file.on_gl_entry_change",
        "on_update": "arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file.on_gl_entry_change",
        "on_trash": "arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file.on_gl_entry_change",
    },
}
scheduler_events = {
    "hourly": ["arabic_pro.arabic_pro.doctype.arabic_pro_closing_file.arabic_pro_closing_file.scan_ledger_changes"],
}
