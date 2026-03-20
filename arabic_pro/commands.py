from __future__ import annotations

import json

import click

from arabic_pro.audit import audit_translation_file, get_translation_file


@click.command("arabic-pro-audit-translations")
@click.option("--app", "app_name", default="arabic_pro", show_default=True, help="App name to audit")
@click.option("--lang", default="ar", show_default=True, help="Translation language code")
@click.option("--strict", is_flag=True, default=False, help="Exit with status 1 if issues are found")
@click.option("--json", "as_json", is_flag=True, default=False, help="Print the full report as JSON")
def arabic_pro_audit_translations(app_name: str, lang: str, strict: bool, as_json: bool):
	"Audit a Frappe translation CSV for duplicates, blanks, and conflicts."

	report = audit_translation_file(get_translation_file(app_name, lang))

	if as_json:
		click.echo(json.dumps(report, ensure_ascii=False, indent=2))
	else:
		click.secho("Arabic Pro Translation Audit", fg="cyan", bold=True)
		click.echo(f"File: {report['file']}")
		click.echo(f"Rows: {report['total_rows']} total, {report['valid_rows']} valid")
		click.echo("Issues:")
		for name, count in report["issue_counts"].items():
			label = name.replace("_", " ")
			color = "green" if count == 0 else "yellow"
			click.secho(f"  - {label}: {count}", fg=color)

		if report["is_clean"]:
			click.secho("No translation issues found.", fg="green", bold=True)
		else:
			click.secho(f"Found {report['total_issues']} total issues.", fg="yellow", bold=True)

			for category in ("missing_source", "missing_translation", "extra_columns", "duplicate_rows", "conflicting_translations"):
				entries = report["issues"][category][:5]
				if not entries:
					continue

				click.echo("")
				click.secho(category.replace("_", " ").title(), fg="magenta", bold=True)
				for entry in entries:
					click.echo(f"  - {entry}")

	if strict and not report["is_clean"]:
		raise SystemExit(1)


commands = [arabic_pro_audit_translations]