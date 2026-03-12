# TinaCMS Configuration

This directory contains the TinaCMS schema and admin branding for the ECEA website.

## Files

| File | Purpose |
|------|---------|
| `config.ts` | All collection schemas, field definitions, and media config |
| `CustomLogo.tsx` | ECEA logo shown in the TinaCMS admin header |
| `tina-lock.json` | Compiled schema snapshot — **must be committed** |
| `__generated__/` | Auto-generated types/client — gitignored, rebuilt at build time |

## How TinaCMS Works Here

TinaCMS Cloud connects to GitHub via API and commits content changes directly to the repo. Netlify picks up the commit and rebuilds the site.

```
Editor saves in TinaCMS UI
        ↓
TinaCMS Cloud → GitHub commit (markdown/JSON + any uploaded images)
        ↓
Netlify detects push → runs `npm run build:tina`
        ↓
Site rebuilds and deploys
```

## Media Uploads

### Where Files Go

`publicFolder` is set to `'src'` in `config.ts`:

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

### Why `ui.parse` Is Not Used

TinaCMS's `ui.parse` function (which appears on image fields) is a **client-side-only** transform. TinaCMS Cloud does not apply it when saving content via the API — the raw path from the media picker is written directly to the markdown file.

Path normalization (converting TinaCMS's `/assets/...` paths to Astro-compatible relative paths) is handled instead by `normalizeAssetPath` in `src/content/config.ts`.

## tina-lock.json

This file is a compiled snapshot of the schema used by TinaCMS Cloud to validate builds. It **must be kept in sync** with `config.ts`. If you change `config.ts` (add a field, change media config, etc.), the lock file is normally updated automatically when `tinacms build` runs — but if you make changes manually to `config.ts`, you may need to run `tinacms build` locally to regenerate it.

If a Netlify build fails with:
> "The local Tina schema doesn't match the remote Tina schema"

it usually means `tina-lock.json` is out of sync with `config.ts`. Regenerate by running `npm run build:tina` locally and committing the updated lock file.

### Attachment Files (PDFs)

The downloads field on events uploads files to `src/attachments/events/` (because `publicFolder: 'src'`). However, PDFs need to be in `public/attachments/events/` to be served by the site.

**Current workaround:** After TinaCMS uploads an attachment, manually move it:
```bash
git mv "src/attachments/events/your-file.pdf" "public/attachments/events/your-file.pdf"
git commit -m "Move attachment to public/"
git push
```

The URL saved in the event's `downloads[].url` field (e.g., `/attachments/events/your-file.pdf`) will work once the file is in `public/`.

## Adding a New Collection

1. Define the collection in `config.ts` using `defineConfig`
2. For image fields, use `uploadDir` and wrap with the path type — **do not rely on `ui.parse`**; path normalization happens in `src/content/config.ts`
3. Add the collection to `src/content/config.ts` with the appropriate schema
4. Run `npm run build:tina` locally to regenerate `tina-lock.json`
5. Commit both `config.ts` and `tina-lock.json`

## Local Development

```bash
npm run dev
# TinaCMS admin available at http://localhost:4321/admin
# Uses local mode — no cloud authentication required
```

In local mode, changes are written directly to your local filesystem instead of GitHub.
