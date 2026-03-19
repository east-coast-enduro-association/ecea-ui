# Team Event Results

Per-event team competition results for the ECEA Enduro Team Championship.

One JSON file per completed event. The site reads all files in this directory and computes the standings automatically.

## How the Championship Works

- Teams compete within each event and are ranked by their finish
- Each club can enter multiple teams; only the **best-placing team per club** counts toward that club's championship score
- Points by finish position: 1st=25, 2nd=22, 3rd=20, 4th=18, 5th=16, 6th=15, 7th=14 … 20th=1
- Emergency points (EPoints) are the tiebreaker — lower is better
- Host club teams compete but earn **0 championship points** for their home event
- DNF and DQ teams earn 0 points and are not included in the files
- All events count — no throw-aways

## Adding Results After Each Event

### Option 1 — CSV Import (recommended)

Create a CSV with one row per finishing team, **in order from 1st to last**. Omit DNF, DQ, and host club teams.

**CSV columns:**

| Column | Required | Description |
|--------|----------|-------------|
| `team` | Yes | Team name (e.g., `RIDGE RIDERS -A-`) |
| `club` | Yes | Club abbreviation (e.g., `RRMC`) |
| `epoints` | No | Emergency/tiebreaker points from scoring software |
| `riders` | No | Rider names, **semicolon-separated** |

**Example (`results-mmc.csv`):**
```csv
team,club,epoints,riders
CHECK PLEASE,MMC,2126,JARRETT HUNT;RAYMOND POWELL;COLIN QUIRIN;RONALD DECARO;TIMOTHY MAURO
FASTBOYZ I,SPER,2076,GRAHAM SMITH;LOGAN SMITH;TIMOTHY SPRENKLE;NATHAN JOSEPH;ROBERT HAGAN
KILLER BEES,CDR,1712,JOSEPH FORD;JOSHUA PITTMAN;GREGORY NORDBERG;JOE SUMPTER;BRADLEY CAMP
```

**Run the import:**
```bash
npm run import-results -- results-mmc.csv MMC
```

This generates `src/content/teamEventResults/26-en-mmc.json`. Then commit and push:
```bash
git add src/content/teamEventResults/26-en-mmc.json
git commit -m "Add team results: MMC 2026"
git push
```

Netlify picks up the push and rebuilds the site automatically.

### Option 2 — TinaCMS

Go to **Team Event Results** in the CMS admin → **Create New**. Fill in:
- Year, Series, Event abbreviation (must match the season schedule — see `teamSeasons/`)
- Add one row per finishing team with team name, club, championship points, epoints, and riders

### Option 3 — Edit the JSON directly

Copy an existing file, update the values, and commit. See the file format below.

---

## File Format

**Filename:** `YY-series-EVENTABBR.json` (e.g., `26-en-sjer.json`, `26-en-tcsmc.json`)

```json
{
  "year": 2026,
  "series": "Enduro",
  "eventAbbr": "SJER",
  "results": [
    {
      "team": "KILLER BEES",
      "club": "CDR",
      "points": 25,
      "epoints": 1712,
      "riders": ["JOSEPH FORD", "JOSHUA PITTMAN", "GREGORY NORDBERG", "JOE SUMPTER", "BRADLEY CAMP"]
    },
    {
      "team": "SANDBLASTERS",
      "club": "OCCR",
      "points": 22,
      "epoints": 1791,
      "riders": ["RYAN CANAVAN", "CHRISTOPHER SMITH", "JONATHAN SPAFFORD", "TYLER KENNEDY", "DANIEL BOYLE"]
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `eventAbbr` | Must match an event `abbr` in `src/content/teamSeasons/2026-enduro.json` |
| `points` | Championship points (25/22/20…) based on finish position |
| `epoints` | Emergency/tiebreaker points — lower is better |
| `riders` | Who rode for that team **at this event** (can differ each round) |

---

## Season Schedule

The event schedule (host clubs, dates) lives in `src/content/teamSeasons/`. That file also determines which club gets the **H** (host) marker in the standings for each round. You only need to edit it if the schedule changes mid-season.

## What Gets Displayed

The team results page (`/results/team`) shows:

1. **Championship standings** — clubs ranked by total points, all rounds as columns. Future rounds appear as `—`.
2. **Per-event cards** — all finishing teams with their points and epoints. Click any team to expand and see the rider roster for that event.
3. **2025 archive** — prior season standings at the bottom.
