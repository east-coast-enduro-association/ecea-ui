# TinaCMS Setup Guide

This guide walks you through using TinaCMS for the ECEA website.

## Architecture

```
┌─────────────────┐                    ┌─────────────────┐
│   Editor's      │───────────────────▶│   GitHub        │
│   Browser       │  (Git-backed)      │   Repository    │
│   (TinaCMS)     │◀───────────────────│   (Content)     │
└─────────────────┘                    └─────────────────┘
        │
        ▼
┌─────────────────┐
│   Tina Cloud    │
│   (Auth & API)  │
└─────────────────┘
```

- **TinaCMS**: Visual content editor with real-time preview
- **Tina Cloud**: Handles authentication and Git operations
- **GitHub**: Stores content (markdown/JSON files)
- **Netlify**: Hosts the static site (auto-deploys on GitHub commits)

## What's Included

```
tina/
├── config.ts           # CMS schema and configuration
├── CustomLogo.tsx      # Custom branding for admin UI
├── __generated__/      # Auto-generated types and queries
└── tina-lock.json      # Lock file for schema
public/admin/
└── index.html          # Admin entry point (auto-generated)
```

## Local Development

```bash
# Start the dev server with TinaCMS
npm run dev
```

Then visit **http://localhost:4321/admin/** to access the CMS.

In local mode, TinaCMS reads/writes directly to your local files - no authentication needed.

## Production Setup

### 1. Create a Tina Cloud Account

1. Go to [tina.io](https://tina.io) and sign up
2. Create a new project and connect your GitHub repository
3. Get your Client ID and Token from the project settings

### 2. Configure Environment Variables

Set these in Netlify (or your hosting provider):

```
TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
TINA_BRANCH=main
```

### 3. Build for Production

```bash
npm run build:tina
```

This runs `tinacms build && astro build` to generate the admin UI and site.

> **Important — this is NOT what Netlify runs.** The deploy command in
> `netlify.toml` is `npm run build` (`astro build` only). Netlify does **not**
> rebuild the `/admin` bundle; it serves the version committed under
> `public/admin/`. So the admin UI only changes in production when you run
> `npm run build:tina` locally and **commit the regenerated `public/admin/`**.
>
> TinaCMS 3 makes this a footgun: `tinacms build` writes a
> `public/admin/.gitignore` that ignores the new `index.html` and `assets/` it
> just built, while removing the old committed assets. If you commit that state,
> the tracked `public/admin/index.html` references an asset that isn't in the
> repo and `/admin` 404s. When regenerating the admin, force-add the full new
> bundle past that `.gitignore`; otherwise revert `public/admin` before you
> commit.

## Content Collections

| Collection | Description |
|------------|-------------|
| **Blog Posts** | News, announcements, recaps |
| **Events (2023-2026)** | Race events by year |
| **Clubs** | Club profiles |
| **Racing Series** | Enduro, Hare Scramble, FastKIDZ, Dual Sport |
| **Board Members** | Executive board and trustees |
| **Staff Contacts** | Series directors, referees, etc. |
| **Sponsors** | Sponsor logos and links |
| **Pages** | Static content pages |
| **Team Results** | JSON data for standings |

## Workflow

1. **Access** the CMS at `/admin/`
2. **Create/Edit** content using the visual editor
3. **Save** - Creates a commit to GitHub via Tina Cloud
4. **Netlify auto-deploys** - Site rebuilds with new content
5. Changes appear on the live site in ~1-2 minutes

## Managing Editors

Editors need to be invited through Tina Cloud:

1. Go to your project in [app.tina.io](https://app.tina.io)
2. Navigate to Project Settings > Collaborators
3. Invite editors by email

## Media Handling

- Media is stored in `public/` directory
- TinaCMS provides a built-in media manager
- Images are committed to the repository

## Troubleshooting

### Admin page shows "Failed loading TinaCMS assets"
- Ensure `npm run dev` is running (local development)
- Check that environment variables are set (production)
- Verify the Tina Cloud project is properly configured

### Admin page 404s or loads a blank page after a deploy
- Someone likely ran `tinacms build` and committed a partial `public/admin/`.
  Check that `public/admin/index.html`'s referenced `assets/index-*.js` actually
  exists in the repo. See "Build for Production" above — regenerate and force-add
  the full bundle, or revert `public/admin` to the last known-good commit.

### Changes not appearing on site
- Check GitHub for the commit
- Check Netlify deploy logs
- Wait 1-2 minutes for deploy to complete
- Note: production deploys from `master` do not post a GitHub commit status;
  confirm via the live site or the Netlify dashboard, not the GitHub checks UI

### Authentication issues
- Verify TINA_CLIENT_ID and TINA_TOKEN are correct
- Check Tina Cloud project settings
- Ensure the user is added as a collaborator

## Cost

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Netlify Hosting | 100GB bandwidth/mo | Plenty for ECEA |
| Tina Cloud | 2 users, unlimited content | Free tier |
| GitHub | Unlimited (public repos) | Free |

## Files Reference

| File | Purpose |
|------|---------|
| `tina/config.ts` | CMS schema and collections |
| `tina/CustomLogo.tsx` | Custom admin branding |
| `public/admin/index.html` | Admin entry point |
| `.env` | Environment variables (local) |
