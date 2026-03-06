#!/usr/bin/env python3
"""
ECEA Club Roster Import Script

Converts Excel/CSV club roster files to the JSON format used by the website.
Outputs to src/content/members/current-all-members.json with automatic backup.

Usage:
    python3 scripts/import-roster.py <input_file> [--year 2026]

Examples:
    python3 scripts/import-roster.py ~/Downloads/roster.xlsx
    python3 scripts/import-roster.py ~/Downloads/roster.csv --year 2026

On first run, this script creates a virtual environment and installs dependencies.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path


def ensure_venv():
    """Ensure we're running in a venv with required packages."""
    script_dir = Path(__file__).parent
    venv_dir = script_dir / ".venv"
    venv_python = venv_dir / "bin" / "python3"

    # Check if we're already in the venv
    if sys.prefix == str(venv_dir):
        return  # Already in venv

    # Check if venv exists and has our packages
    if venv_python.exists():
        # Re-run this script using the venv python
        os.execv(str(venv_python), [str(venv_python), __file__] + sys.argv[1:])

    # Create venv
    print("Setting up virtual environment (first-time setup)...")
    subprocess.check_call([sys.executable, "-m", "venv", str(venv_dir)])

    # Install packages
    pip = venv_dir / "bin" / "pip"
    print("Installing pandas and openpyxl...")
    subprocess.check_call([str(pip), "install", "pandas", "openpyxl", "-q"])

    print("Setup complete! Re-running script...\n")
    # Re-run with venv python
    os.execv(str(venv_python), [str(venv_python), __file__] + sys.argv[1:])


# Ensure venv before importing pandas
ensure_venv()

import pandas as pd


# Constants
OUTPUT_FILENAME = "current-members.json"
BACKUP_PREFIX = "members-bak-"


def normalize_name(name: str) -> str:
    """Normalize a name to uppercase."""
    if not name or pd.isna(name):
        return ""
    return str(name).strip().upper()


def normalize_club(club: str) -> str:
    """Normalize club abbreviation."""
    if not club or pd.isna(club):
        return ""
    return str(club).strip().upper()


def normalize_string(value) -> str:
    """Normalize a string value."""
    if value is None or pd.isna(value):
        return ""
    return str(value).strip()


def normalize_number(value) -> str:
    """Normalize a number value (AMA#, bike#)."""
    if value is None or pd.isna(value):
        return ""
    # Handle floats that are actually integers
    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))
    return str(value).strip()


def find_column(df: pd.DataFrame, possible_names: list) -> str:
    """Find a column by trying multiple possible names."""
    columns_lower = {col.lower().strip(): col for col in df.columns}
    for name in possible_names:
        if name.lower() in columns_lower:
            return columns_lower[name.lower()]
    return None


def parse_roster(df: pd.DataFrame) -> list:
    """Parse a DataFrame into the member list format."""
    members = []

    # Try to find columns by common names
    name_col = find_column(df, ['name', 'full name', 'member name', 'rider name', 'rider'])
    first_name_col = find_column(df, ['first name', 'first', 'firstname', 'given name'])
    last_name_col = find_column(df, ['last name', 'last', 'lastname', 'surname', 'family name'])
    club_col = find_column(df, ['club', 'clubs', 'cliubs', 'club abbr', 'club abbreviation', 'club name'])  # Note: 'cliubs' typo
    ama_col = find_column(df, ['ama', 'ama #', 'ama#', 'ama number', 'ama_number'])
    number_col = find_column(df, ['number', 'bike #', 'bike#', '#', 'bike number', 'race number'])
    city_col = find_column(df, ['city', 'town'])
    state_col = find_column(df, ['state', 'st', 'state/province'])

    # Determine how to get the name
    has_full_name = name_col is not None
    has_split_name = first_name_col is not None and last_name_col is not None

    if not has_full_name and not has_split_name:
        print(f"Warning: Could not find name column(s). Available columns: {list(df.columns)}")
        print("Looking for either 'name' OR ('first name' AND 'last name')")
        return []

    print(f"Detected columns:")
    if has_full_name:
        print(f"  Name: {name_col}")
    else:
        print(f"  First Name: {first_name_col}")
        print(f"  Last Name: {last_name_col}")
    print(f"  Club: {club_col}")
    print(f"  AMA#: {ama_col}")
    print(f"  Bike#: {number_col}")
    print(f"  City: {city_col}")
    print(f"  State: {state_col}")

    for _, row in df.iterrows():
        # Get the name
        if has_full_name:
            name = normalize_name(row.get(name_col, ""))
        else:
            first = normalize_string(row.get(first_name_col, ""))
            last = normalize_string(row.get(last_name_col, ""))
            name = f"{first} {last}".strip().upper()

        if not name:
            continue

        member = {
            "name": name,
            "club": normalize_club(row.get(club_col, "")) if club_col else "",
        }

        # Add optional fields if they exist and have values
        if ama_col:
            ama = normalize_number(row.get(ama_col, ""))
            if ama:
                member["ama"] = ama

        if number_col:
            number = normalize_number(row.get(number_col, ""))
            if number:
                member["number"] = number

        if city_col:
            city = normalize_string(row.get(city_col, ""))
            if city:
                member["city"] = city.upper()

        if state_col:
            state = normalize_string(row.get(state_col, ""))
            if state:
                member["state"] = state.upper()

        members.append(member)

    # Sort by name
    members.sort(key=lambda m: m["name"])

    return members


def read_input_file(filepath: str) -> dict:
    """Read input file (Excel or CSV) and return dict of sheet name -> DataFrame."""
    path = Path(filepath)

    if not path.exists():
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    ext = path.suffix.lower()

    if ext in ['.xlsx', '.xls']:
        # Read all sheets from Excel
        return pd.read_excel(filepath, sheet_name=None)
    elif ext == '.csv':
        # CSV has only one "sheet"
        df = pd.read_csv(filepath)
        return {path.stem: df}
    else:
        print(f"Error: Unsupported file format: {ext}")
        print("Supported formats: .xlsx, .xls, .csv")
        sys.exit(1)


def backup_existing_file(output_path: Path) -> Path | None:
    """Backup existing file if it exists. Returns backup path or None."""
    if not output_path.exists():
        return None

    # Create backup filename with current date
    backup_filename = f"{BACKUP_PREFIX}{date.today().isoformat()}.json"
    backup_path = output_path.parent / backup_filename

    # If backup already exists for today, add a number suffix
    counter = 1
    while backup_path.exists():
        backup_filename = f"{BACKUP_PREFIX}{date.today().isoformat()}-{counter}.json"
        backup_path = output_path.parent / backup_filename
        counter += 1

    shutil.copy2(output_path, backup_path)
    return backup_path


def main():
    parser = argparse.ArgumentParser(
        description="Import ECEA club roster from Excel/CSV to website format"
    )
    parser.add_argument("input_file", help="Path to Excel or CSV file")
    parser.add_argument("--year", type=int, default=date.today().year,
                        help="Year for the roster (default: current year)")
    parser.add_argument("--output-dir", type=str, default=None,
                        help="Output directory (default: src/content/members/)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview output without writing files")
    parser.add_argument("--sheet", type=str, default=None,
                        help="Specific sheet name to import (Excel only)")
    parser.add_argument("--no-backup", action="store_true",
                        help="Skip creating backup of existing file")

    args = parser.parse_args()

    # Determine output directory
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    output_dir = Path(args.output_dir) if args.output_dir else repo_root / "src" / "content" / "members"

    if not output_dir.exists():
        print(f"Error: Output directory does not exist: {output_dir}")
        sys.exit(1)

    # Read input file
    print(f"Reading: {args.input_file}")
    sheets = read_input_file(args.input_file)

    print(f"Found {len(sheets)} sheet(s): {list(sheets.keys())}")

    # Filter to specific sheet if requested
    if args.sheet:
        if args.sheet not in sheets:
            print(f"Error: Sheet '{args.sheet}' not found. Available: {list(sheets.keys())}")
            sys.exit(1)
        sheets = {args.sheet: sheets[args.sheet]}

    # Combine all sheets into one member list
    all_members = []
    for sheet_name, df in sheets.items():
        print(f"\n--- Processing sheet: {sheet_name} ---")
        print(f"Rows: {len(df)}")

        members = parse_roster(df)
        if members:
            print(f"Parsed {len(members)} members")
            all_members.extend(members)
        else:
            print(f"Warning: No members found in sheet '{sheet_name}'")

    if not all_members:
        print("\nError: No members found in any sheet")
        sys.exit(1)

    # Sort by name
    all_members.sort(key=lambda m: m["name"])

    # Check for duplicate AMA numbers (primary key)
    ama_index = {}  # AMA -> list of members with that AMA
    duplicates = []

    for member in all_members:
        ama = member.get("ama", "")
        if not ama:
            continue  # Skip members without AMA

        if ama in ama_index:
            # Found a duplicate AMA
            if ama not in [d["ama"] for d in duplicates]:
                # Add the first occurrence too
                duplicates.extend([m for m in ama_index[ama]])
            duplicates.append(member)
            ama_index[ama].append(member)
        else:
            ama_index[ama] = [member]

    print(f"\nTotal members: {len(all_members)}")

    if duplicates:
        print(f"⚠️  Found {len(duplicates)} entries with duplicate AMA numbers!")

    # Create output data
    output_data = {
        "year": args.year,
        "series": "All Members",
        "lastUpdated": date.today().isoformat(),
        "members": all_members
    }

    # Output paths
    output_path = output_dir / OUTPUT_FILENAME
    errors_json_path = script_dir / "errors.json"  # Keep errors outside content folder
    errors_xlsx_path = script_dir / "errors.xlsx"

    if args.dry_run:
        print(f"\n[DRY RUN] Would write to: {output_path}")
        print(f"Sample output (first 5 members):")
        sample = {**output_data, "members": all_members[:5]}
        print(json.dumps(sample, indent=2))
        if duplicates:
            print(f"\n[DRY RUN] Would write {len(duplicates)} duplicate entries to: {errors_xlsx_path}")
    else:
        # Backup existing file
        if not args.no_backup:
            backup_path = backup_existing_file(output_path)
            if backup_path:
                print(f"\n✓ Backed up existing file to: {backup_path.name}")

        # Write new file
        print(f"Writing to: {output_path}")
        with open(output_path, 'w') as f:
            json.dump(output_data, f, indent=2)
        print(f"✓ Wrote {len(all_members)} members to {OUTPUT_FILENAME}")

        # Write errors file if duplicates found
        if duplicates:
            # Sort duplicates by AMA for easier review
            duplicates.sort(key=lambda m: (m.get("ama", ""), m["name"]))

            # Write JSON version
            errors_data = {
                "generatedAt": date.today().isoformat(),
                "description": "Duplicate AMA numbers found - these need manual review",
                "duplicateCount": len(duplicates),
                "duplicates": duplicates
            }
            with open(errors_json_path, 'w') as f:
                json.dump(errors_data, f, indent=2)

            # Write Excel version
            errors_df = pd.DataFrame(duplicates)
            # Reorder columns for better readability
            cols = ['ama', 'name', 'club']
            cols.extend([c for c in errors_df.columns if c not in cols])
            errors_df = errors_df[cols]
            errors_df.to_excel(errors_xlsx_path, index=False, sheet_name='Duplicate AMAs')

            print(f"⚠️  Wrote {len(duplicates)} duplicate entries to errors.xlsx - please review!")

    print("\nDone!")


if __name__ == "__main__":
    main()
