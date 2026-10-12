"""Regression checks with mocked settings/defaults; no user preference writes."""

from unittest.mock import patch

import frappe

from arabic_pro import api, boot


def smoke_font_settings():
    settings = frappe._dict(default_font="Thmanyah Sans", font_size="Medium", allow_user_font_override=0)
    defaults = {"arabic_pro_font": "Cairo", "arabic_pro_font_size": "Large"}
    with patch.object(frappe, "get_cached_doc", return_value=settings), patch.object(
        frappe.db, "get_default", side_effect=lambda key, **kwargs: defaults.get(key)
    ), patch.object(frappe, "get_roles", return_value=["System Manager"]):
        result = api.get_font_settings()
        bootinfo = frappe._dict()
        boot.boot_session(bootinfo)
        assert result == bootinfo.arabic_pro
        assert result["allow_override"] == 0
        assert result["font"] == "Thmanyah Sans" and result["size"] == "Medium"
        settings.allow_user_font_override = 1
        result = api.get_font_settings()
        assert result["font"] == "Cairo" and result["size"] == "Large"
        defaults["arabic_pro_font"] = '<script>invalid</script>'
        defaults["arabic_pro_font_size"] = "unknown"
        result = api.get_font_settings()
        assert result["font"] == "Thmanyah Sans" and result["size"] == "Medium"
        with patch.object(frappe.db, "set_default") as write:
            try:
                api.save_user_font("Cairo", "unknown")
            except frappe.ValidationError:
                pass
            else:
                raise AssertionError("Invalid font size must be rejected")
            write.assert_not_called()
            settings.allow_user_font_override = 0
            try:
                api.save_user_font("Cairo", "Medium")
            except frappe.ValidationError:
                pass
            else:
                raise AssertionError("Personal font override must remain locked")
            write.assert_not_called()
    return {"explicit_zero": "respected", "boot_api": "consistent", "invalid_preferences": "rejected"}
