# Self-Hosted TinaCMS — Setup & Runbook

**Goal:** unlimited free editors by running our own Tina backend instead of
Tina Cloud (whose free tier caps at 2 editors). The backend is **siloed** — it
only talks to the GitHub repo and authenticates editors; it is independent of
where the website is deployed.

> **Status: SPIKE / not yet live.** The core config is scaffolded, but nothing
> works until the accounts/secrets below are created, and the Netlify function
> shim (`netlify/functions/tina.mts`) still needs first-deploy validation.
> Local dev (`TINA_PUBLIC_IS_LOCAL=true`) works without any of the accounts.

## Architecture

```
Editor browser (/admin)                GitHub repo (content, committed)
        │  login + edits                        ▲
        ▼                                        │ commits (1 token)
  Tina backend  ──────────────────────────────┘
  (serverless fn)
        │ indexes content into
        ▼
  Upstash Redis  ◀── GraphQL queries from the admin
```

- **Content** stays in Git (markdown/JSON) — same as today.
- **Upstash Redis** is just a fast *index* of that content for the GraphQL API.
- **Auth** is username/password stored in a `TinaUserCollection` (our DB), so
  editors use any email (e.g. kSuite) — no Google, no GitHub accounts.

## 1. Install dependencies

```bash
npm install @tinacms/datalayer tinacms-authjs tinacms-gitprovider-github upstash-redis-level
# Backend function shim (only if hosting the backend on Netlify Functions):
npm install express serverless-http
npm install -D @types/express
```

## 2. Accounts & secrets to create  ← only you can do these

| # | Create | You get | Goes in env var |
|---|---|---|---|
| 1 | **Upstash Redis** DB (free tier) — console.upstash.com | REST URL + token | `KV_REST_API_URL`, `KV_REST_API_TOKEN` |
| 2 | **GitHub fine-grained PAT** on `ecea-ui`, permission **Contents: Read and write** | one token | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| 3 | **Auth secret**: `openssl rand -base64 32` | a random string | `NEXTAUTH_SECRET` |
| 4 | **Backend host** (see step 3) | — | — |

Plus the fixed ones: `GITHUB_OWNER=east-coast-enduro-association`,
`GITHUB_REPO=ecea-ui`, `GITHUB_BRANCH=master`, and `TINA_PUBLIC_IS_LOCAL=false`
in production. See `.env.example`.

## 3. ⬅ DECISION NEEDED: where does the backend run?

`TinaNodeBackend` is a plain Node `(req,res)` handler. That makes the host choice matter:

- **Netlify Functions (scaffolded here):** keeps everything in your existing
  Netlify account, free, no ToS questions. Needs the small express/serverless-http
  **shim** in `netlify/functions/tina.mts` — the route handling there is the
  one unverified piece.
- **Vercel:** runs `TinaNodeBackend` **natively** (matches Tina's reference 1:1,
  no shim), but the free *Hobby* tier is "non-commercial" — a gray area for an org.
- **Standalone Node host** (Render/Railway/Fly): native, but another vendor and
  free tiers may cold-sleep.

Current scaffold assumes **Netlify**. If we switch to Vercel, we drop the
`netlify/functions/tina.mts` + the `/api/tina/*` redirect and add a Vercel route
instead; `contentApiUrlOverride` in `tina/config.tsx` would become the backend's
absolute URL.

## 4. Create the first editor (local, no auth needed)

```bash
TINA_PUBLIC_IS_LOCAL=true npm run dev
# open http://localhost:4321/admin → "Users" collection → add yourself
# (username + password). This commits a user file. Repeat for each editor,
# or add them from the live admin once you're logged in.
```

## 5. Production env vars

Set all the vars from `.env.example` (with `TINA_PUBLIC_IS_LOCAL=false`) in the
**backend host** dashboard. The site build also needs `TINA_PUBLIC_IS_LOCAL=false`
so the admin bundle targets the self-hosted backend.

## What's done vs. open

- ✅ `tina/database.ts`, `tina/config.tsx` (self-host client config), `.env.example`,
  `netlify.toml` route, and a first-pass Netlify function.
- ⬜ Create the accounts/secrets (step 2).
- ⬜ Confirm the backend host (step 3).
- ⬜ First real deploy + validate the function route shim; create first user.
- ⬜ Remove the old Tina Cloud vars (`TINA_CLIENT_ID`, `TINA_TOKEN`) once live.

## Rollback

Nothing here affects the live site until `TINA_PUBLIC_IS_LOCAL=false` is set on a
production build pointing at the new backend. To abandon: revert this branch;
the current Tina Cloud setup is untouched on `master`.
