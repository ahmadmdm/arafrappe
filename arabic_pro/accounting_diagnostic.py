"""Compatibility import for pre-migration API clients.

The accounting diagnostic implementation belongs to smart_statement.
"""

from smart_statement.accounting_diagnostic import get_period_signals

__all__ = ["get_period_signals"]
