"""Add a stable, idempotent Accounting workspace link to the Arabic guide."""

import json

import frappe


PAGE = "arabic-pro-accounting-guide"
LABEL = "دليل الدورة المحاسبية"
BLOCK_ID = "arabic_pro_accounting_cycle_guide"
REVIEW_LABEL = "ملفات مراجعة الإقفال"
REVIEW_BLOCK_ID = "arabic_pro_closing_review"
DASHBOARD_PAGE = "arabic-pro-closing-dashboard"
DASHBOARD_LABEL = "لوحة متابعة الإقفال"
DASHBOARD_BLOCK_ID = "arabic_pro_closing_dashboard"


def ensure_accounting_guide_shortcut():
    if not frappe.db.exists("Workspace", "Accounting") or not frappe.db.exists("Page", PAGE):
        return

    workspace = frappe.get_doc("Workspace", "Accounting")
    content = json.loads(workspace.content or "[]")
    changed = False

    if not any(shortcut.label == LABEL for shortcut in workspace.shortcuts):
        workspace.append(
            "shortcuts",
            {
                "type": "Page",
                "link_to": PAGE,
                "label": LABEL,
                "color": "#0C6F68",
            },
        )
        changed = True

    if not any(block.get("id") == BLOCK_ID for block in content):
        block = {
            "id": BLOCK_ID,
            "type": "shortcut",
            "data": {"shortcut_name": LABEL, "col": 3},
        }
        position = next(
            (
                index + 1
                for index, item in enumerate(content)
                if item.get("type") == "shortcut"
                and item.get("data", {}).get("shortcut_name") == "Journal Entry"
            ),
            len(content),
        )
        content.insert(position, block)
        workspace.content = json.dumps(content, ensure_ascii=False, separators=(",", ":"))
        changed = True

    if frappe.db.exists("DocType", "Arabic Pro Closing File"):
        if not any(shortcut.label == REVIEW_LABEL for shortcut in workspace.shortcuts):
            workspace.append(
                "shortcuts",
                {
                    "type": "DocType",
                    "link_to": "Arabic Pro Closing File",
                    "label": REVIEW_LABEL,
                    "color": "#19364A",
                },
            )
            changed = True
        if not any(block.get("id") == REVIEW_BLOCK_ID for block in content):
            guide_position = next(
                (index + 1 for index, item in enumerate(content) if item.get("id") == BLOCK_ID),
                len(content),
            )
            content.insert(guide_position, {
                "id": REVIEW_BLOCK_ID,
                "type": "shortcut",
                "data": {"shortcut_name": REVIEW_LABEL, "col": 3},
            })
            workspace.content = json.dumps(content, ensure_ascii=False, separators=(",", ":"))
            changed = True

    if frappe.db.exists("Page", DASHBOARD_PAGE):
        if not any(shortcut.label == DASHBOARD_LABEL for shortcut in workspace.shortcuts):
            workspace.append(
                "shortcuts",
                {
                    "type": "Page",
                    "link_to": DASHBOARD_PAGE,
                    "label": DASHBOARD_LABEL,
                    "color": "#0C6F68",
                },
            )
            changed = True
        if not any(block.get("id") == DASHBOARD_BLOCK_ID for block in content):
            review_position = next(
                (index + 1 for index, item in enumerate(content) if item.get("id") == REVIEW_BLOCK_ID),
                len(content),
            )
            content.insert(review_position, {
                "id": DASHBOARD_BLOCK_ID,
                "type": "shortcut",
                "data": {"shortcut_name": DASHBOARD_LABEL, "col": 3},
            })
            workspace.content = json.dumps(content, ensure_ascii=False, separators=(",", ":"))
            changed = True

    if changed:
        workspace.save(ignore_permissions=True)
        frappe.clear_cache()
