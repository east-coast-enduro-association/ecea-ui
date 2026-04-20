# Uploading Team Results

Results are entered through the CMS. The site updates automatically within a few minutes.

---

## In the CMS

1. Go to **Upload Team Results** in the left sidebar
2. Click **Create new**
3. Fill in:
   - **Hosting Club** — pick the club that ran the event
   - **Series** — Enduro or Hare Scramble
   - **Year** — e.g., 2026
4. Click the **Results CSV** field → upload your CSV file
5. Click **Save**

That's it. GitHub processes the file automatically and the results page updates in 2–3 minutes.

---

## CSV format

Export from your scoring software (or build manually). Columns can be in any order.

| Column | Required | Notes |
|---|---|---|
| `team` | Yes | Team name (e.g., `RIDGE RIDERS -A-`) |
| `club` | Yes | Club abbreviation (e.g., `RRMC`) |
| `epoints` | No | Tiebreaker score from scoring software |
| `riders` | No | Names separated by semicolons |

**List rows in finishing order — 1st place first.** Championship points (25/22/20...) are assigned automatically by row position.

**Leave out:**
- Host club teams (earn 0 points by rule)
- DNF or DQ teams (no points)

**Example:**
```csv
team,club,epoints,riders
KILLER BEES,CDR,1712,JOSEPH FORD;JOSHUA PITTMAN;GREGORY NORDBERG
SANDBLASTERS,OCCR,1791,RYAN CANAVAN;CHRISTOPHER SMITH;TYLER KENNEDY
I,DER,1538,DOUG ALLEN II;THOMAS RAIO;ANGELO RISPOLI
```

---

## Something went wrong?

Check the **Actions** tab on GitHub. It shows whether the import succeeded and any error messages.

Common issues:
- **CSV not showing up** — make sure you uploaded the file in the CSV field before saving
- **Wrong club abbreviation** — must exactly match the season setup (e.g., `RRMC` not `RR`)
- **Missing columns** — CSV must have at least `team` and `club`

Processed files are archived to `uploads/team-results/processed/` automatically.
