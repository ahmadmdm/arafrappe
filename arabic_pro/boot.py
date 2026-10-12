from arabic_pro.api import get_font_settings


def boot_session(bootinfo):
	"""Inject Arabic Pro font settings into the Frappe boot info."""
	# Keep boot and the refresh endpoint consistent, including an explicit zero.
	bootinfo.arabic_pro = get_font_settings()
