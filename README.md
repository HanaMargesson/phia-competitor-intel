# Phia · Weekly Competitor Ad Intelligence

A Next.js dashboard that pulls live competitor ad data from the Meta Ad Library
every Monday and renders it on-brand for Phia.

This is **Step 1 of 5** in Phia's growth agent loop:

1. **Competitor Research** — this app
2. Creative Generation — Higgsfield
3. Upload to Meta Ads Manager
4. Launch & read performance
5. Scale winners

---

## What's live vs. hand-curated

The dashboard renders three things per competitor:

| Field | Source |
|---|---|
| Active ad count | Live — Meta Ad Library API |
| Top hooks | Live — extracted from `ad_creative_bodies`, top-5 deduped |
| Format breakdown | Live — heuristic from `publisher_platforms` + body length |
| Pattern paragraph | Hand-curated in `lib/competitors.ts` |
| Creative brief + Gaps | Hand-curated in `components/CreativeBriefAndGaps.tsx` |

Without a Meta API token, every field falls back to hand-curated editorial
content so the page is always shippable.

---

## Local development

```bash
npm install
cp .env.example .env.local
# (optional) paste META_AD_LIBRARY_TOKEN into .env.local
npm run dev
```

The page is at <http://localhost:3000>. The API route is at `/api/competitors`.

---

## Deploying to Vercel

The app is designed to drop straight into an existing Vercel project.

### 1. Push the code

If you're using the existing `phia-competitor-intel` repo, create a branch,
drop in the files, and push.

### 2. Add environment variables in Vercel

Go to **Vercel → Project → Settings → Environment Variables** and add:

| Name | Value | Notes |
|---|---|---|
| `META_AD_LIBRARY_TOKEN` | (your Meta access token) | Without it, the app runs on mock data |
| `CRON_SECRET` | (any long random string) | Used to authorize manual cron hits |

### 3. Verify the cron

After deploy, check **Vercel → Project → Settings → Cron Jobs**. You should see
`GET /api/cron/refresh` running weekly on Mondays at 13:00 UTC.

---

## Getting a Meta API token

The Meta Ad Library API is free, but it requires a verified Meta developer
account because of the ad transparency rules.

1. Create a Meta developer account at <https://developers.facebook.com/>.
2. **My Apps → Create App** → choose "Other" → "Business".
3. Complete **Identity Confirmation** for the ad library at
   <https://www.facebook.com/ID>. This takes 1–3 business days and requires a
   government-issued ID.
4. Once verified, generate a long-lived access token via the
   [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
   The token format is `EAAxxxxxxxxxxxx...`.
5. Paste it into Vercel as `META_AD_LIBRARY_TOKEN`.

Until the token is set, the app uses mock data.

---

## Updating the competitor list

All competitor metadata is in `lib/competitors.ts`. To find a competitor's Page ID:

1. Go to <https://www.facebook.com/ads/library/?country=US> and search the brand.
2. Open any ad → "See ad details".
3. The Page ID is shown next to the page name. Copy it into `pageIds`.

---

## Design system

The dashboard follows Phia's design system:

- **Phia-Blue** `#0843CB` for accents
- **Instrument Serif** (italic) as a stand-in for GT Super Display
- **Inter** as a stand-in for PP Neue Montreal
- **Roboto Mono** for all data and labels
- 2px corner radius everywhere

To swap in the licensed Phia font files, add `@font-face` declarations to
`app/globals.css` above the `:root` block.
