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
| `faqPage/` | Markdown | FAQ page content |
| `getStartedPage/` | Markdown | Get Started page content |
| `siteInfo/` | Markdown | Global site config |
| `teamEventResults/` | JSON | Per-event team competition results |
| `teamResults/` | JSON | Team competition standings |
| `teamSeasons/` | JSON | Team season schedules |
| `members/` | JSON | Membership roster by series/year |

## Image Fields

Image fields in `config.ts` use `z.string()` rather than Astro's `image()` validator. This is intentional — TinaCMS Cloud saves image paths as absolute strings (e.g. `/assets/events/flyers/foo.jpg`), which are incompatible with the `image()` validator's static import requirement.

At render time, `getCmsImage()` in `src/utils/cmsImage.ts` resolves any path to Astro `ImageMetadata` using an eager `import.meta.glob` over all of `src/assets/`. This gives full Astro image optimization (format conversion, responsive sizes, lazy loading) for all CMS-managed images. If a path doesn't resolve (e.g. an external URL), components fall back to a plain `<img>`.

Supported path formats (all normalize correctly):

| Format | Example |
|--------|---------|
| Absolute (TinaCMS Cloud) | `/assets/events/flyers/foo.jpg` |
| Relative (legacy) | `../../../assets/events/flyers/foo.jpg` |
| Alias | `@assets/events/flyers/foo.jpg` |

## Adding a New Image Field

In `config.ts`, use `z.string()`:

```ts
// Optional image
myImage: z.string().nullable().optional(),

// Required image
myImage: z.string(),
```

In the component, resolve and use `<Image>`:

```astro
import { Image } from "astro:assets";
import { getCmsImage } from "../../utils/cmsImage";

const imageMeta = getCmsImage(myImage);
---
{imageMeta ? (
  <Image src={imageMeta} alt="..." />
) : myImage ? (
  <img src={myImage} alt="..." loading="lazy" />
) : null}
```

## Schema Helpers

Defined at the top of `config.ts`:

| Helper | Purpose |
|--------|---------|
| `localDate` | Parses dates as local time (prevents UTC timezone shift) |
| `optionalString` | Optional string that treats empty string as `undefined` |
| `optionalUrl` | Optional string validated as a URL |

## Event Content

Events are organized by year under `events/YEAR/`. All years share the same schema (`eventsCollection` in `config.ts`).

### Filename Convention

TinaCMS auto-generates filenames following the pattern:
```
{YY}-{type}-{club}-{title-slug}.md
```
Examples: `26-en-sjer-curly-fern.md`, `26-hs-dvtr-high-steaks.md`

Type abbreviations: `en` = Enduro, `hs` = Hare Scramble, `fk` = FastKIDZ, `ds` = Dual Sport

### Flyer Images

Flyer images are stored in `src/assets/events/flyers/`. To add a flyer:
- **Via TinaCMS (recommended):** Use the image picker in the event editor — the file commits automatically
- **Manually:** Add the file to `src/assets/events/flyers/` and set `flyer: /assets/events/flyers/your-file.jpg` in the frontmatter
