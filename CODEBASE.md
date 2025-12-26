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
tags: ["enduro", "2025"]
pinned: false     # Set true to feature on homepage
draft: false      # Set true to hide in production
---

Your content here...
```

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
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

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
