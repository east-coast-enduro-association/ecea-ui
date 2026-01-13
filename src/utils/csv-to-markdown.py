#!/usr/bin/env python3
"""
CSV to Markdown Table Converter

Converts CSV files to markdown tables.

Usage:
    python csv-to-markdown.py <csv_file> [options]

Examples:
    python csv-to-markdown.py results.csv
    python csv-to-markdown.py results.csv -o output.md
    python csv-to-markdown.py results.csv --group-by Class
    python csv-to-markdown.py results.csv --title-case "Rider Name"
"""

import argparse
import csv
import sys
from pathlib import Path


def read_csv(file_path: str, delimiter: str = ",") -> tuple[list[str], list[list[str]]]:
    """Read CSV file and return headers and rows."""
    with open(file_path, "r", newline="", encoding="utf-8-sig") as f:
        # Try to detect delimiter if not specified
        sample = f.read(4096)
        f.seek(0)

        if delimiter == "auto":
            sniffer = csv.Sniffer()
            try:
                dialect = sniffer.sniff(sample)
                delimiter = dialect.delimiter
            except csv.Error:
                delimiter = ","

        reader = csv.reader(f, delimiter=delimiter)
        rows = list(reader)

        if not rows:
            return [], []

        headers = rows[0]
        data = rows[1:]

        return headers, data


def clean_cell(value: str) -> str:
    """Clean a cell value for markdown."""
    if value is None:
        return ""
    # Escape pipe characters and clean whitespace
    return str(value).strip().replace("|", "\\|")


def to_title_case(value: str) -> str:
    """Convert value to title case."""
    return value.title() if value else ""


def generate_markdown_table(headers: list[str], rows: list[list[str]], title_case_cols: list[str] = None) -> str:
    """Generate a markdown table from headers and rows."""
    if not headers:
        return ""

    title_case_cols = title_case_cols or []
    title_case_indices = [i for i, h in enumerate(headers) if h in title_case_cols]

    lines = []

    # Header row
    header_cells = [clean_cell(h) for h in headers]
    lines.append("| " + " | ".join(header_cells) + " |")

    # Separator row
    separators = ["---"] * len(headers)
    lines.append("| " + " | ".join(separators) + " |")

    # Data rows
    for row in rows:
        # Pad row if needed
        while len(row) < len(headers):
            row.append("")

        cells = []
        for i, cell in enumerate(row[:len(headers)]):
            value = clean_cell(cell)
            if i in title_case_indices:
                value = to_title_case(value)
            cells.append(value)

        lines.append("| " + " | ".join(cells) + " |")

    return "\n".join(lines)


def group_by_column(headers: list[str], rows: list[list[str]], group_col: str) -> dict[str, list[list[str]]]:
    """Group rows by a specific column value."""
    if group_col not in headers:
        print(f"Warning: Column '{group_col}' not found in headers", file=sys.stderr)
        return {"All": rows}

    col_index = headers.index(group_col)
    groups = {}

    for row in rows:
        if col_index < len(row):
            key = row[col_index].strip() or "Unknown"
        else:
            key = "Unknown"

        if key not in groups:
            groups[key] = []
        groups[key].append(row)

    return groups


def generate_grouped_tables(
    headers: list[str],
    rows: list[list[str]],
    group_col: str,
    title_case_cols: list[str] = None,
    remove_group_col: bool = False
) -> str:
    """Generate multiple markdown tables grouped by a column."""
    groups = group_by_column(headers, rows, group_col)

    # Optionally remove the group column from output
    output_headers = headers
    if remove_group_col and group_col in headers:
        col_index = headers.index(group_col)
        output_headers = headers[:col_index] + headers[col_index + 1:]

    lines = []
    for group_name, group_rows in groups.items():
        lines.append(f"\n## {group_name}\n")

        if remove_group_col and group_col in headers:
            col_index = headers.index(group_col)
            filtered_rows = [
                row[:col_index] + row[col_index + 1:]
                for row in group_rows
            ]
        else:
            filtered_rows = group_rows

        table = generate_markdown_table(output_headers, filtered_rows, title_case_cols)
        lines.append(table)

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Convert CSV files to markdown tables",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s results.csv
  %(prog)s results.csv -o output.md
  %(prog)s results.csv --group-by Class
  %(prog)s results.csv --title-case "Rider Name" --title-case "Club"
  %(prog)s results.csv --delimiter "\\t"
        """
    )
    parser.add_argument("csv_file", help="Path to the CSV file")
    parser.add_argument(
        "--output", "-o",
        help="Output file (default: stdout)"
    )
    parser.add_argument(
        "--delimiter", "-d",
        default=",",
        help="CSV delimiter (default: comma, use 'auto' to detect)"
    )
    parser.add_argument(
        "--group-by", "-g",
        dest="group_by",
        help="Group rows by this column and create separate tables"
    )
    parser.add_argument(
        "--remove-group-col",
        action="store_true",
        help="Remove the group-by column from the output tables"
    )
    parser.add_argument(
        "--title-case", "-t",
        action="append",
        dest="title_case_cols",
        default=[],
        help="Apply title case to these columns (can be used multiple times)"
    )
    parser.add_argument(
        "--heading", "-H",
        help="Add a heading before the table"
    )

    args = parser.parse_args()

    csv_path = Path(args.csv_file)
    if not csv_path.exists():
        print(f"Error: File not found: {csv_path}", file=sys.stderr)
        sys.exit(1)

    # Handle tab delimiter
    delimiter = args.delimiter
    if delimiter == "\\t":
        delimiter = "\t"

    # Read CSV
    headers, rows = read_csv(str(csv_path), delimiter)

    if not headers:
        print("Error: CSV file is empty or has no headers", file=sys.stderr)
        sys.exit(1)

    # Generate markdown
    markdown_parts = []

    if args.heading:
        markdown_parts.append(f"# {args.heading}\n")

    if args.group_by:
        table = generate_grouped_tables(
            headers,
            rows,
            args.group_by,
            args.title_case_cols,
            args.remove_group_col
        )
    else:
        table = generate_markdown_table(headers, rows, args.title_case_cols)

    markdown_parts.append(table)
    markdown = "\n".join(markdown_parts)

    # Output
    if args.output:
        with open(args.output, "w") as f:
            f.write(markdown)
        print(f"Output written to: {args.output}", file=sys.stderr)
    else:
        print(markdown)


if __name__ == "__main__":
    main()
