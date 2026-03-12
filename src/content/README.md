# Content Collections

All site content lives here as Markdown (`.md`) or JSON files. Schemas are defined in `config.ts`.

## Collections

| Directory | Type | Description |
|-----------|------|-------------|
| `blog/` | Markdown | News, announcements, event recaps |
| `events/YEAR/` | Markdown | Race events by year (2023–present) |
| `clubs/` | Markdown | Member club profiles |
| `series/` | Markdown | Racing series info (Enduro, HS, FastKIDZ, DS) |
| `board/` | Markdown | Executive board + Board of Trustees |
| `staff/` | Markdown | Series directors, referees, contacts |
| `sponsors/` | Markdown | Title and regular sponsors |
| `pages/` | Markdown | Static page content (Get Started, FAQ) |
| `siteInfo/` | Markdown | Global site config |
| `teamResults/` | JSON | Enduro team competition standings |
| `members/` | JSON | Membership roster by series/year |

## Image Path Normalization

### The Problem

TinaCMS Cloud saves image paths as absolute paths like:
```
/assets/events/flyers/my-flyer.jpg
```

Astro's `image()` schema validator requires relative paths:
```
../../../assets/events/flyers/my-flyer.jpg
```

### The Fix

`config.ts` defines a `normalizeAssetPath(depth)` helper that preprocesses image values before `image()` validates them:

```ts
const normalizeAssetPath = (depth: number) => (val: unknown) => {
  if (typeof val === 'string') {
    if (val === '') return undefined;
    if (val.startsWith('/assets/')) {
      return '../'.repeat(depth) + 'assets/' + val.slice(8);
    }
  }
  return val;
};
```

It's applied as a `z.preprocess` wrapper on every `image()` field:

```ts
flyer: z.preprocess(normalizeAssetPath(3), image().nullable().optional()),
```

The `depth` parameter is the number of directory levels from the content file up to `src/`:

| Collection path | Depth | Prefix |
|----------------|-------|--------|
| `src/content/events/YEAR/` | 3 | `../../../` |
| `src/content/blog/` | 2 | `../../` |
| `src/content/clubs/` | 2 | `../../` |
| `src/content/board/` | 2 | `../../` |
| `src/content/sponsors/` | 2 | `../../` |

Existing relative paths (already in `../../..` format) pass through unchanged.

## Adding a New Image Field

If you add an image field to a collection schema, wrap it with `normalizeAssetPath`:

```ts
// Events collection (depth 3)
myImage: z.preprocess(normalizeAssetPath(3), image().nullable().optional()),

// Other collections (depth 2)
myImage: z.preprocess(normalizeAssetPath(2), image().nullable().optional()),
```

## Event Content

Events are organized by year under `events/YEAR/`. All years share the same schema (defined once in `config.ts` as `eventsCollection`).

### Filename Convention

TinaCMS auto-generates filenames following the pattern:
```
{YY}-{type}-{club}-{title-slug}.md
```
Examples: `26-en-sjer-curly-fern.md`, `26-hs-dvtr-high-steaks.md`

Type abbreviations: `en` = Enduro, `hs` = Hare Scramble, `fk` = FastKIDZ, `ds` = Dual Sport

### Flyer Images

Flyer images are stored in `src/assets/events/flyers/`. To add a flyer:
- **Via TinaCMS (recommended):** Use the image picker in the event editor — the file will be committed automatically
- **Manually:** Add the file to `src/assets/events/flyers/` and set `flyer: ../../../assets/events/flyers/your-file.jpg` in the frontmatter

## Schema Helpers

| Helper | Purpose |
|--------|---------|
| `localDate` | Parses dates as local time (prevents UTC timezone shift) |
| `optionalString` | Optional string that treats empty string as `undefined` |
| `optionalUrl` | Optional string validated as a URL |
| `normalizeAssetPath(depth)` | Normalizes TinaCMS absolute image paths to relative |
