"""Permission-aware, read-only signals for the Arabic accounting guide.

These counts are prompts for review, not an audit opinion or a recalculation of
financial statements. In particular, a missing imported bank transaction does
not prove that the company's bank accounts have been reconciled.
"""

import re

import frappe
from frappe.utils import getdate, now_datetime


def _visible_count(doctype, filters):
    if not frappe.has_permission(doctype, "read"):
        return {"available": False, "count": None}

    rows = frappe.get_list(
        doctype,
        filters=filters,
        fields=["count(name) as total"],
        limit_page_length=1,
    )
    return {"available": True, "count": int(rows[0].get("total") or 0) if rows else 0}


@frappe.whitelist()
def get_period_signals(company, from_date, to_date):
    """Return only counts visible to the caller for one authorized company."""
    if frappe.session.user == "Guest":
        frappe.throw("يجب تسجيل الدخول لعرض مؤشرات الفترة.", frappe.PermissionError)

    if not isinstance(company, str):
        frappe.throw("اختر شركة صحيحة.")
    company = company.strip()
    if not company or not frappe.get_list(
        "Company", filters={"name": company}, fields=["name"], limit_page_length=1
    ):
        frappe.throw("الشركة غير متاحة لحسابك.", frappe.PermissionError)

    if not all(
        isinstance(value, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", value)
        for value in (from_date, to_date)
    ):
        frappe.throw("أدخل تاريخي البداية والنهاية بصيغة صحيحة.")
    try:
        start = getdate(from_date)
        end = getdate(to_date)
    except ValueError:
        frappe.throw("أدخل تاريخي البداية والنهاية بصيغة صحيحة.")
    if start > end:
        frappe.throw("تاريخ بداية الفترة يجب أن يسبق تاريخ نهايتها.")
    if (end - start).days > 400:
        frappe.throw("اختر فترة لا تتجاوز 400 يوم لكل فحص.")

    period = [str(start), str(end)]
    return {
        "company": company,
        "from_date": period[0],
        "to_date": period[1],
        "checked_at": now_datetime().isoformat(),
        "draft_journals": _visible_count(
            "Journal Entry",
            {"company": company, "docstatus": 0, "posting_date": ["between", period]},
        ),
        "unreconciled_bank_transactions": _visible_count(
            "Bank Transaction",
            {
                "company": company,
                "docstatus": 1,
                "date": ["between", period],
                "status": ["in", ["Pending", "Unreconciled"]],
            },
        ),
        "unallocated_payments": _visible_count(
            "Payment Entry",
            {
                "company": company,
                "docstatus": 1,
                "posting_date": ["between", period],
                "unallocated_amount": [">", 0.005],
            },
        ),
        "covering_closing_vouchers": _visible_count(
            "Period Closing Voucher",
            {
                "company": company,
                "docstatus": 1,
                "period_start_date": ["<=", period[0]],
                "period_end_date": [">=", period[1]],
            },
        ),
    }
