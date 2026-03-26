/* global frappe */
/**
 * Arabic Pro · Font Manager
 * Loads beautiful Arabic fonts and provides a user-friendly font picker.
 * System default: admin only via "Arabic Pro Settings" DocType.
 * Personal preference: every user via the Aa floating button.
 */
;(function () {
	"use strict";

	// ─── Font Catalogue ────────────────────────────────────────────────────────
	var FONTS = [
		{
			id: "Cairo",
			nameAr: "كايرو",
			desc: "عصري · شائع · متعدد الأوزان",
			sample: "نظام إدارة الأعمال بكفاءة عالية",
		},
		{
			id: "Tajawal",
			nameAr: "تجوال",
			desc: "بسيط · خفيف · أنيق",
			sample: "سهولة التعامل مع البيانات المالية",
		},
		{
			id: "Almarai",
			nameAr: "المرعي",
			desc: "مصمَّم للقراءة الرقمية",
			sample: "إدارة الموارد البشرية بذكاء",
		},
		{
			id: "IBM Plex Sans Arabic",
			nameAr: "IBM Plex",
			desc: "احترافي · تقني · حديث",
			sample: "التقارير المالية الشاملة والدقيقة",
		},
		{
			id: "Noto Sans Arabic",
			nameAr: "نوتو سانز",
			desc: "شامل · متوازن · موثوق",
			sample: "مخزون المنتجات وإدارة المشتريات",
		},
		{
			id: "Amiri",
			nameAr: "أميري",
			desc: "نسخي كلاسيكي · أنيق · رسمي",
			sample: "الوثائق الرسمية والعقود التجارية",
		},
		{
			id: "Scheherazade New",
			nameAr: "شهرزاد",
			desc: "تقليدي راقٍ · مميز",
			sample: "إدارة المشاريع وتتبع الإنجازات",
		},
		{
			id: "Reem Kufi",
			nameAr: "ريم كوفي",
			desc: "كوفي هندسي · عصري · مميز",
			sample: "لوحة التحكم والإحصاءات الحية",
		},
		{
			id: "Lateef",
			nameAr: "لطيف",
			desc: "نظيف · سلس · مريح",
			sample: "إدارة علاقات العملاء بفعالية",
		},
		{
			id: "Harmattan",
			nameAr: "هرمتان",
			desc: "خفيف · أنيق · واضح",
			sample: "الفوترة الإلكترونية وضريبة القيمة",
		},
	];

	var SIZE_MAP = {
		Small: { px: "13px", ar: "صغير", en: "S" },
		Medium: { px: "14px", ar: "متوسط", en: "M" },
		Large: { px: "15px", ar: "كبير", en: "L" },
		XLarge: { px: "16px", ar: "XL كبير جداً", en: "XL" },
	};

	// ─── State ─────────────────────────────────────────────────────────────────
	var _current = { font: "Cairo", size: "Medium" };
	var _settings = {
		font: "Cairo",
		size: "Medium",
		system_font: "Cairo",
		system_size: "Medium",
		allow_override: 1,
		is_admin: false,
	};
	var _styleEl = null;

	function getFontStack(font) {
		return (
			'"' +
			font +
			'","Noto Sans Arabic","Geeza Pro","Segoe UI",Tahoma,Arial,sans-serif'
		);
	}

	function getFontMeta(font) {
		return FONTS.find(function (item) {
			return item.id === font;
		});
	}

	function getFontLabel(font) {
		var meta = getFontMeta(font);
		return meta ? meta.nameAr : font;
	}

	// ─── Font Application ──────────────────────────────────────────────────────
	function getStyleEl() {
		if (!_styleEl) {
			_styleEl = document.getElementById("ap-font-style");
			if (!_styleEl) {
				_styleEl = document.createElement("style");
				_styleEl.id = "ap-font-style";
				document.head.appendChild(_styleEl);
			}
		}
		return _styleEl;
	}

	function applyFont(font, size) {
		font = font || "Cairo";
		size = size || "Medium";
		_current.font = font;
		_current.size = size;

		var px = (SIZE_MAP[size] && SIZE_MAP[size].px) || "14px";

		getStyleEl().textContent =
			':root{--ap-font-family:' +
			getFontStack(font) +
			';--ap-font-size:' +
			px +
			";}";

		// Persist in localStorage for fast next-load
		try {
			localStorage.setItem("arabic_pro_font", font);
			localStorage.setItem("arabic_pro_font_size", size);
		} catch (e) {
			// ignore
		}

		updateNavbarItem();
	}

	function updateNavbarItem() {
		var item = document.getElementById("ap-navbar-font-item");
		if (!item) return;

		item.innerHTML =
			'<span class="ap-navbar-icon">🔤</span>' +
			'<span class="ap-navbar-font-label">الخط العربي</span>' +
			'<span class="ap-navbar-font-value">' +
			getFontLabel(_current.font) +
			"</span>";
	}

	// ─── Navbar Item Injection ──────────────────────────────────────────────────
	function injectNavbarItem() {
		if (document.getElementById("ap-navbar-font-item")) return;

		var menu = document.getElementById("toolbar-user");
		if (!menu) return;

		// Create divider
		var divider = document.createElement("div");
		divider.className = "dropdown-divider";
		divider.id = "ap-navbar-font-divider";

		// Create menu item
		var item = document.createElement("a");
		item.className = "dropdown-item ap-navbar-font-item";
		item.id = "ap-navbar-font-item";
		item.href = "#";
		item.innerHTML =
			'<span class="ap-navbar-icon">🔤</span>' +
			'<span class="ap-navbar-font-label">الخط العربي</span>' +
			'<span class="ap-navbar-font-value">' +
			getFontLabel(_current.font) +
			"</span>";

		item.addEventListener("click", function (e) {
			e.preventDefault();
			setTimeout(showFontPicker, 150);
		});

		// Insert before the last divider (before Logout section)
		var dividers = menu.querySelectorAll(".dropdown-divider");
		var lastDivider = dividers.length ? dividers[dividers.length - 1] : null;

		if (lastDivider) {
			menu.insertBefore(item, lastDivider);
			menu.insertBefore(divider, item);
		} else {
			menu.appendChild(divider);
			menu.appendChild(item);
		}
	}

	// ─── Font Picker Dialog ────────────────────────────────────────────────────
	function showFontPicker() {
		var allowOverride = !!_settings.allow_override;
		var isAdmin = !!_settings.is_admin;

		var d = new frappe.ui.Dialog({
			title: "🔤 اختيار الخط العربي",
			size: "extra-large",
			secondary_action_label: __("↩ إعادة للافتراضي"),
		});

		d.$wrapper.addClass("ap-font-picker-dialog");

		// ── Size selector ──
		var sizeHtml =
			'<div class="ap-size-row"><label>حجم الخط:</label><div class="ap-size-btns">';
		Object.keys(SIZE_MAP).forEach(function (key) {
			var s = SIZE_MAP[key];
			sizeHtml +=
				'<button class="ap-size-btn' +
				(_current.size === key ? " selected" : "") +
				'" data-size="' +
				key +
				'">' +
				'<b class="ap-size-en">' +
				s.en +
				"</b> " +
				s.ar +
				"</button>";
		});
		sizeHtml += "</div></div>";

		// ── Current font info ──
		var currentHtml =
			'<div class="ap-current-font-info">الخط الحالي: <span>' +
			_current.font +
			'</span></div>';

		// ── Font grid ──
		var gridHtml = '<div class="ap-font-grid">';
		FONTS.forEach(function (f) {
			var isSelected = _current.font === f.id;
			var isDefault = _settings.system_font === f.id;
			var isUserPref = _settings.user_font === f.id;

			gridHtml +=
				'<div class="ap-font-card' +
				(isSelected ? " selected" : "") +
				'" data-font="' +
				f.id +
				'">' +
				'<div class="ap-font-card-header">' +
				'<span class="ap-font-name-en">' +
				f.id +
				"</span>" +
				(isDefault
					? '<span class="ap-default-badge">افتراضي النظام</span>'
					: "") +
				(isUserPref && !isDefault
					? '<span class="ap-selected-badge">المحفوظ</span>'
					: "") +
				"</div>" +
				'<div class="ap-font-sample" style=\'font-family:"' +
				f.id +
				"\",sans-serif'>" +
				f.sample +
				"</div>" +
				'<div class="ap-font-name-ar" style=\'font-family:"' +
				f.id +
				"\",sans-serif'><b>" +
				f.nameAr +
				"</b> · " +
				f.desc +
				"</div>" +
				"</div>";
		});
		gridHtml += "</div>";

		// ── Locked notice (non-admin when override disabled) ──
		var lockedHtml = "";
		if (!allowOverride && !isAdmin) {
			lockedHtml =
				'<div class="ap-locked-notice">🔒 تغيير الخط الشخصي غير مسموح به حالياً. يمكنك معاينة الخطوط فقط.</div>';
		}

		// ── Admin section ──
		var adminHtml = "";
		if (isAdmin) {
			adminHtml =
				'<div class="ap-admin-section">' +
				'<div class="ap-admin-label">⚙️ صلاحيات المسؤول</div>' +
				'<div class="ap-admin-row">' +
				'<button class="btn btn-sm btn-primary" id="ap-set-system-default">تعيين كخط افتراضي للنظام</button>' +
				'<button class="btn btn-sm btn-default" id="ap-open-settings">إعدادات الخط المتقدمة ↗</button>' +
				"</div>" +
				"</div>";
		}

		var html =
			'<div class="ap-font-picker-wrapper">' +
			sizeHtml +
			currentHtml +
			gridHtml +
			lockedHtml +
			adminHtml +
			"</div>";

		d.$body.html(html);

		// ── Events: font card click ──
		d.$body.on("click", ".ap-font-card", function () {
			if (!allowOverride && !isAdmin) return;
			d.$body.find(".ap-font-card").removeClass("selected");
			$(this).addClass("selected");
			var font = $(this).data("font");
			applyFont(font, _current.size);
			d.$body.find(".ap-current-font-info span").text(font);
		});

		// ── Events: size button click ──
		d.$body.on("click", ".ap-size-btn", function () {
			d.$body.find(".ap-size-btn").removeClass("selected");
			$(this).addClass("selected");
			applyFont(_current.font, $(this).data("size"));
		});

		// ── Events: admin buttons ──
		d.$body.on("click", "#ap-open-settings", function () {
			d.hide();
			frappe.set_route("Form", "Arabic Pro Settings");
		});

		d.$body.on("click", "#ap-set-system-default", function () {
			frappe.confirm(
				"هل تريد تعيين خط <b>" +
					_current.font +
					"</b> كخط افتراضي للنظام لجميع المستخدمين؟",
				function () {
					frappe.call({
						method: "frappe.client.set_value",
						args: {
							doctype: "Arabic Pro Settings",
							name: "Arabic Pro Settings",
							fieldname: { default_font: _current.font },
						},
						callback: function (r) {
							if (!r.exc) {
								_settings.system_font = _current.font;
								frappe.show_alert({
									message:
										"تم تعيين <b>" +
										_current.font +
										"</b> كخط افتراضي للنظام",
									indicator: "green",
								});
								// Refresh badge
								d.$body
									.find(".ap-default-badge")
									.remove();
								d.$body
									.find(
										'.ap-font-card[data-font="' +
											_current.font +
											'"] .ap-font-card-header'
									)
									.append(
										'<span class="ap-default-badge">افتراضي النظام</span>'
									);
							}
						},
					});
				}
			);
		});

		// ── Primary action: Save ──
		d.set_primary_action(__("حفظ"), function () {
			if (!allowOverride && !isAdmin) {
				d.hide();
				return;
			}
			frappe.call({
				method: "arabic_pro.api.save_user_font",
				args: { font: _current.font, size: _current.size },
				callback: function (r) {
					if (!r.exc) {
						_settings.user_font = _current.font;
						_settings.user_size = _current.size;
						frappe.show_alert({
							message:
								"✅ تم حفظ الخط: <b>" +
								_current.font +
								"</b>",
							indicator: "green",
						});
						d.hide();
					}
				},
			});
		});

		// ── Secondary action: Reset ──
		d.set_secondary_action(function () {
			frappe.call({
				method: "arabic_pro.api.reset_user_font",
				callback: function (r) {
					if (!r.exc) {
						var sysFont = _settings.system_font || "Cairo";
						var sysSize = _settings.system_size || "Medium";
						applyFont(sysFont, sysSize);
						_settings.user_font = "";
						_settings.user_size = "";
						frappe.show_alert({
							message: "تم إعادة تعيين الخط للافتراضي: <b>" + sysFont + "</b>",
							indicator: "blue",
						});
						d.hide();
					}
				},
			});
		});

		d.show();
	}

	// ─── Initialization ────────────────────────────────────────────────────────
	function init() {
		// Get settings from bootinfo
		if (window.frappe && frappe.boot && frappe.boot.arabic_pro) {
			_settings = frappe.boot.arabic_pro;
		}

		// Apply font from bootinfo or localStorage fallback
		var font = _settings.font || lsGet("arabic_pro_font") || "Cairo";
		var size = _settings.size || lsGet("arabic_pro_font_size") || "Medium";
		applyFont(font, size);

		// Inject navbar item
		setTimeout(injectNavbarItem, 600);
		setTimeout(updateNavbarItem, 700);
	}

	function lsGet(key) {
		try {
			return localStorage.getItem(key);
		} catch (e) {
			return null;
		}
	}

	// ─── Early font application (before frappe is ready) ───────────────────────
	// Apply from localStorage immediately so there's no FOUT (Flash of Unstyled Text)
	(function earlyApply() {
		var f = lsGet("arabic_pro_font");
		var s = lsGet("arabic_pro_font_size");
		if (f) applyFont(f, s);
	})();

	// ─── Bootstrap ─────────────────────────────────────────────────────────────
	// Use multiple reliable hooks to ensure init runs in all scenarios

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () {
			setTimeout(init, 300);
		});
	} else {
		setTimeout(init, 100);
	}

	// frappe's startup event (fired after boot session is loaded)
	$(document).on("startup", function () {
		init();
	});

	// frappe page change event - ensure navbar item is present after navigation
	$(document).on("page-change", function () {
		if (!document.getElementById("ap-navbar-font-item")) {
			setTimeout(injectNavbarItem, 300);
		}
	});
})();
