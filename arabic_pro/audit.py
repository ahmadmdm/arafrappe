from __future__ import annotations

import csv
import importlib
from collections import defaultdict
from pathlib import Path


def get_translation_file(app: str = "arabic_pro", lang: str = "ar") -> Path:
	module = importlib.import_module(app)
	module_path = Path(module.__file__).resolve().parent
	translation_file = module_path / "translations" / f"{lang}.csv"
	if not translation_file.exists():
		raise FileNotFoundError(f"Translation file not found: {translation_file}")
	return translation_file


def audit_translation_file(file_path: str | Path) -> dict:
	path = Path(file_path)
	if not path.exists():
		raise FileNotFoundError(f"Translation file not found: {path}")

	source_rows = defaultdict(list)
	row_counts = defaultdict(int)
	issues = {
		"missing_source": [],
		"missing_translation": [],
		"extra_columns": [],
		"duplicate_rows": [],
		"conflicting_translations": [],
		"whitespace_source": [],
		"whitespace_translation": [],
	}

	total_rows = 0
	valid_rows = 0

	with path.open("r", encoding="utf-8", newline="") as handle:
		reader = csv.reader(handle)
		for row_number, row in enumerate(reader, start=1):
			total_rows += 1

			if not row:
				issues["missing_source"].append(
					{"line": row_number, "source": "", "translation": "", "reason": "empty_row"}
				)
				continue

			if len(row) > 3:
				issues["extra_columns"].append({"line": row_number, "columns": len(row)})

			raw_source = row[0] if len(row) >= 1 else ""
			raw_translation = row[1] if len(row) >= 2 else ""
			source = raw_source.strip()
			translation = raw_translation.strip()

			if raw_source != source:
				issues["whitespace_source"].append({"line": row_number, "value": raw_source})

			if len(row) >= 2 and raw_translation != translation:
				issues["whitespace_translation"].append({"line": row_number, "value": raw_translation})

			if not source:
				issues["missing_source"].append(
					{"line": row_number, "source": source, "translation": translation, "reason": "blank_source"}
				)
				continue

			if len(row) < 2 or not translation:
				issues["missing_translation"].append(
					{"line": row_number, "source": source, "translation": translation}
				)
				continue

			valid_rows += 1
			key = (source, translation)
			row_counts[key] += 1
			source_rows[source].append({"line": row_number, "translation": translation})

	for (source, translation), count in row_counts.items():
		if count > 1:
			lines = [entry["line"] for entry in source_rows[source] if entry["translation"] == translation]
			issues["duplicate_rows"].append(
				{
					"source": source,
					"translation": translation,
					"count": count,
					"lines": lines,
				}
			)

	for source, entries in source_rows.items():
		translations = sorted({entry["translation"] for entry in entries})
		if len(translations) > 1:
			issues["conflicting_translations"].append(
				{
					"source": source,
					"translations": translations,
					"lines": [entry["line"] for entry in entries],
				}
			)

	issue_counts = {name: len(values) for name, values in issues.items()}
	total_issues = sum(issue_counts.values())

	return {
		"file": str(path),
		"total_rows": total_rows,
		"valid_rows": valid_rows,
		"issue_counts": issue_counts,
		"total_issues": total_issues,
		"issues": issues,
		"is_clean": total_issues == 0,
	}