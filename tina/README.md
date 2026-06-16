# TinaCMS Configuration

This directory contains the TinaCMS schema and admin branding for the ECEA website.

## Files

| File/Directory | Purpose |
|----------------|---------|
| `config.tsx` | TinaCMS entry point — imports all collections, sets media config |
| `collections/` | One file per collection (blog, events, clubs, etc.) |
| `helpers.ts` | Shared field helpers (richText, imageField, uploadDir, etc.) |
| `components.tsx` | Custom TinaCMS UI components |
| `CsvUploaderScreen.tsx` | Custom screen for uploading team results CSVs |
| `tina-lock.json` | Compiled schema snapshot — **must be committed** |
| `__generated__/` | Auto-generated types/client — gitignored, rebuilt locally |

## How TinaCMS Works Here

TinaCMS Cloud connects to GitHub via API and commits content changes directly to the repo. Netlify picks up the commit and rebuilds the site.

```
Editor saves in TinaCMS UI
        ↓
TinaCMS Cloud → GitHub commit (markdown/JSON + any uploaded images)
        ↓
Netlify detects push → runs `npm run build` (astro build only)
        ↓
Site rebuilds and deploys
```

## Media Uploads

### Where Files Go

`publicFolder` is set to `'src'` in `config.tsx`:

```ts
media: {
  tina: {
    mediaRoot: '',
    publicFolder: 'src',
  },
},
```

TinaCMS uploads images directly to `src/assets/...` in the GitHub repo. Each image field has an `uploadDir` that controls the subdirectory:

| Field | Upload Location |
|-------|----------------|
| Event flyers | `src/assets/events/flyers/` |
| Event hero images | `src/assets/events/images/` |
| Club logos | `src/assets/clubs/logos/` |
| Board photos | `src/assets/board/photos/` |
| Sponsor logos | `src/assets/sponsors/logos/` |
| Blog images | `src/assets/blog/` |

### Why `publicFolder: 'src'` (not `'public'`)

`public/assets` is a symlink to `../src/assets`. The GitHub Contents API **cannot write files through a symlink**, so uploads would silently fail when `publicFolder` was `'public'`. Setting it to `'src'` means TinaCMS writes directly to the real directory.

The `public/assets` symlink still exists for local dev — it lets TinaCMS admin preview images at `/assets/...` URLs while running locally.

### Image Paths in Content Files

TinaCMS Cloud saves image paths as absolute strings like `/assets/events/flyers/foo.jpg`. All image fields in `src/content/config.ts` use `z.string()` to accept these directly.

At render time, `getCmsImage()` in `src/utils/cmsImage.ts` resolves any path variant to Astro `ImageMetadata` via `import.meta.glob`, enabling full Astro image optimization. It handles three formats:

| Format | Example |
|--------|---------|
| Absolute (TinaCMS Cloud) | `/assets/events/flyers/foo.jpg` |
| Relative (legacy) | `../../../assets/events/flyers/foo.jpg` |
| Alias | `@assets/events/flyers/foo.jpg` |

### Attachment Files (PDFs)

The downloads field on events uses `publicFolder: 'src'`, so TinaCMS uploads PDFs to `src/attachments/events/`. However, PDFs need to be in `public/attachments/events/` to be served.

**After TinaCMS uploads an attachment**, move it:
```bash
git mv "src/attachments/events/your-file.pdf" "public/attachments/events/your-file.pdf"
git commit -m "Move attachment to public/"
git push
```

**`.rs` files (Enduro Roll Charts):** TinaCMS's media picker does not allow `.rs` uploads. Copy these files to `public/attachments/events/` via git and add the URL directly to the event's `downloads` array in the markdown file.

## tina-lock.json

This file is a compiled snapshot of the schema used by TinaCMS Cloud to validate builds. It **must be kept in sync** with `config.tsx` and committed. If you change the config (add a field, rename a collection, etc.), run `npm run dev` locally — the dev server regenerates `tina-lock.json` automatically. Commit and push the updated file.

If a Netlify build or TinaCloud sync fails with a schema mismatch error, the lock file is likely out of sync. Fix by running `npm run dev` locally, committing the regenerated `tina-lock.json`, and pushing.

## Admin Panel

The TinaCMS admin panel (`public/admin/`) is a static SPA that is **pre-built and committed** to the repo. Netlify does not run `tinacms build` at deploy time — it only runs `astro build`.

The admin panel only needs to be rebuilt when the tina schema changes. After any schema change:

```bash
npm run build:tina
git add public/admin/
git commit -m "Rebuild TinaCMS admin panel"
git push
```

## Adding a New Collection

1. Create `tina/collections/your-collection.ts` — define the collection using `defineConfig` helpers
2. Import and add it to the `collections` array in `tina/config.tsx`
3. Add the corresponding collection to `src/content/config.ts` with `z.string()` for image fields
4. Run `npm run dev` locally to regenerate `tina-lock.json`
5. Run `npm run build:tina` to rebuild the admin panel
6. Commit `tina/collections/your-collection.ts`, `tina/tina-lock.json`, `src/content/config.ts`, and `public/admin/`

## Visual Editing

Visual editing is intentionally **disabled**. The `router` config has been removed from all collections. Adding a `router` field to any collection re-enables visual editing mode — avoid this unless intentional.

## Local Development

```bash
npm run dev
# TinaCMS admin available at http://localhost:4321/admin
# Uses local mode — no cloud authentication required
# Changes are written to your local filesystem instead of GitHub
```
