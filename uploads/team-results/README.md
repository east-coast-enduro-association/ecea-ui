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

Upload the **Team Enduro Results** report directly from your scoring software — no reformatting needed.

The script automatically:
- Detects team rows vs rider rows
- Extracts the club abbreviation from the team name
- Excludes the host club's teams (0 championship points by rule)
- Excludes DNF and DQ teams
- Computes championship points (25/22/20…) from finishing rank

**The CSV file must be named using this convention:**

```
YY-{en|hs}-{clubabbr}.csv
```

Examples: `26-en-sjer.csv`, `26-hs-mmc.csv`

The filename is how the script knows the year, series, and host club.

---

## Something went wrong?

Check the **Actions** tab on GitHub. It shows whether the import succeeded and any error messages.

Common issues:
- **CSV not showing up** — make sure you uploaded the file in the CSV field before saving
- **Wrong filename format** — must be `YY-{en|hs}-{clubabbr}.csv` (e.g. `26-en-sjer.csv`)
- **No results after filtering** — double-check the club abbreviation in the filename matches what's in the team names in the CSV

Processed files are archived to `src/uploads/team-results/processed/` automatically.
