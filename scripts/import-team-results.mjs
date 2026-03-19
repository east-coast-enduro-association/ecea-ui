#!/usr/bin/env node
/**
 * Import per-event team results from a CSV file.
 *
 * CSV format — one row per team, in finishing order (1st place first).
 * Host club teams should be OMITTED (they earn 0 championship points by rule).
 * DNF/DQ teams should be OMITTED (no championship points).
 *
 * Columns:
 *   team     - Team name (e.g., "RIDGE RIDERS -A-")
 *   club     - Club abbreviation (e.g., "RRMC")
 *   epoints  - Emergency/tiebreaker points from scoring software (optional)
 *   riders   - Semicolon-separated rider names (optional)
 *              e.g., "JOHN SMITH;JANE DOE;BOB JONES;ALICE LEE;TOM CLARK"
 *
 * Championship points (25/22/20...) are auto-computed from row order.
 *
 * Example CSV:
 *   team,club,epoints,riders
 *   RIDGE RIDERS -A-,RRMC,7650,MAVERICK REINER;DYLAN RECCHIA;NICHOLAS LOBOSCO;ROBERT CIVILETTI JR;WILLIAM SIGLER
 *   FASTBOYZ I,SPER,10322,ZACH MILLER;LOGAN SMITH;NATHAN JOSEPH;GRAHAM SMITH;TIMOTHY SPRENKLE
 *   TEAM BOB,CJCR,10733,SEAN KOELLER;CHAD LOCH;GREG PRESTON;JUSTIN MCKENZIE;JASON RICE
 *
 * Usage:
 *   node scripts/import-team-results.mjs <csv-file> <event-abbr> [year] [series]
 *   npm run import-results -- <csv-file> <event-abbr> [year] [series]
 *
 * Examples:
 *   npm run import-results -- results-sjer.csv SJER
 *   npm run import-results -- results-mmc.csv MMC 2026 Enduro
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dir, '..');

// Championship points by finishing position (1st=25, 2nd=22, ... 20th=1, 21st+=0)
const POINTS_SCALE = [
  25, 22, 20, 18, 16, 15, 14, 13, 12, 11,
  10,  9,  8,  7,  6,  5,  4,  3,  2,  1,
];

function pointsForPlace(place) {
  return POINTS_SCALE[place - 1] ?? 0;
}

// ─── Parse args ──────────────────────────────────────────────────────────────

const [, , csvFile, eventAbbr, year = '2026', series = 'Enduro'] = process.argv;

if (!csvFile || !eventAbbr) {
  console.error('Usage: npm run import-results -- <csv-file> <event-abbr> [year] [series]');
  console.error('');
  console.error('CSV columns: team, club, epoints (optional), riders (optional, semicolon-separated)');
  console.error('Row order = finishing position. Championship points are auto-computed.');
  process.exit(1);
}

const csvPath = resolve(csvFile);
if (!existsSync(csvPath)) {
  console.error(`Error: CSV file not found: ${csvPath}`);
  process.exit(1);
}

// ─── Parse CSV ───────────────────────────────────────────────────────────────

const raw = readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

// Parse header to find column indices (case-insensitive)
const headerLine = lines[0].toLowerCase();
const isHeaderRow = headerLine.includes('team') || headerLine.includes('club');
const headerCols = isHeaderRow
  ? lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  : ['team', 'club', 'epoints', 'riders'];
const dataLines = isHeaderRow ? lines.slice(1) : lines;

const colIdx = {
  team:    headerCols.indexOf('team'),
  club:    headerCols.indexOf('club'),
  epoints: headerCols.indexOf('epoints'),
  riders:  headerCols.indexOf('riders'),
};

if (colIdx.team === -1 || colIdx.club === -1) {
  // Fall back to positional: team=0, club=1, epoints=2, riders=3
  colIdx.team    = 0;
  colIdx.club    = 1;
  colIdx.epoints = 2;
  colIdx.riders  = 3;
}

// Parse a CSV line respecting quoted fields
function parseCsvLine(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      cols.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cols.push(current.trim());
  return cols;
}

const results = [];
let place = 1;

for (const line of dataLines) {
  const cols = parseCsvLine(line);

  const team    = cols[colIdx.team]?.trim();
  const club    = cols[colIdx.club]?.trim();
  const epRaw   = colIdx.epoints >= 0 ? cols[colIdx.epoints]?.trim() : undefined;
  const ridersRaw = colIdx.riders >= 0 ? cols[colIdx.riders]?.trim() : undefined;

  if (!team || !club) {
    console.warn(`  Skipping incomplete row: ${line}`);
    continue;
  }

  const points  = pointsForPlace(place);
  const epoints = epRaw ? parseInt(epRaw.replace(/,/g, ''), 10) : undefined;
  const riders  = ridersRaw
    ? ridersRaw.split(';').map(r => r.trim()).filter(Boolean)
    : undefined;

  const entry = { team, club, points };
  if (epoints !== undefined && !isNaN(epoints)) entry.epoints = epoints;
  if (riders?.length) entry.riders = riders;

  results.push(entry);

  const ridersStr = riders?.length ? ` [${riders.length} riders]` : '';
  const epStr     = epoints !== undefined ? ` epoints:${epoints}` : '';
  console.log(`  ${place}. ${club} — ${team}: ${points} pts${epStr}${ridersStr}`);
  place++;
}

if (results.length === 0) {
  console.error('Error: No results parsed from CSV.');
  process.exit(1);
}

// ─── Build output JSON ───────────────────────────────────────────────────────

const yearNum = parseInt(year, 10);
const seriesAbbr = series.toLowerCase() === 'enduro' ? 'en' : 'hs';
const yy = String(yearNum).slice(2);
const filename = `${yy}-${seriesAbbr}-${eventAbbr.toLowerCase()}.json`;
const outputPath = resolve(repoRoot, 'src/content/teamEventResults', filename);

const output = {
  year: yearNum,
  series,
  eventAbbr: eventAbbr.toUpperCase(),
  results,
};

writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');

console.log('');
console.log(`✓ Written: src/content/teamEventResults/${filename}`);
console.log(`  ${results.length} teams · event: ${eventAbbr.toUpperCase()} · year: ${yearNum}`);
console.log('');
console.log('Next:');
console.log(`  git add src/content/teamEventResults/${filename}`);
console.log(`  git commit -m "Add team results: ${eventAbbr.toUpperCase()} ${yearNum}"`);
console.log('  git push');
