# East Coast Enduro Association (ECEA) Website

The official website for the East Coast Enduro Association, built with Astro. This is a modern, fast, static site that serves as the central hub for event schedules, news, results, and information for the ECEA community.

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator with excellent performance
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)** - Type-safe Markdown content management
- **[Netlify](https://netlify.com/)** - Hosting and deployment

## Project Structure

```
src/
├── assets/           # Images processed by Astro (optimized at build time)
│   ├── blog/         # Blog post images
│   └── images/       # General images, logos, flyers
├── components/       # Reusable Astro components
│   ├── Cards/        # Card components (BlogCard, EventCard)
│   ├── Global/       # Site-wide components (Header, Footer, Navigation)
│   ├── Icons/        # Reusable SVG icon components
│   ├── Sections/     # Page section components (HeroSection, PageHeader)
│   └── UI/           # UI components (Button, Card, Seo, MiniCalendar, CalendarExport)
├── content/          # Markdown content files (Content Collections)
│   ├── blog/         # Blog posts and announcements
│   ├── board/        # Board member information
│   ├── clubs/        # Club profiles
│   ├── events/       # Event listings (organized by year)
│   ├── members/      # Protected member resources
│   ├── pages/        # Static page content
│   ├── series/       # Racing series (Enduro, Hare Scramble, etc.)
│   ├── siteInfo/     # Site configuration (sponsors, etc.)
│   ├── teamResults/  # Team competition results data
│   └── config.ts     # Content collection schemas
├── layouts/          # Page layouts (BaseLayout, PostLayout)
├── pages/            # Astro pages (routes)
├── scripts/          # Client-side TypeScript modules
│   └── miniCalendar.ts  # Calendar navigation and tooltip logic
└── utils/            # Utility functions and constants
    ├── calendarUtils.ts  # Calendar utilities and ICS generation
    ├── constants.ts      # Site-wide configuration
    └── dateUtils.ts      # Date formatting helpers

public/
├── attachments/      # PDFs and downloadable files
├── documents/        # Rulebook, welcome book
└── images/           # Static images (backgrounds)
```

## Content Overview

| Collection | Count | Description |
|------------|-------|-------------|
| `blog/` | ~60 | News, announcements, recaps |
| `events/` | ~150 | Race events by year (2023-2026) |
| `clubs/` | 19 | Member club profiles |
| `series/` | 4 | Enduro, Hare Scramble, FastKIDZ, Dual Sport |
| `board/` | 6 | Board member bios |
| `teamResults/` | 1 | Team competition standings (JSON-like) |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/east-coast-enduro-association/ecea-ui.git
cd ecea-ui

# Switch to the Astro branch
git worktree add migration-complete migration-complete
cd migration-complete

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:4321`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview production build locally |

## Adding Content

All content is stored as Markdown files in `src/content/`. Each content type has a defined schema in `src/content/config.ts`.

### Blog Posts

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
pubDate: 2025-01-15
author: "Author Name"
image: "../../assets/blog/your-image.jpg"
category: "announcement"
tags:
  - news
  - racing
description: "A brief description for previews and SEO"
draft: false
pinned: false
---

Your post content in Markdown...
```

**Categories:** `announcement`, `news`, `recap`, `article`

### Events

Create in `src/content/events/YYYY/` (organized by year):

```markdown
---
title: "Event Name Enduro"
date: 2025-03-15
time: "9:00 AM"
location: "Event Location, PA"
hostingClubs:
  - "ABC"
eventType: "Enduro"
image: "../../assets/images/flyers/event-flyer.jpg"
registrationLink: "https://registration-url.com"
resultsLink: ""
description: "Brief event description"
draft: false
---

Additional event details...
```

**Event Types:** `Enduro`, `Hare Scramble`, `FastKIDZ`, `Dual Sport`, `Fun Ride`, `Special`, `Meeting`

### Clubs

Club files in `src/content/clubs/`:

```markdown
---
name: "Full Club Name"
abbreviatedName: "FCN"
logo: "../../assets/images/logos/clubs/club-logo.jpg"
description: "Brief description"
website: "https://club-website.com"
facebookGroup: "https://facebook.com/groups/..."
president: "President Name"
email: "email@club.org"
location: "City, State"
order: 1
draft: false
---

## About Our Club

Club description and history...
```

## Configuration

### Site Constants (`src/utils/constants.ts`)

- **SITE_INFO** - Site name, tagline, contact email
- **NAV_ITEMS** - Main navigation structure
- **FOOTER_NAV** - Footer link groups
- **SERIES_LINKS** - Racing series quick links
- **DISPLAY_LIMITS** - Items per page for lists
- **EVENT_TYPES** - Available event categories
- **BLOG_CATEGORIES** - Blog category options

### Styling

- **Tailwind Config** - `tailwind.config.cjs` for colors, fonts
- **Primary Color** - Red/maroon theme (#dc2626)

## Features

### Events Calendar

The events page includes a visual mini calendar in the sidebar:

- **Visual Calendar** - Month view with navigation showing dots for days with events
- **Clickable Dots** - Click event dots to see a tooltip with event titles and links
- **Calendar Export** - Download all upcoming events as an ICS file for Apple Calendar, Outlook, or Google Calendar

**Components:**
- `src/components/UI/MiniCalendar.astro` - Calendar component with month navigation
- `src/components/UI/CalendarExport.astro` - ICS download button
- `src/scripts/miniCalendar.ts` - Client-side calendar logic (rendering, tooltips)
- `src/utils/calendarUtils.ts` - Shared utilities for date handling and ICS generation

## Deployment

The site deploys automatically via Netlify when changes are pushed.

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18+

## Known Issues & Future Work

### Media Storage (Priority)

Currently, ~180MB of images are stored in the git repository. This causes:
- Slow clones and pulls
- Repository bloat over time
- Difficult for non-technical contributors

**Recommended Solutions:**

1. **Cloudinary** - Move images to Cloudinary CDN
   - Free tier: 25GB storage, 25GB bandwidth/month
   - Automatic image optimization
   - Easy integration with any CMS

2. **S3 + CloudFront** - AWS storage
   - Cheapest at scale
   - More setup required

### CMS Integration (Recommended)

For easier content management, consider:

| CMS | Pros | Cons |
|-----|------|------|
| **[Sanity](https://sanity.io)** | Built-in media hosting, modern UI, real-time collaboration | Content not in git |
| **[TinaCMS](https://tina.io)** | Git-based, visual editing, live preview | Paid for teams |
| **[Decap CMS](https://decapcms.org)** | Free, simple, git-based | Dated UI |

**Recommended:** Sanity + Cloudinary for media would reduce repo to ~2MB while providing a polished editing experience.

## Testing Checklist

- [ ] Navigation - All links work, mobile menu functions
- [ ] Events - Upcoming/past display, filters work, pagination
- [ ] Events Calendar - Mini calendar shows dots, tooltips work, month navigation
- [ ] Calendar Export - ICS download works, opens in calendar apps
- [ ] Blog - Posts display, category filter, pagination
- [ ] Clubs - Cards display with logos, detail pages load
- [ ] Results - Team results table scrolls properly on mobile
- [ ] Responsive - Mobile, tablet, and desktop layouts
- [ ] Build - `npm run build` completes without errors

## Key Files

| File | Purpose |
|------|---------|
| `src/utils/constants.ts` | Site config, navigation, limits |
| `src/utils/calendarUtils.ts` | Calendar utilities, ICS generation |
| `src/content/config.ts` | Content collection schemas |
| `tailwind.config.cjs` | Tailwind CSS customization |
| `astro.config.mjs` | Astro configuration |
| `netlify.toml` | Netlify build settings |

## Contributing

1. Create a feature branch from `migration-complete`
2. Make changes and test locally
3. Run `npm run build` to verify no errors
4. Submit a pull request

## Support

- [GitHub Issues](https://github.com/east-coast-enduro-association/ecea-ui/issues)
- Contact the ECEA board

---

Built with Astro for the East Coast Enduro Association
