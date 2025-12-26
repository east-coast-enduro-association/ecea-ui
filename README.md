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
│   ├── events/           # Events by year (2023-2026)
│   ├── members/          # Membership data (JSON)
│   ├── pages/            # Static page content
│   ├── series/           # Racing series info
│   ├── sponsors/         # Sponsor logos and info
│   ├── staff/            # Staff contacts by category
│   ├── teamResults/      # Team competition standings (JSON)
│   └── config.ts         # Content collection schemas
├── layouts/              # Page layouts
├── pages/                # Astro pages (routes)
├── scripts/              # Client-side TypeScript
└── utils/                # Utilities and constants

tina/
├── config.ts             # TinaCMS schema configuration
└── CustomLogo.tsx        # Custom admin branding

public/
├── admin/                # TinaCMS admin (built)
├── attachments/          # PDFs and downloads
├── documents/            # Rulebook, welcome book, forms
└── images/               # Static images (backgrounds)
```

## Content Collections

| Collection | Description | CMS-Managed |
|------------|-------------|-------------|
| `blog/` | News, announcements, recaps | ✅ |
| `events/` | Race events by year | ✅ |
| `clubs/` | 19 member club profiles | ✅ |
| `series/` | Enduro, Hare Scramble, FastKIDZ, Dual Sport | ✅ |
| `board/` | Executive board + Board of Trustees | ✅ |
| `staff/` | Series directors, referees, contacts | ✅ |
| `sponsors/` | Title + regular sponsors | ✅ |
| `teamResults/` | Enduro team competition standings | ✅ |
| `pages/` | Static page content (Get Started, FAQ) | ✅ |

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/east-coast-enduro-association/ecea-ui.git
cd ecea-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:4321`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview production build locally |

## TinaCMS Admin

Access the CMS admin at `/admin` to manage content visually.

### Local Development
```bash
npm run dev
# Navigate to http://localhost:4321/admin
```

### Production
The admin is available at `https://ecea.org/admin` (requires GitHub authentication).

### What You Can Edit

- **Blog Posts** - Create/edit news, announcements, recaps
- **Events** - Add events with flyers, registration links, Moto-Tally IDs
- **Clubs** - Update club info, logos, contacts
- **Board Members** - Executive board and Board of Trustees
- **Staff Contacts** - Series directors, referees, coordinators
- **Sponsors** - Add/remove sponsors, set title sponsor
- **Team Results** - Update enduro team competition standings
- **Series Pages** - Edit series descriptions and documents

## Adding Content

### Via TinaCMS (Recommended)
1. Go to `/admin`
2. Select the collection (Blog, Events, etc.)
3. Click "Create New" or edit existing
4. Save changes (commits to git automatically)

### Via Markdown Files

Create files directly in `src/content/`. Each collection has a schema in `src/content/config.ts`.

**Blog Post Example** (`src/content/blog/2025-01-15-post-title.md`):
```markdown
---
title: "Your Post Title"
pubDate: 2025-01-15
description: "Brief description for previews"
author: "ECEA"
category: "announcement"
tags: ["news"]
draft: false
pinned: false
---

Your content in Markdown...
```

**Event Example** (`src/content/events/2025/event-name.md`):
```markdown
---
title: "Event Name Enduro"
date: 2025-03-15
location: "Location, PA"
hostingClubs: ["CLUB"]
eventType: "Enduro"
motoTallyId: 5
draft: false
---
```

## Configuration

### Site Constants (`src/utils/constants.ts`)

- `SITE_INFO` - Site name, tagline, contact
- `NAV_ITEMS` - Main navigation
- `FOOTER_NAV` - Footer link groups
- `SERIES_LINKS` - Homepage series quick links
- `FACEBOOK_GROUPS` - Community links
- `STAFF_CATEGORIES` - Staff contact groupings
- `MOTO_TALLY` - Results/registration URL config

### Moto-Tally Integration

Events with a `motoTallyId` automatically get links to:
- Registration
- Start Grid
- Results

Configure base URLs in `MOTO_TALLY` constant.

## Features

### Events Calendar
- Visual mini calendar with event dots
- Click dots to see event tooltips
- iCal/Google Calendar export

### Results Integration
- Links to Moto-Tally for official results
- Enduro team competition standings
- Historical results by year

### Get Started Flow
- Highlighted in navigation
- Step-by-step guide for new racers
- Links to series info and registration

## Deployment

Deploys automatically via Netlify on push to `master`.

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18+

## Testing Checklist

- [ ] Navigation - All links work, mobile menu functions
- [ ] Events - Filters, pagination, calendar export
- [ ] Blog - Category filter, pagination
- [ ] Board/Contact - Staff contacts display correctly
- [ ] Sponsors - Carousel displays all sponsors
- [ ] TinaCMS - Admin loads, can edit content
- [ ] Responsive - Mobile, tablet, desktop layouts
- [ ] Build - `npm run build` completes without errors

## Key Files

| File | Purpose |
|------|---------|
| `src/content/config.ts` | Content collection schemas |
| `src/utils/constants.ts` | Site config, navigation |
| `tina/config.ts` | TinaCMS schema config |
| `tailwind.config.cjs` | Tailwind customization |
| `astro.config.mjs` | Astro configuration |

## Contributing

1. Create a feature branch
2. Make changes and test locally
3. Run `npm run build` to verify
4. Submit a pull request

## Support

- [GitHub Issues](https://github.com/east-coast-enduro-association/ecea-ui/issues)
- Contact the ECEA board

---

Built with Astro + TinaCMS for the East Coast Enduro Association
