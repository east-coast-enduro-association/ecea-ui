# East Coast Enduro Association (ECEA) Website

The official website for the East Coast Enduro Association, built with Astro and TinaCMS. A modern, fast, static site serving as the central hub for event schedules, news, results, and information for the ECEA community.

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator with excellent performance
- **[TinaCMS](https://tina.io/)** - Git-based headless CMS for content management
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Netlify](https://netlify.com/)** - Hosting and deployment

## Project Structure

```
src/
├── assets/               # Images processed by Astro (optimized at build)
│   ├── blog/             # Blog post images
│   ├── board/photos/     # Board member photos
│   ├── clubs/logos/      # Club logos
│   ├── ecea/logos/       # ECEA organization logos
│   ├── events/flyers/    # Event flyers
│   └── sponsors/logos/   # Sponsor logos
├── components/           # Reusable Astro components
│   ├── Cards/            # Card components (BlogCard, EventCard)
│   ├── Global/           # Site-wide (Header, Footer, Navigation)
│   ├── Icons/            # Reusable SVG icons
│   ├── Sections/         # Page sections (HeroSection, PageHeader, SponsorCarousel)
│   └── UI/               # UI components (Button, MiniCalendar, CalendarExport)
├── content/              # CMS-managed content (Markdown/JSON)
│   ├── blog/             # Blog posts and announcements
│   ├── board/            # Board members (executive + trustees)
│   ├── clubs/            # Club profiles
│   ├── events/           # Events by year (2023–present)
│   ├── faqPage/          # FAQ page content
│   ├── getStartedPage/   # Get Started page content
│   ├── members/          # Membership data (JSON)
│   ├── series/           # Racing series info
│   ├── siteInfo/         # Global site config
│   ├── sponsors/         # Sponsor logos and info
│   ├── staff/            # Staff contacts by category
│   ├── teamEventResults/ # Per-event team competition results (JSON)
│   ├── teamResults/      # Team competition standings (JSON)
│   ├── teamSeasons/      # Team season schedules (JSON)
│   └── config.ts         # Content collection schemas
├── layouts/              # Page layouts
├── pages/                # Astro pages (routes)
├── scripts/              # Client-side TypeScript
└── utils/
    ├── cmsImage.ts       # Resolves CMS image paths to Astro ImageMetadata
    └── constants.ts      # Site config, navigation, series links

tina/
├── collections/          # One file per TinaCMS collection
│   ├── blog.ts, board.ts, clubs.ts, events.ts
│   ├── faqPage.ts, getStartedPage.ts, series.ts
│   ├── siteInfo.ts, sponsors.ts, staff.ts
│   ├── teamEventResults.ts, teamResults.ts, teamSeasons.ts
├── config.tsx            # TinaCMS entry point — imports collections, sets media config
├── helpers.ts            # Shared field helpers (richText, imageField, etc.)
├── components.tsx        # Custom TinaCMS UI components
├── CsvUploaderScreen.tsx # Custom screen for uploading team results CSVs
└── tina-lock.json        # Schema lock file — must be committed

public/
├── admin/                # TinaCMS admin SPA (pre-built, committed to git)
├── assets -> ../src/assets  # Symlink — keeps TinaCMS preview URLs working locally
├── attachments/          # PDFs and downloads
├── documents/            # Rulebook, welcome book, forms
└── images/               # Static images (backgrounds)
```

## Content Collections

| Collection | Description |
|------------|-------------|
| `blog/` | News, announcements, recaps |
| `events/` | Race events by year |
| `clubs/` | Member club profiles |
| `series/` | Enduro, Hare Scramble, FastKIDZ, Dual Sport |
| `board/` | Executive board + Board of Trustees |
| `staff/` | Series directors, referees, contacts |
| `sponsors/` | Title + regular sponsors |
| `teamEventResults/` | Per-event team competition results |
| `teamResults/` | Team competition standings |
| `teamSeasons/` | Team season schedules |
| `faqPage/` | FAQ page content |
| `getStartedPage/` | Get Started page content |
| `siteInfo/` | Global site config |

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
git clone https://github.com/east-coast-enduro-association/ecea-ui.git
cd ecea-ui
npm install
npm run dev
```

Open your browser to `http://localhost:4321`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with TinaCMS local mode |
| `npm run build` | Build Astro site only (used by Netlify) |
| `npm run build:tina` | Rebuild TinaCMS admin panel + Astro site (run locally after tina config changes) |
| `npm run preview` | Preview production build locally |
| `npm run import-results` | Import team results CSV manually |

## TinaCMS Admin

Access the CMS admin at `/admin` to manage content visually.

### Local Development
```bash
npm run dev
# Navigate to http://localhost:4321/admin
# Uses local mode — no cloud authentication required
```

### Production
The admin is available at `https://ecea.org/admin` (requires GitHub authentication).

## How Deploys Work

```
Editor saves in TinaCMS UI
        ↓
TinaCMS Cloud → GitHub commit (markdown/JSON + any uploaded images)
        ↓
Netlify detects push → runs `npm run build` (astro build only)
        ↓
Site rebuilds and deploys (~1 min)
```

Netlify runs `astro build` only — `tinacms build` is **not** run at deploy time. The TinaCMS admin panel (`public/admin/`) is pre-built and committed to the repo. Only rebuild it locally when the tina schema changes:

```bash
npm run build:tina
git add public/admin/
git commit -m "Rebuild TinaCMS admin panel"
git push
```

## Image Handling

All CMS-managed images are stored in `src/assets/` and committed to the repo (TinaCMS uploads directly via the GitHub API). Astro optimizes them at build time.

Image fields in `src/content/config.ts` use `z.string()`. The `getCmsImage()` utility in `src/utils/cmsImage.ts` resolves any string path to Astro `ImageMetadata` using `import.meta.glob`. Components use `<Image>` when the metadata resolves and fall back to `<img>` for unresolved paths.

Supported path formats:

| Format | Example |
|--------|---------|
| Absolute (TinaCMS Cloud) | `/assets/events/flyers/foo.jpg` |
| Relative (legacy) | `../../../assets/events/flyers/foo.jpg` |
| Alias | `@assets/events/flyers/foo.jpg` |

## Configuration

### Site Constants (`src/utils/constants.ts`)

- `SITE_INFO` — Site name, tagline, contact
- `NAV_ITEMS` — Main navigation
- `FOOTER_NAV` — Footer link groups
- `SERIES_LINKS` — Homepage series quick links
- `FACEBOOK_GROUPS` — Community links
- `STAFF_CATEGORIES` — Staff contact groupings
- `MOTO_TALLY` — Results/registration URL config

### Moto-Tally Integration

Events with a `motoTallyId` automatically get links to registration, start grid, and results. Configure base URLs in `MOTO_TALLY` in `constants.ts`.

## Key Files

| File | Purpose |
|------|---------|
| `src/content/config.ts` | Content collection schemas |
| `src/utils/constants.ts` | Site config, navigation |
| `src/utils/cmsImage.ts` | CMS image path → Astro ImageMetadata |
| `tina/config.tsx` | TinaCMS entry point |
| `tina/collections/` | Per-collection TinaCMS schemas |
| `tina/helpers.ts` | Shared TinaCMS field helpers |
| `tina/tina-lock.json` | Schema lock file (must be committed) |
| `tailwind.config.cjs` | Tailwind customization |
| `astro.config.mjs` | Astro configuration |
| `netlify.toml` | Netlify build + header/redirect config |

## Contributing

1. Create a feature branch
2. Make changes and test locally (`npm run dev`)
3. Run `npm run build` to verify the site builds cleanly
4. If you changed anything in `tina/`, also run `npm run build:tina` and commit `public/admin/`
5. Submit a pull request to `master`

## Support

- [GitHub Issues](https://github.com/east-coast-enduro-association/ecea-ui/issues)
- Contact the ECEA board

---

Built with Astro + TinaCMS for the East Coast Enduro Association
