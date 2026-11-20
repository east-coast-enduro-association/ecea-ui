#!/usr/bin/env python3
"""
ECEA Individual Rider Standings Import Script

Converts the scoring software's "Standings Detail by Class" PDF (MotoTally
export) into the JSON format used by the website's riderStandings content
collection. One file per year/series.

Usage:
    python3 scripts/import-rider-standings.py <by-class.pdf> [--year 2026] [--series Enduro] [--updated YYYY-MM-DD]

Example:
    python3 scripts/import-rider-standings.py \
        "~/Downloads/ECEAEnduro_Standings-Detail_2026-by Classes OFFICIAL 111826.pdf" \
        --year 2026 --series Enduro --updated 2026-11-18

Output: src/content/riderStandings/<year>-<series-slug>.json

Per-event points are kept verbatim as strings so scoring flags survive:
  "20d" = dropped/throwaway round, "0" = DNF credit, "-19" = penalty.
Blank (did-not-compete) cells are omitted from a rider's results.

On first run this creates scripts/.venv and installs pdfplumber.
"""

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import date
from pathlib import Path


def ensure_venv():
    """Re-exec inside scripts/.venv with pdfplumber available."""
    script_dir = Path(__file__).parent
    venv_dir = script_dir / ".venv"
    venv_python = venv_dir / "bin" / "python3"

    if sys.prefix != str(venv_dir):
        if not venv_python.exists():
            print("Setting up virtual environment (first-time setup)...")
            subprocess.check_call([sys.executable, "-m", "venv", str(venv_dir)])
        os.execv(str(venv_python), [str(venv_python), __file__] + sys.argv[1:])

    # Inside the venv now — make sure pdfplumber is installed (once).
    try:
        import pdfplumber  # noqa: F401
    except ImportError:
        if os.environ.get("_RIDER_PIP_DONE"):
            raise
        print("Installing pdfplumber...")
        subprocess.check_call([str(venv_dir / "bin" / "pip"), "install", "pdfplumber", "-q"])
        os.environ["_RIDER_PIP_DONE"] = "1"
        os.execv(str(venv_python), [str(venv_python), __file__] + sys.argv[1:])


ensure_venv()

import pdfplumber  # noqa: E402

# PDF column header label -> canonical event abbreviation used across the site.
LABEL_TO_ABBR = {
    "TCSMC": "TCSMC", "SJER": "SJER", "MMC": "MMC", "CJCR/MCI": "CJCR",
    "RRMC": "RRMC", "HMDR": "HMDR", "STER": "STER", "DVTR": "DVTR",
    "BER": "BER", "GMER": "GMER", "IDR": "IDR", "CDR/DER": "CDR",
    "SPER": "SPER", "VFTR/RORR": "VFTR", "OCCR": "OCCR", "PBER": "PBER",
}

NOISE_PREFIXES = ("East Coast Enduro", "2026 ECEA", "2025 ECEA", "2027 ECEA")


def clean(cell):
    return (cell or "").replace("\n", " ").strip()


def norm_label(s):
    """Collapse whitespace so 'CJCR/ MCI' and 'Event Count' match reliably."""
    return "".join(s.split())


def detect_columns(row):
    """From a header row, map column index -> event abbr, plus count/total indices."""
    col_map, count_idx, total_idx = {}, None, None
    for i, label in enumerate(row):
        nl = norm_label(label)
        if nl in LABEL_TO_ABBR:
            col_map[i] = LABEL_TO_ABBR[nl]
        elif nl in ("EventCount", "Count"):
            count_idx = i
        elif nl == "Total":
            total_idx = i
    return col_map, count_idx, total_idx


def parse_rider(row, col_map, count_idx, total_idx):
    results = []
    for idx, abbr in col_map.items():
        val = row[idx] if idx < len(row) else ""
        if val != "":
            results.append({"event": abbr, "points": val})
    rider = {
        "place": int(row[0]),
        "club": row[1],
        "name": row[2],
        "total": int(row[total_idx]) if total_idx and row[total_idx].lstrip("-").isdigit() else 0,
        "eventCount": int(row[count_idx]) if count_idx and row[count_idx].isdigit() else 0,
        "results": results,
    }
    if len(row) > 3 and row[3]:
        rider["class"] = row[3]
    if len(row) > 4 and row[4]:
        rider["brand"] = row[4]
    return rider


def compute_high_point(classes):
    """Derive top-3 'Overall High Point' per A/B/C division by season total.

    The scoring software doesn't export a per-division overall ranking, so we
    rank each letter division's riders (across its sub-classes, excluding AA)
    by total points for the year. A high-point award goes to the most points.
    """
    out = []
    for div in ("A", "B", "C"):
        riders = []
        for c in classes:
            if c["name"].startswith(div + " "):   # "A ", "B ", "C " — excludes "AA"
                riders.extend(c["riders"])
        riders.sort(key=lambda r: (-r["total"], r.get("eventCount", 0)))
        top3 = [{**r, "place": i + 1} for i, r in enumerate(riders[:3])]
        if top3:
            out.append({"name": f"{div} Overall High Point", "riders": top3})
    return out


def parse_overall(pdf_path):
    """Flat list of riders from the 'Top 3 Overall' PDF (single section)."""
    riders = []
    col_map = count_idx = total_idx = None
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                for raw in table:
                    row = [clean(c) for c in raw]
                    if "Rider Name" in row and "Total" in row:
                        col_map, count_idx, total_idx = detect_columns(row)
                    elif row and row[0].isdigit() and col_map:
                        riders.append(parse_rider(row, col_map, count_idx, total_idx))
    return riders


def load_schedule(repo_root, year, series_slug):
    """Canonical event list (abbr/name/date) from the teamSeasons entry."""
    path = repo_root / "src" / "content" / "teamSeasons" / f"{year}-{series_slug}.json"
    if not path.exists():
        return None
    data = json.loads(path.read_text())
    return [{"abbr": e["abbr"], "name": e["name"], "date": e["date"]} for e in data.get("schedule", [])]


def parse(pdf_path):
    classes = []
    notes = []
    col_map = None          # column index -> event abbr
    count_idx = total_idx = None
    current = None

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                for raw in table:
                    row = [clean(c) for c in raw]
                    nonempty = [c for c in row if c]
                    if not nonempty:
                        continue

                    # Header row: locate event columns + Count/Total.
                    if "Rider Name" in row and "Total" in row:
                        col_map, count_idx, total_idx = detect_columns(row)
                        continue

                    # Scoring-rule notes.
                    if nonempty[0].startswith("SPECIAL NOTE"):
                        if nonempty[0] not in notes:
                            notes.append(nonempty[0])
                        continue

                    # Repeated page titles / org name.
                    if any(nonempty[0].startswith(p) for p in NOISE_PREFIXES):
                        continue

                    # Rider row.
                    if row[0].isdigit():
                        if current is None or col_map is None:
                            continue
                        current["riders"].append(parse_rider(row, col_map, count_idx, total_idx))
                        continue

                    # Otherwise a single-cell row = class section header.
                    if len(nonempty) == 1:
                        current = {"name": nonempty[0], "riders": []}
                        classes.append(current)

    # Drop any empty sections.
    classes = [c for c in classes if c["riders"]]
    return classes, notes


def main():
    ap = argparse.ArgumentParser(description="Import ECEA individual rider standings (by class) PDF.")
    ap.add_argument("pdf", help="Path to the 'Standings Detail by Class' PDF")
    ap.add_argument("--year", type=int, default=date.today().year)
    ap.add_argument("--series", default="Enduro")
    ap.add_argument("--updated", default=None, help="Standings date YYYY-MM-DD (default: today)")
    ap.add_argument("--overall", default=None,
                    help="Optional overall-standings PDF (e.g. the AA-advancement 'Overall Long Course' top-10)")
    args = ap.parse_args()

    pdf_path = Path(os.path.expanduser(args.pdf))
    if not pdf_path.exists():
        sys.exit(f"PDF not found: {pdf_path}")

    repo_root = Path(__file__).resolve().parent.parent
    series_slug = args.series.lower().replace(" ", "-")

    events = load_schedule(repo_root, args.year, series_slug)
    classes, notes = parse(pdf_path)

    overall = []
    if args.overall:
        overall_path = Path(os.path.expanduser(args.overall))
        if not overall_path.exists():
            sys.exit(f"Overall PDF not found: {overall_path}")
        overall = parse_overall(overall_path)

    if events is None:
        # Fall back to the event order discovered in the PDF.
        seen = []
        for c in classes:
            for r in c["riders"]:
                for res in r["results"]:
                    if res["event"] not in seen:
                        seen.append(res["event"])
        events = [{"abbr": a, "name": a, "date": ""} for a in seen]
        print("WARNING: no teamSeasons schedule found; events have no names/dates.")

    high_point = compute_high_point(classes)

    out = {
        "year": args.year,
        "series": args.series,
        "standingType": "class",
        "lastUpdated": args.updated or date.today().isoformat(),
        "events": events,
        "notes": notes,
        "overall": overall,
        "highPoint": high_point,
        # Derived (not an official scoring-team ranking) — hidden from the public
        # page until verified. Flip to false once the scoring team confirms.
        "highPointDraft": True,
        "classes": classes,
    }

    dest = repo_root / "src" / "content" / "riderStandings" / f"{args.year}-{series_slug}.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(out, indent=2) + "\n")

    nriders = sum(len(c["riders"]) for c in classes)
    print(f"Wrote {dest.relative_to(repo_root)}")
    print(f"  {len(classes)} classes, {nriders} rider entries, {len(overall)} overall, {len(high_point)} high-point divisions, {len(events)} events, {len(notes)} notes")


if __name__ == "__main__":
    main()
