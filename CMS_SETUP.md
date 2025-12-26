# Sveltia CMS Setup Guide

This guide walks you through setting up Sveltia CMS with GitHub authentication for the ECEA website.

## Architecture

```
┌─────────────────┐                    ┌─────────────────┐
│   Editor's      │───────────────────▶│   GitHub        │
│   Browser       │  (GitHub API)      │   Repository    │
│   (Sveltia CMS) │◀───────────────────│   (Content)     │
└─────────────────┘                    └─────────────────┘
        │
        ▼
┌─────────────────┐
│   GitHub OAuth  │
│   or PAT        │
│   (Auth)        │
└─────────────────┘
```

- **Sveltia CMS**: Visual content editor (runs in browser, loaded via CDN)
- **GitHub**: Stores content (markdown files), handles auth via PAT or OAuth
- **Netlify**: Hosts the static site (auto-deploys on GitHub commits)

## What's Included

```
src/pages/
└── admin.html       # CMS entry point (loads Sveltia from CDN)
public/admin/
└── config.yml       # CMS configuration (collections, fields)
```

## Setup Steps

### 1. Deploy to Netlify

1. Push this branch to GitHub
2. In Netlify, deploy from the `cms-setup` branch
3. Wait for the initial deploy to complete

### 2. Set Up Authentication (Choose One)

**Option A: GitHub Personal Access Token (Simplest)**
1. Each editor creates a GitHub PAT at https://github.com/settings/tokens
2. Token needs `repo` scope for private repos, or `public_repo` for public
3. Editors paste the token when signing in to the CMS

**Option B: GitHub OAuth via Cloudflare Workers (Better UX)**
1. Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) to Cloudflare Workers
2. Create a GitHub OAuth App
3. Add the OAuth base_url to `config.yml`

### 3. Add Editors to GitHub

1. Go to your GitHub repo > Settings > Collaborators
2. Add editors with **Write** access
3. They can now authenticate and edit content

### 4. Access the CMS

1. Go to `https://your-site.netlify.app/admin/`
2. Sign in with GitHub (PAT or OAuth)
3. Start editing!

## Usage

### Accessing the CMS

- URL: `https://your-site.netlify.app/admin/`
- Login: GitHub PAT or OAuth

### Content Collections

| Collection | Description |
|------------|-------------|
| **Blog Posts** | News, announcements, recaps |
| **Events (2025)** | 2025 race events |
| **Events (2026)** | 2026 race events |
| **Clubs** | Club profiles |
| **Racing Series** | Enduro, Hare Scramble, FastKIDZ, Dual Sport |
| **Board Members** | Board member bios |
| **Pages** | Static content pages |

### Workflow

1. **Create/Edit** content in the CMS
2. **Save** - Creates a commit to GitHub
3. **Netlify auto-deploys** - Site rebuilds with new content
4. Changes appear on the live site in ~1-2 minutes

### Managing Editors

**To add an editor:**
1. Go to GitHub repo > Settings > Collaborators
2. Click "Add people"
3. Enter their GitHub username or email
4. Grant **Write** access

**To remove an editor:**
1. Go to GitHub repo > Settings > Collaborators
2. Find the user and remove them

## Limitations

### GitHub Collaborator Limits
- **Unlimited collaborators** on public repos (free)
- **Private repos**: Free tier allows 3 collaborators, GitHub Team allows more
- All editors need GitHub accounts

### Media Handling
- Images are stored in `src/assets/images/uploads/`
- Large images will increase repository size
- Consider Cloudinary for external image hosting in the future

## Local Development

Sveltia CMS uses the **File System Access API** for local development (Chrome/Edge only):

```bash
# Start the Astro dev server
npm run dev
```

Then visit **http://localhost:4321/admin/** in Chrome or Edge.

When prompted, choose **"Work with local repository"** and select your project folder. Sveltia will read/write directly to your local files.

### Authentication Options

1. **Local development**: File System Access API (no auth needed)
2. **GitHub PAT**: Generate a Personal Access Token and paste it when signing in
3. **OAuth**: Set up sveltia-cms-auth on Cloudflare Workers (see [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth))

## Troubleshooting

### Login not working
- Clear browser cache and try again
- Ensure the GitHub PAT has correct scopes (`repo` or `public_repo`)
- Verify the user has write access to the repository

### Changes not appearing on site
- Check GitHub for the commit
- Check Netlify deploy logs
- Wait 1-2 minutes for deploy to complete

### Media upload failing
- Check file size (Netlify has limits)
- Ensure the media folder path is correct in config.yml

## Cost

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Netlify Hosting | 100GB bandwidth/mo | Plenty for ECEA |
| GitHub | Unlimited collaborators (public repos) | Free |
| Sveltia CMS | Open source | Free |

**Expected monthly cost: $0** (within free tier limits)

## Future Considerations

1. **GitHub OAuth**: Better UX than PAT - deploy sveltia-cms-auth to Cloudflare Workers
2. **Cloudinary**: External image hosting to reduce repo size
3. **GitHub Teams**: If repo becomes private and needs >3 collaborators

## Files Reference

| File | Purpose |
|------|---------|
| `src/pages/admin.html` | CMS entry point |
| `public/admin/config.yml` | CMS collections and fields |
