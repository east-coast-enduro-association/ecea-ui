#!/usr/bin/env python3
"""
PDF to Markdown Table Converter for ECEA Results

This script parses ECEA results PDFs and converts them to markdown tables.
Supports:
- Class results PDFs (standings by class)
- AA advancement PDFs (overall long course standings)

Usage:
    python pdf-to-markdown.py <pdf_file> [--type class|aa]

Requirements:
    pip install pdfplumber
"""

import argparse
import re
import sys
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("Error: pdfplumber is required. Install it with: pip install pdfplumber")
    sys.exit(1)


def extract_tables_from_pdf(pdf_path: str) -> list:
    """Extract all tables from a PDF file."""
    tables = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_tables = page.extract_tables()
            if page_tables:
                tables.extend(page_tables)
    return tables


def clean_cell(cell: str | None) -> str:
    """Clean a table cell value."""
    if cell is None:
        return ""
    # Remove extra whitespace and newlines
    return " ".join(str(cell).split()).strip()


def detect_pdf_type(tables: list) -> str:
    """Detect whether PDF is class results or AA advancement."""
    for table in tables:
        if table and len(table) > 0:
            header = " ".join([str(cell) for cell in table[0] if cell])
            if "AA Advancement" in header or "OVERALL Long Course" in header:
                return "aa"
            if "Class" in header or "by CLASS" in header:
                return "class"
    return "class"


def parse_class_results(tables: list) -> str:
    """Parse class results PDF and generate markdown."""
    markdown_lines = []
    current_class = None
    class_data = []

    for table in tables:
        for row in table:
            if not row or all(cell is None or str(cell).strip() == "" for cell in row):
                continue

            cleaned_row = [clean_cell(cell) for cell in row]

            # Skip header rows
            if "Place" in cleaned_row and "Club" in cleaned_row:
                continue
            if "Rider Name" in cleaned_row:
                continue

            # Check if this is a class header (single cell with class name)
            non_empty = [c for c in cleaned_row if c]
            if len(non_empty) == 1:
                potential_class = non_empty[0]
                # Check if it looks like a class name
                if any(cls in potential_class for cls in ["AA", "A ", "B ", "C ", "Women", "Masters", "Golden", "Legends"]):
                    # Save previous class data
                    if current_class and class_data:
                        markdown_lines.append(format_class_table(current_class, class_data))
                    current_class = potential_class
                    class_data = []
                    continue

            # Check if first cell is a number (place)
            if cleaned_row and cleaned_row[0] and cleaned_row[0].isdigit():
                # This is a rider row
                class_data.append(cleaned_row)

    # Don't forget the last class
    if current_class and class_data:
        markdown_lines.append(format_class_table(current_class, class_data))

    return "\n".join(markdown_lines)


def format_class_table(class_name: str, data: list) -> str:
    """Format a single class table as markdown."""
    lines = []
    lines.append(f"\n## {class_name}\n")
    lines.append("| Place | Club | Rider Name | Class | Brand | Events | Total |")
    lines.append("|-------|------|------------|-------|-------|--------|-------|")

    for row in data:
        # Ensure we have enough columns, pad with empty strings if needed
        while len(row) < 6:
            row.append("")

        place = row[0] if len(row) > 0 else ""
        club = row[1] if len(row) > 1 else ""
        rider = row[2] if len(row) > 2 else ""
        cls = row[3] if len(row) > 3 else ""
        brand = row[4] if len(row) > 4 else ""
        events = row[5] if len(row) > 5 else ""
        total = row[6] if len(row) > 6 else ""

        # Title case the rider name
        rider = rider.title() if rider else ""

        lines.append(f"| {place} | {club} | {rider} | {cls} | {brand} | {events} | {total} |")

    return "\n".join(lines)


def parse_aa_advancement(tables: list) -> str:
    """Parse AA advancement PDF and generate markdown."""
    markdown_lines = []
    markdown_lines.append("\n## Overall Long Course Top 10\n")
    markdown_lines.append("| Place | Rider Name | Club | Class | Brand | Total | Events | Avg Pts | Net Total |")
    markdown_lines.append("|-------|------------|------|-------|-------|-------|--------|---------|-----------|")

    for table in tables:
        for row in table:
            if not row:
                continue

            cleaned_row = [clean_cell(cell) for cell in row]

            # Skip header rows
            if "Place" in cleaned_row or "Rider Name" in cleaned_row:
                continue
            if "OVERALL" in " ".join(cleaned_row):
                continue

            # Check if first cell is a number (place)
            if cleaned_row and cleaned_row[0] and cleaned_row[0].isdigit():
                place = cleaned_row[0]
                rider = cleaned_row[1].title() if len(cleaned_row) > 1 else ""
                club = cleaned_row[2] if len(cleaned_row) > 2 else ""
                cls = cleaned_row[3] if len(cleaned_row) > 3 else ""
                brand = cleaned_row[4] if len(cleaned_row) > 4 else ""

                # The remaining columns are event scores, then total, event count, avg, net
                # Find the last 4 numeric values for total, events, avg, net
                numeric_values = []
                for i in range(len(cleaned_row) - 1, 4, -1):
                    val = cleaned_row[i]
                    if val and (val.isdigit() or val.replace(".", "").isdigit()):
                        numeric_values.insert(0, val)
                    if len(numeric_values) >= 4:
                        break

                total = numeric_values[0] if len(numeric_values) > 0 else ""
                events = numeric_values[1] if len(numeric_values) > 1 else ""
                avg = numeric_values[2] if len(numeric_values) > 2 else ""
                net = numeric_values[3] if len(numeric_values) > 3 else ""

                markdown_lines.append(f"| {place} | {rider} | {club} | {cls} | {brand} | {total} | {events} | {avg} | {net} |")

    return "\n".join(markdown_lines)


def parse_pdf_with_text(pdf_path: str, pdf_type: str) -> str:
    """Parse PDF using text extraction for better handling of complex layouts."""
    with pdfplumber.open(pdf_path) as pdf:
        all_text = ""
        for page in pdf.pages:
            all_text += page.extract_text() + "\n"

    if pdf_type == "class":
        return parse_class_text(all_text)
    else:
        return parse_aa_text(all_text)


def parse_class_text(text: str) -> str:
    """Parse class results from extracted text."""
    lines = text.split("\n")
    markdown_lines = []
    current_class = None
    class_data = []

    # Class name patterns
    class_patterns = [
        r"^(AA)$",
        r"^(A \d+-\d+)$",
        r"^(A Open \d+\+)$",
        r"^(A Vet \d+\+)$",
        r"^(A Senior \d+\+)$",
        r"^(A Super Sr \d+\+)$",
        r"^(B \d+-\d+)$",
        r"^(B Open \d+\+)$",
        r"^(B Vet \d+\+)$",
        r"^(B Senior \d+\+)$",
        r"^(B Super Sr \d+\+)$",
        r"^(C \d+-\d+)$",
        r"^(C Open \d+\+)$",
        r"^(C Vet \d+\+)$",
        r"^(C Senior \d+\+)$",
        r"^(C Super Sr \d+\+)$",
        r"^(Women)$",
        r"^(Masters [ABC/]+ \d+\+)$",
        r"^(Golden \d+\+)$",
        r"^(Legends \d+\+)$",
    ]

    # Data row pattern: starts with a number (place)
    data_pattern = r"^(\d+)\s+([A-Z0-9]+)\s+([A-Z\s]+)\s+([A-Z0-9\s\+]+)\s+([A-Z]{3})\s+(\d+)\s+(\d+)$"

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check for class header
        is_class = False
        for pattern in class_patterns:
            if re.match(pattern, line, re.IGNORECASE):
                if current_class and class_data:
                    markdown_lines.append(format_class_table(current_class, class_data))
                current_class = line
                class_data = []
                is_class = True
                break

        if is_class:
            continue

        # Try to parse as data row
        match = re.match(data_pattern, line, re.IGNORECASE)
        if match:
            class_data.append(list(match.groups()))
        else:
            # Try simpler parsing - split by multiple spaces
            parts = re.split(r"\s{2,}", line)
            if len(parts) >= 5 and parts[0].isdigit():
                class_data.append(parts)

    # Last class
    if current_class and class_data:
        markdown_lines.append(format_class_table(current_class, class_data))

    return "\n".join(markdown_lines)


def parse_aa_text(text: str) -> str:
    """Parse AA advancement from extracted text."""
    lines = text.split("\n")
    markdown_lines = []
    markdown_lines.append("\n## Overall Long Course Top 10\n")
    markdown_lines.append("| Place | Rider Name | Club | Class | Brand | Total | Events | Avg Pts | Net Total |")
    markdown_lines.append("|-------|------------|------|-------|-------|-------|--------|---------|-----------|")

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Skip headers
        if "Place" in line or "OVERALL" in line or "Rider Name" in line:
            continue

        # Try to parse data rows
        parts = re.split(r"\s{2,}", line)
        if len(parts) >= 5 and parts[0].isdigit():
            place = parts[0]
            rider = parts[1].title() if len(parts) > 1 else ""
            club = parts[2] if len(parts) > 2 else ""
            cls = parts[3] if len(parts) > 3 else ""
            brand = parts[4] if len(parts) > 4 else ""

            # Last few values
            total = parts[-4] if len(parts) > 7 else ""
            events = parts[-3] if len(parts) > 6 else ""
            avg = parts[-2] if len(parts) > 5 else ""
            net = parts[-1] if len(parts) > 4 else ""

            markdown_lines.append(f"| {place} | {rider} | {club} | {cls} | {brand} | {total} | {events} | {avg} | {net} |")

    return "\n".join(markdown_lines)


def main():
    parser = argparse.ArgumentParser(
        description="Convert ECEA results PDFs to markdown tables"
    )
    parser.add_argument("pdf_file", help="Path to the PDF file")
    parser.add_argument(
        "--type",
        choices=["class", "aa", "auto"],
        default="auto",
        help="Type of PDF: class (class results), aa (AA advancement), or auto (detect)"
    )
    parser.add_argument(
        "--output",
        "-o",
        help="Output file (default: stdout)"
    )

    args = parser.parse_args()

    pdf_path = Path(args.pdf_file)
    if not pdf_path.exists():
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    # Extract tables
    tables = extract_tables_from_pdf(str(pdf_path))

    # Detect or use specified type
    if args.type == "auto":
        pdf_type = detect_pdf_type(tables)
        print(f"Detected PDF type: {pdf_type}", file=sys.stderr)
    else:
        pdf_type = args.type

    # Parse based on type
    if tables:
        if pdf_type == "class":
            markdown = parse_class_results(tables)
        else:
            markdown = parse_aa_advancement(tables)
    else:
        # Fall back to text extraction
        print("No tables found, using text extraction...", file=sys.stderr)
        markdown = parse_pdf_with_text(str(pdf_path), pdf_type)

    # Output
    if args.output:
        with open(args.output, "w") as f:
            f.write(markdown)
        print(f"Output written to: {args.output}", file=sys.stderr)
    else:
        print(markdown)


if __name__ == "__main__":
    main()
