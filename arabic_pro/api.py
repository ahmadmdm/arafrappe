import frappe

VALID_FONTS = [
	"Cairo",
	"Tajawal",
	"Almarai",
	"IBM Plex Sans Arabic",
	"Noto Sans Arabic",
	"Amiri",
	"Scheherazade New",
	"Reem Kufi",
	"Lateef",
	"Harmattan",
]

VALID_SIZES = ["Small", "Medium", "Large", "XLarge"]


@frappe.whitelist()
def save_user_font(font, size=None):
	"""Save the current user's personal font preference."""
	try:
		settings = frappe.get_cached_doc("Arabic Pro Settings")
		if not settings.allow_user_font_override:
			frappe.throw("تغيير الخط الشخصي غير مسموح به من قِبل مسؤول النظام")
	except frappe.DoesNotExistError:
		pass  # Settings not yet created — allow override

	if font not in VALID_FONTS:
		frappe.throw("الخط المحدد غير صالح")

	frappe.db.set_default("arabic_pro_font", font, parent=frappe.session.user)

	if size and size in VALID_SIZES:
		frappe.db.set_default("arabic_pro_font_size", size, parent=frappe.session.user)

	frappe.db.commit()
	return {"success": True, "font": font, "size": size}


@frappe.whitelist()
def reset_user_font():
	"""Reset the current user's font preference to the system default."""
	frappe.db.set_default("arabic_pro_font", "", parent=frappe.session.user)
	frappe.db.set_default("arabic_pro_font_size", "", parent=frappe.session.user)
	frappe.db.commit()
	return {"success": True}


@frappe.whitelist()
def get_font_settings():
	"""Return merged font settings for the current user (used by JS if bootinfo unavailable)."""
	try:
		settings = frappe.get_cached_doc("Arabic Pro Settings")
		system_font = settings.default_font or "Cairo"
		system_size = settings.font_size or "Medium"
		allow_override = int(settings.allow_user_font_override or 1)
	except Exception:
		system_font = "Cairo"
		system_size = "Medium"
		allow_override = 1

	user = frappe.session.user
	user_font = frappe.db.get_default("arabic_pro_font", parent=user) or ""
	user_size = frappe.db.get_default("arabic_pro_font_size", parent=user) or ""

	return {
		"font": user_font if (user_font and allow_override) else system_font,
		"size": user_size if (user_size and allow_override) else system_size,
		"system_font": system_font,
		"system_size": system_size,
		"user_font": user_font,
		"user_size": user_size,
		"allow_override": allow_override,
		"is_admin": "System Manager" in frappe.get_roles(user),
		"valid_fonts": VALID_FONTS,
	}
