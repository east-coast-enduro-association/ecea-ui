# East Coast Enduro Association (ECEA) Website

The official website for the East Coast Enduro Association, built with Astro. This is a modern, fast, static site that serves as the central hub for event schedules, news, results, and information for the ECEA community.

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator with excellent performance and developer experience
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for styling
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better developer experience
- **[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)** - Type-safe content management using Markdown files
- **[Decap CMS](https://decapcms.org/)** (optional) - Git-based headless CMS for content editing

## Project Structure

```
src/
├── assets/           # Images processed by Astro (optimized at build time)
│   ├── blog/         # Blog post images
│   └── images/       # General images and logos
├── components/       # Reusable Astro components
│   ├── Cards/        # Card components (BlogCard, EventCard)
│   ├── Global/       # Site-wide components (Header, Footer, Navigation)
│   ├── Icons/        # Reusable SVG icon components
│   ├── Sections/     # Page section components (HeroSection, PageHeader)
│   └── UI/           # UI components (Button, Card, Seo)
├── content/          # Markdown content files (Content Collections)
│   ├── blog/         # Blog posts
│   ├── clubs/        # Club information
│   ├── events/       # Event listings
│   ├── series/       # Racing series descriptions
│   └── config.ts     # Content collection schemas
├── layouts/          # Page layouts (BaseLayout, PostLayout)
├── pages/            # Astro pages (routes)
└── utils/            # Utility functions and constants
    └── constants.ts  # Site-wide configuration and constants

public/
├── documents/        # PDFs (rulebook, welcome book)
├── images/           # Static images (backgrounds, etc.)
└── uploads/          # User-uploaded content
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository and navigate to the project:
   ```bash
   git clone https://github.com/east-coast-enduro-association/ecea-ui.git
   cd ecea-ui
   git worktree add migration-complete migration-complete
   cd migration-complete
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:4321`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## Adding and Editing Content

All content is stored as Markdown files in the `src/content/` directory. Each content type has a defined schema in `src/content/config.ts`.

### Creating a New Blog Post

1. Create a new `.md` file in `src/content/blog/` (filename becomes the URL slug)
2. Add the required frontmatter:

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
summary: "A brief description for previews and SEO"
draft: false
---

Your post content goes here in Markdown format...
```

**Frontmatter Fields:**
- `title` (required) - Post title
- `pubDate` (required) - Publication date (YYYY-MM-DD)
- `author` (required) - Author name
- `image` (optional) - Path to featured image
- `category` (required) - One of: `announcement`, `news`, `recap`, `article`
- `tags` (optional) - Array of tags for filtering
- `summary` (required) - Short description
- `draft` (optional) - Set to `true` to hide in production

### Creating a New Event

1. Create a new `.md` file in `src/content/events/`
2. Add the required frontmatter:

```markdown
---
title: "Event Name Enduro"
date: 2025-03-15
time: "9:00 AM"
location: "Event Location, PA"
club: "ABC"
eventType: "Enduro"
flyerImage: "../../assets/images/flyers/event-flyer.jpg"
registrationLink: "https://registration-url.com"
resultsLink: ""
summary: "Brief event description"
draft: false
---

Additional event details and information...
```

**Event Types:** `Enduro`, `Hare Scramble`, `FastKIDZ`, `Dual Sport`, `Fun Ride`, `ECEA`, `Special`, `Meeting`

### Editing Club Information

Club files are in `src/content/clubs/`. Each club has:

```markdown
---
name: "Full Club Name"
abbreviatedName: "FCN"
logo: "../../assets/images/logos/clubs/club-logo.jpg"
summary: "Brief description"
draft: false
website: "https://club-website.com"
president: "President Name"
contact: "email@club.org"
order: 1
location: "City, State"
---

## About Our Club

Club description and history...
```

### Editing Racing Series

Series files are in `src/content/series/`:

```markdown
---
name: "Series Name"
description: "Brief series description"
draft: false
---

Detailed series information...
```

## Configuration

### Site-Wide Constants

Edit `src/utils/constants.ts` to change:

- **SITE_INFO** - Site name, tagline, email
- **NAV_ITEMS** - Main navigation links
- **FOOTER_NAV** - Footer navigation groups
- **SERIES_LINKS** - Racing series quick links with icons
- **DISPLAY_LIMITS** - Number of items to show on pages
- **EVENT_TYPES** - Available event type options
- **BLOG_CATEGORIES** - Available blog categories

### Styling

- **Tailwind Config** - `tailwind.config.mjs` for colors, fonts, spacing
- **Global Styles** - `src/assets/styles/global.css`
- **Primary Color** - Defined in Tailwind config (currently red/maroon theme)

### Adding Images

**For blog/content images (optimized by Astro):**
1. Add images to `src/assets/blog/` or `src/assets/images/`
2. Reference with relative path: `../../assets/blog/image.jpg`

**For static images (not processed):**
1. Add to `public/images/` or `public/uploads/`
2. Reference with absolute path: `/images/image.jpg`

## Testing

### Local Testing

```bash
# Run development server
npm run dev

# Build and preview production version
npm run build && npm run preview
```

### What to Test

1. **Navigation** - All links work, mobile menu functions
2. **Events Page** - Upcoming/past events display correctly, pagination works
3. **Blog** - Posts display, category filter works, pagination works
4. **Clubs** - Club cards display with location, detail pages work
5. **Contact Reveal** - Click-to-reveal on club pages protects email addresses
6. **Responsive** - Test on mobile, tablet, and desktop sizes
7. **SEO** - Check meta tags, sitemap generation

## Deployment

This site deploys automatically via Netlify when changes are pushed to the main branch.

### Manual Deployment

1. Build the site:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the complete static site

### Deployment Platforms

**Netlify (Recommended):**
- Connect your GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`

**Vercel:**
- Import from GitHub
- Auto-detects Astro settings

**Cloudflare Pages:**
- Build command: `npm run build`
- Output directory: `dist`

### Environment Variables

No environment variables are required for basic operation. For CMS integration, configure according to your CMS provider's documentation.

## Content Management (CMS)

The site supports integration with Git-based headless CMS solutions:

- **[Decap CMS](https://decapcms.org/)** - Add config to `public/admin/config.yml`
- **[TinaCMS](https://tina.io/)** - Install and configure per TinaCMS docs
- **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** - Drop-in Decap CMS alternative

## Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Test locally with `npm run dev` and `npm run build`
4. Submit a pull request

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/utils/constants.ts` | Site configuration, navigation, limits |
| `src/content/config.ts` | Content collection schemas |
| `tailwind.config.mjs` | Tailwind CSS customization |
| `astro.config.mjs` | Astro configuration |

## Support

For questions or issues:
- Open an issue on [GitHub](https://github.com/east-coast-enduro-association/ecea-ui/issues)
- Contact the ECEA board

---

Built with Astro for the East Coast Enduro Association
