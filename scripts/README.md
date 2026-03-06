# ECEA Scripts

Utility scripts for managing ECEA website data.

## import-roster.py

Imports club roster data from Excel/CSV files into the website's member list.

### Usage

```bash
python3 scripts/import-roster.py <input_file> [options]
```

### Examples

```bash
# Import from Excel file
python3 scripts/import-roster.py ~/Downloads/roster.xlsx

# Specify year
python3 scripts/import-roster.py ~/Downloads/roster.xlsx --year 2026

# Preview without writing (dry run)
python3 scripts/import-roster.py ~/Downloads/roster.xlsx --dry-run

# Skip backup
python3 scripts/import-roster.py ~/Downloads/roster.xlsx --no-backup
```

### Options

| Option | Description |
|--------|-------------|
| `--year` | Year for the roster (default: current year) |
| `--dry-run` | Preview output without writing files |
| `--no-backup` | Skip creating backup of existing file |
| `--output-dir` | Output directory (default: `src/content/members/`) |
| `--sheet` | Specific sheet name to import (Excel only) |

### Input Format

The script accepts Excel (`.xlsx`, `.xls`) or CSV (`.csv`) files. It automatically detects columns by looking for common names:

| Field | Detected Column Names |
|-------|----------------------|
| Name | `name`, `full name`, `member name`, `rider name`, `rider` |
| First Name | `first name`, `first`, `firstname`, `given name` |
| Last Name | `last name`, `last`, `lastname`, `surname`, `family name` |
| Club | `club`, `clubs`, `cliubs`, `club abbr`, `club abbreviation` |
| AMA # | `ama`, `ama #`, `ama#`, `ama number` |
| Bike # | `number`, `bike #`, `bike#`, `bike number`, `race number` |
| City | `city`, `town` |
| State | `state`, `st`, `state/province` |

The script can handle either a single "Name" column or separate "First Name" and "Last Name" columns.

### Output

**Main output:** `src/content/members/current-members.json`

```json
{
  "year": 2026,
  "series": "All Members",
  "lastUpdated": "2026-03-06",
  "members": [
    {
      "name": "JOHN DOE",
      "club": "SJER",
      "ama": "123456"
    }
  ]
}
```

**Backup:** Before overwriting, the existing file is backed up to `members-bak-YYYY-MM-DD.json`

**Errors:** If duplicate AMA numbers are found, they are written to:
- `scripts/errors.xlsx` - Excel file for easy review and correction
- `scripts/errors.json` - JSON format

The main output is NOT deduplicated - duplicates must be fixed manually in the source data.

### First Run

On first run, the script automatically creates a Python virtual environment in `scripts/.venv/` and installs required dependencies (`pandas`, `openpyxl`).

### Data Flow

```
Excel/CSV file
    ↓
import-roster.py
    ↓
src/content/members/current-members.json
    ↓
Used by:
  - /resources/members (member list page)
  - /clubs/[slug] (club member lists)
  - /resources (member count)
```
