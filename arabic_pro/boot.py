import frappe


def boot_session(bootinfo):
	"""Inject Arabic Pro font settings into the Frappe boot info."""
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

	effective_font = (user_font if (user_font and allow_override) else system_font)
	effective_size = (user_size if (user_size and allow_override) else system_size)

	is_admin = "System Manager" in frappe.get_roles(user)

	bootinfo.arabic_pro = {
		"font": effective_font,
		"size": effective_size,
		"system_font": system_font,
		"system_size": system_size,
		"user_font": user_font,
		"user_size": user_size,
		"allow_override": allow_override,
		"is_admin": is_admin,
	}
