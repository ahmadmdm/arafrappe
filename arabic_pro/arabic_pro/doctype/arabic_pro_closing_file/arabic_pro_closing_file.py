"""Backward-compatible API names; all accounting logic lives in Smart Statement."""

from smart_statement.smart_statement.doctype.arabic_pro_closing_file.arabic_pro_closing_file import (
    apply_report_suggestions,
    approve_review,
    download_closing_package,
    get_closing_dashboard,
    get_review_state,
    reopen_review,
    submit_for_review,
    verify_reports,
)

__all__ = [
    "apply_report_suggestions",
    "approve_review",
    "download_closing_package",
    "get_closing_dashboard",
    "get_review_state",
    "reopen_review",
    "submit_for_review",
    "verify_reports",
]
