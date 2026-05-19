# ECEA Scripts

Utility scripts for managing ECEA website data.

## import-team-results.mjs

Converts the scoring software's CSV export into the JSON format used by the team standings page.

The script accepts the CSV **exactly as exported** from the scoring software — no reformatting needed. It automatically:
- Detects team header rows vs rider rows
- Extracts the club abbreviation from the team name
- Excludes the host club's teams (0 championship points by rule)
- Excludes DNF and DQ teams
- Computes championship points (25/22/20…) from finishing rank

> **In normal operation this script runs automatically via GitHub Actions** when a CSV is uploaded through the TinaCMS "Upload Team Results" screen. Run it manually only for one-off imports or testing.

### Usage

```bash
npm run import-results -- <csv-file> <host-club-abbr> [year] [series]
```

### Examples

```bash
# Sandy Lane Enduro, hosted by SJER
npm run import-results -- ~/Downloads/results.csv SJER 2026 Enduro

# Hare Scramble event hosted by MMC
npm run import-results -- ~/Downloads/results.csv MMC 2026 "Hare Scramble"
```

### Input format

Pass the CSV exactly as exported from the scoring software (Team Enduro Results report). The script identifies rows by structure:

| Row type | Identifier |
|----------|-----------|
| Team header | `Row` column is a number (`1`, `2`…) or `DNF`/`DQ` |
| Rider row | `Row` column is alphanumeric (`23A`, `7B`…) |

Club abbreviations are extracted from the team name — the part before the first ` - ` (e.g., `OCCR - SAND BLASTERS` → `OCCR`).

### Output

Creates `src/content/teamEventResults/YY-{en|hs}-<host-club>.json`. Then commit and push — Netlify rebuilds automatically.

See `src/content/teamEventResults/README.md` for details on how the team results system works.

---

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

The main output is NOT deduplicated — duplicates must be fixed manually in the source data.

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
