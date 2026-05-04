#!/usr/bin/env node
/**
 * Import team results from the scoring software's CSV export.
 *
 * Accepts the CSV exactly as exported from the scoring software — no
 * reformatting needed. The script detects team header rows vs rider rows,
 * extracts the club abbreviation from the team name, excludes DNF/DQ teams,
 * excludes the hosting club's teams, and auto-computes championship points
 * from finishing rank.
 *
 * Usage:
 *   node scripts/import-team-results.mjs <csv-file> <host-club-abbr> [year] [series]
 *   npm run import-results -- <csv-file> <host-club-abbr> [year] [series]
 *
 * Examples:
 *   npm run import-results -- ~/Downloads/results.csv SJER 2026 Enduro
 *   npm run import-results -- ~/Downloads/results.csv MMC 2026 "Hare Scramble"
 *
 * Arguments:
 *   csv-file        Path to the scoring software CSV export
 *   host-club-abbr  Abbreviation of the club hosting this event (e.g. SJER).
 *                   Their teams are automatically excluded (0 championship points by rule).
 *   year            Season year (default: current year)
 *   series          "Enduro" or "Hare Scramble" (default: Enduro)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dir, '..');

// Championship points by finishing position (1st=25, 2nd=22, …, 20th=1, 21st+=0)
const POINTS_SCALE = [
  25, 22, 20, 18, 16, 15, 14, 13, 12, 11,
  10,  9,  8,  7,  6,  5,  4,  3,  2,  1,
];

function pointsForPlace(place) {
  return POINTS_SCALE[place - 1] ?? 0;
}

// Extract club abbreviation from team name: "OCCR - SAND BLASTERS" → "OCCR"
function extractClub(teamName) {
  const m = teamName.match(/^([A-Z]+)\s*-/);
  return m ? m[1] : teamName.split(/\s+/)[0];
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const [, , csvFile, eventAbbr, year = String(new Date().getFullYear()), series = 'Enduro'] = process.argv;

if (!csvFile || !eventAbbr) {
  console.error('Usage: node scripts/import-team-results.mjs <csv-file> <host-club-abbr> [year] [series]');
  process.exit(1);
}

const csvPath = resolve(csvFile);
if (!existsSync(csvPath)) {
  console.error(`Error: file not found: ${csvPath}`);
  process.exit(1);
}

// ─── Parse CSV ────────────────────────────────────────────────────────────────

const raw = readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, ''); // strip BOM
const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

function parseCsvLine(line) {
  const cols = [];
  let cur = '';
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
    else { cur += ch; }
  }
  cols.push(cur.trim());
  return cols;
}

// Locate the column header row (starts with "Row," and contains "Rider Name")
let headerIdx = -1;
for (let i = 0; i < Math.min(lines.length, 8); i++) {
  if (/^row,/i.test(lines[i]) && /rider name/i.test(lines[i])) {
    headerIdx = i;
    break;
  }
}
if (headerIdx === -1) {
  console.error('Error: could not find column header row. Expected a row starting with "Row," containing "Rider Name".');
  process.exit(1);
}

// Column indices (from header: Row, Rider Name, Bike, Class, [blank], Place, #Chks, Points, EPoints)
const COL_ROW     = 0;
const COL_NAME    = 1;
const COL_EPOINTS = 8;

// ─── Extract teams and riders ─────────────────────────────────────────────────

const teams = [];
let current = null;

for (const line of lines.slice(headerIdx + 1)) {
  const cols = parseCsvLine(line);
  const rowId = cols[COL_ROW] ?? '';
  const name  = cols[COL_NAME]?.trim() ?? '';

  const isTeamRow = /^\d+$/.test(rowId) || rowId === 'DNF' || rowId === 'DQ';

  if (isTeamRow) {
    if (current) teams.push(current);
    const epRaw = cols[COL_EPOINTS]?.replace(/,/g, '').trim();
    current = {
      rank:   /^\d+$/.test(rowId) ? parseInt(rowId, 10) : rowId,
      team:   name,
      club:   extractClub(name),
      epoints: epRaw && /^\d+$/.test(epRaw) ? parseInt(epRaw, 10) : undefined,
      riders: [],
      dnf:    rowId === 'DNF' || rowId === 'DQ',
    };
  } else if (current && name) {
    current.riders.push(name);
  }
}
if (current) teams.push(current);

// ─── Filter ───────────────────────────────────────────────────────────────────

const hostClub   = eventAbbr.toUpperCase();
const dnfTeams   = teams.filter(t => t.dnf);
const hostTeams  = teams.filter(t => !t.dnf && t.club === hostClub);
const finishers  = teams.filter(t => !t.dnf && t.club !== hostClub)
                        .sort((a, b) => a.rank - b.rank);

if (hostTeams.length) {
  console.log(`\n  Host club (${hostClub}) — excluded from championship points:`);
  hostTeams.forEach(t => console.log(`    ${t.rank}. ${t.team}`));
}
if (dnfTeams.length) {
  console.log(`\n  DNF/DQ — excluded:`);
  dnfTeams.forEach(t => console.log(`    ${t.rank}. ${t.team}`));
}

// ─── Build results ────────────────────────────────────────────────────────────

console.log('\n  Championship standings:');
const results = finishers.map((t, i) => {
  const place  = i + 1;
  const points = pointsForPlace(place);
  const entry  = { team: t.team, club: t.club, points };
  if (t.epoints !== undefined) entry.epoints = t.epoints;
  if (t.riders.length)         entry.riders  = t.riders;

  const epStr = t.epoints !== undefined ? `  epoints:${t.epoints}` : '';
  const rStr  = t.riders.length ? `  [${t.riders.length} riders]` : '';
  console.log(`  ${place}. ${t.club} — ${t.team}: ${points} pts${epStr}${rStr}`);

  return entry;
});

if (results.length === 0) {
  console.error('\nError: no results after filtering. Check that the host club abbreviation is correct.');
  process.exit(1);
}

// ─── Write JSON ───────────────────────────────────────────────────────────────

const yearNum   = parseInt(year, 10);
const seriesAbbr = series.toLowerCase().startsWith('hare') ? 'hs' : 'en';
const yy        = String(yearNum).slice(2);
const filename  = `${yy}-${seriesAbbr}-${eventAbbr.toLowerCase()}.json`;
const outDir    = resolve(repoRoot, 'src/content/teamEventResults');
const outPath   = resolve(outDir, filename);

writeFileSync(outPath, JSON.stringify({ year: yearNum, series, eventAbbr: hostClub, results }, null, 2) + '\n');

console.log(`\n✓ Written: src/content/teamEventResults/${filename}`);
console.log(`  ${results.length} teams · event: ${hostClub} · ${yearNum} ${series}`);
console.log('\nNext steps:');
console.log(`  git add src/content/teamEventResults/${filename}`);
console.log(`  git commit -m "results: ${hostClub} ${yearNum} round ${finishers[0]?.rank ?? ''}"`);
console.log('  git push');
