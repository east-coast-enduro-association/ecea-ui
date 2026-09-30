# ECEA Website Codebase Guide

This document explains the structure and patterns used in the ECEA Astro website to help you make edits and maintain the site.

## Quick Reference: Where to Edit Things

| What you want to change | Where to edit |
|------------------------|---------------|
| Site name, tagline, email | `src/utils/constants.ts` → `SITE_INFO` |
| Navigation menu items | `src/utils/constants.ts` → `NAV_ITEMS` |
| Footer links | `src/utils/constants.ts` → `FOOTER_NAV` |
| Social media links | `src/utils/constants.ts` → `SOCIAL_LINKS` |
| Blog post | `src/content/blog/` (create .md file) |
| Event | `src/content/events/{year}/` (create .md file) |
| Club information | `src/content/clubs/` (edit .md file) |
| Team results | `src/content/teamResults/2025.json` |
| Member list | `src/content/members/2025.json` |
| Rider resources/documents | `src/pages/resources/index.astro` |
| Page header background | `src/utils/constants.ts` → `DEFAULT_IMAGES` |
| Category colors | `src/utils/constants.ts` → `CATEGORY_COLORS` |

---

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── Cards/          # Card components (BlogCard, EventCard)
│   ├── Global/         # Site-wide components (Header, Footer, Navigation)
│   ├── Icons/          # SVG icon components
│   ├── Sections/       # Page sections (HeroSection, PageHeader, etc.)
│   └── UI/             # Basic UI elements (Button, Card, Seo)
│
├── content/            # Content collections (Markdown/JSON data)
│   ├── blog/           # Blog posts
│   ├── clubs/          # Club information
│   ├── events/         # Events by year
│   ├── members/        # Membership roster (JSON)
│   ├── series/         # Racing series info
│   ├── board/          # Board members
│   ├── pages/          # Static page content
│   └── teamResults/    # Team competition data
│
├── layouts/            # Page layouts
│   ├── BaseLayout.astro    # Main site layout
│   └── PostLayout.astro    # Blog/article layout
│
├── pages/              # Route pages
│   ├── blog/           # Blog pages
│   ├── clubs/          # Club pages
│   ├── events/         # Event pages
│   ├── results/        # Results pages
│   └── series/         # Series pages
│
└── utils/              # Utility functions and constants
    ├── constants.ts    # Site configuration
    ├── collections.ts  # Content collection helpers
    ├── dateUtils.js    # Date formatting
    └── motoTally.ts    # Moto-Tally URL generation
```

---

## Content Collections

### Adding a New Blog Post

1. Create a file in `src/content/blog/` with format: `YYYY-MM-DD-slug-name.md`

```markdown
---
title: "Your Post Title"
pubDate: 2025-01-15
description: "Brief description for previews"
author: "ECEA"
category: "news"  # Options: announcement, news, recap, article
image:            # Optional — but if you include `image`, `alt` is REQUIRED
  src: /assets/blog/your-image.jpg
  alt: "Describe the image"
tags: ["enduro", "2025"]
pinned: false     # Set true to feature on homepage
draft: false      # Set true to hide in production
---

Your content here...
```

> **Build trap:** the blog schema (`src/content/config.ts`) makes `image.alt`
> required whenever `image` is present. A post with `image.src` but no `image.alt`
> passes the TinaCMS editor with no warning, then **fails the production build**
> (`InvalidContentEntryDataError`), taking down all deploys until fixed. If you
> add an image, always add alt text.

### Adding a New Event

1. Create a file in `src/content/events/{year}/` with format: `YY-{type}-{club}.md`
   - Example: `25-en-tcsmc.md` (2025 Enduro hosted by TCSMC)

```markdown
---
title: "Event Name"
summary: "Brief description"
date: 2025-03-15
location: "City, State"
hostingClubs: ["TCSMC"]
eventType: "Enduro"  # Options: Enduro, Hare Scramble, FastKIDZ, Dual Sport, etc.
format: "Time Keeping"
closedCourse: false
gasAway: false
draft: false
---

Event details and description...
```

### Updating Team Results

Edit `src/content/teamResults/2025.json`:

```json
{
  "year": 2025,
  "series": "Enduro",
  "lastUpdated": "2025-09-22",
  "events": [
    { "abbr": "TCSMC", "name": "Greenbrier", "date": "2025-03-09", "completed": true }
  ],
  "standings": [
    {
      "place": 1,
      "club": "OCCR",
      "total": 283,
      "results": { "TCSMC": 20, "SJER": 25, ... }
    }
  ]
}
```

### Updating the Member List

Edit `src/content/members/2025.json`:

```json
{
  "year": 2025,
  "lastUpdated": "2025-01-15",
  "members": [
    { "name": "John Smith", "club": "OCCR" },
    { "name": "Jane Doe", "club": "TCSMC" }
  ]
}
```

**Notes:**
- The `club` field must match a club's `abbreviatedName` exactly (e.g., "OCCR", "TCSMC")
- Members appear on the main `/resources/members` page and on their club's page
- The file is portable - you can export/import the entire member list as JSON
- Update `lastUpdated` when making changes

---

## Constants Reference

All site-wide configuration is in `src/utils/constants.ts`:

### SITE_INFO
```typescript
export const SITE_INFO = {
  name: "East Coast Enduro Association",
  shortName: "ECEA",
  tagline: "AMA sanctioned off-road motorcycle racing since 1971",
  email: "info@ecea.org",
  foundedYear: 1971,
};
```

### NAV_ITEMS
```typescript
export const NAV_ITEMS = [
  { text: "Home", href: "/" },
  { text: "Events", href: "/events" },
  // Add/remove/reorder navigation items here
];
```

### CATEGORY_COLORS
```typescript
export const CATEGORY_COLORS: Record<string, string> = {
  announcement: "bg-accent-600",
  news: "bg-primary-600/80",
  recap: "bg-secondary-600/80",
  article: "bg-gray-600/80",
};
```

### DEFAULT_IMAGES
```typescript
export const DEFAULT_IMAGES = {
  background: "/images/feature-bg.jpg",
  ogImage: "/images/og/ecea-og.png",
  favicon: "/favicon.png",
};
```

---

## Utility Functions

### Collection Helpers (`src/utils/collections.ts`)

```typescript
import {
  getDraftFilter,
  sortByDateAsc,
  sortByDateDesc,
  getUpcomingEvents,
  getPastEvents,
  getClubLogoMap
} from '../utils/collections';

// Filter draft content
const posts = await getCollection("blog", getDraftFilter());

// Sort events
const sorted = sortByDateDesc(events);

// Get upcoming/past events
const upcoming = getUpcomingEvents(allEvents);
const past = getPastEvents(allEvents);

// Get club logos
const logoMap = await getClubLogoMap();
```

### Date Utilities (`src/utils/dateUtils.js`)

```javascript
import { formatDate, isFutureDate, isPastDate } from '../utils/dateUtils';

formatDate(new Date());           // "January 15, 2025"
formatDate(new Date(), 'short');  // "Jan 15, 2025"
isFutureDate(new Date('2026-01-01')); // true
```

---

## Component Usage

### Icons

```astro
---
import { CalendarIcon, MapPinIcon, ExternalLinkIcon } from '../components/Icons';
---

<CalendarIcon size="md" class="text-primary-600" />
<MapPinIcon size="sm" class="mr-2" />
```

Available icons: `CalendarIcon`, `ClockIcon`, `MapPinIcon`, `UserIcon`, `ChevronRightIcon`, `ExternalLinkIcon`, `DownloadIcon`, `EyeIcon`, `FlagIcon`

### Button

```astro
---
import Button from '../components/UI/Button.astro';
---

<Button href="/events" variant="primary">View Events</Button>
<Button href="/contact" variant="outline">Contact Us</Button>
```

### Cards

```astro
---
import BlogCard from '../components/Cards/BlogCard.astro';
import EventCard from '../components/Cards/EventCard.astro';
---

<BlogCard
  title="Post Title"
  slug="post-slug"
  pubDate={new Date()}
  category="news"
  featured={true}
/>
```

---

## Common Tasks

### Changing the Default Header Background

1. Add your image to `public/images/`
2. Update `src/utils/constants.ts`:
   ```typescript
   export const DEFAULT_IMAGES = {
     background: "/images/your-new-image.jpg",
     // ...
   };
   ```

### Adding a New Navigation Item

Edit `src/utils/constants.ts`:
```typescript
export const NAV_ITEMS = [
  // ... existing items
  { text: "New Page", href: "/new-page" },
];
```

### Creating a New Page

1. Create `src/pages/your-page.astro`
2. Use the BaseLayout:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHeader from '../components/Sections/PageHeader.astro';
---

<BaseLayout title="Page Title - ECEA" description="Page description">
  <PageHeader title="Page Title" />
  <section class="py-12">
    <div class="container">
      <!-- Your content -->
    </div>
  </section>
</BaseLayout>
```

### Adding a Pinned/Featured Post

Set `pinned: true` in the blog post frontmatter:
```markdown
---
title: "Important Announcement"
pinned: true
---
```

---

## Development Commands

```bash
npm run dev       # Start dev server (astro + TinaCMS)
npm run build     # Build the site (astro build only) — this is what Netlify runs
npm run build:tina # tinacms build + astro build — rebuilds the /admin bundle too
npm run preview   # Preview production build
```

---

## Build & Deploy Notes

- **Hosting**: Netlify auto-deploys from `master` on push. The build command in
  `netlify.toml` is `npm run build` (**`astro build` only** — it does NOT run
  `tinacms build`), on `NODE_VERSION = "22"`.
- **The `/admin` (TinaCMS) bundle is served from committed files** under
  `public/admin/`, because the Netlify build never rebuilds it. If you run
  `npm run build:tina` (or `tinacms build`) locally, **be careful committing the
  result**: TinaCMS 3 writes a `public/admin/.gitignore` that ignores its own
  freshly-built `index.html` and `assets/`, while deleting the previously
  committed assets. Committing that half-state leaves the tracked
  `public/admin/index.html` pointing at an asset absent from the repo →
  **`/admin` 404s in production**. Either commit the full new bundle (force-add
  past the generated `.gitignore`) or revert `public/admin` before committing.
- **Verifying a production deploy**: preview deploys post GitHub commit statuses,
  but production deploys from `master` do **not**. Confirm prod by hitting the
  live site (e.g. `curl -I https://www.ecea.org/`) or the Netlify dashboard — the
  GitHub status API will just read `pending` with zero statuses.
- **Dependencies are pinned to the Astro 5 line on purpose.** `@astrojs/tailwind`
  peers `astro ^3||^4||^5`, and Astro 6 removes the legacy content-collections
  API (this site uses `type: 'content'` throughout, plus `entry.render()` and
  `entry.slug`). Moving to Astro 6/7 is a real migration (Content Layer API +
  Tailwind 4 via `@tailwindcss/vite`), not a version bump.
- **Related-posts ordering is non-deterministic.** `src/pages/blog/[slug].astro`
  sorts related posts only by shared-tag count, then slices 3; ties fall back to
  collection order, which isn't stable across cold builds. Cosmetic, but it means
  two builds of identical source can differ — don't rely on output diffing to
  spot regressions. A secondary sort (pubDate desc, then slug) would fix it.

---

## File Naming Conventions

- **Blog posts**: `YYYY-MM-DD-slug-name.md`
- **Events**: `YY-{type}-{club}.md` (e.g., `25-en-tcsmc.md`)
- **Components**: PascalCase (e.g., `BlogCard.astro`)
- **Utilities**: camelCase (e.g., `dateUtils.js`)

---

## Need Help?

- Astro Documentation: https://docs.astro.build
- Tailwind CSS: https://tailwindcss.com/docs
- Content Collections: https://docs.astro.build/en/guides/content-collections/
