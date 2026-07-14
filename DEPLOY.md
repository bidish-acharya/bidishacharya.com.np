# Deploying

This is a Vite + React static site with one serverless (Edge) function,
`api/chat.ts`, for the recruiter chat. It deploys to Vercel the same way as
RhinoStats: connect the repo, set one environment variable, done.

## First-time setup

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the [Vercel dashboard](https://vercel.com/new), import the repo. Vercel
   auto-detects the Vite framework preset — no build settings to change.
3. Under **Settings → Environment Variables**, add:
   - `GROQ_API_KEY` — your key from https://console.groq.com/keys
   - Set it for Production, Preview, and Development.
4. Deploy. Vercel builds the frontend (`npm run build`, which runs
   `content:build` first via the `prebuild` script) and picks up `api/chat.ts`
   as an Edge Function automatically.

## Local development

- `npm run dev` — frontend only, on Vite's dev server. The chat UI will render
  but requests to `/api/chat` will 404 (no functions server running).
- `npm run dev:full` — runs `vercel dev`, which serves the frontend **and**
  the `/api/chat` function together on one port, exactly like production. This
  is what you want when testing the chat locally. Requires the [Vercel
  CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) and a `.env` file
  (copy `.env.example` and fill in `GROQ_API_KEY`).

## Updating your info

Edit the files in `/content` (see `content/README.md` for the schema) and
redeploy — no code changes needed. Content is baked into the build at build
time via `scripts/generate-content.ts`, so a content-only change still needs a
new deploy (or `git push`, if using Vercel's Git integration) to go live.

## Notes on the chat endpoint

- The rate limiter in `api/_lib/rateLimit.ts` is in-memory per Edge instance —
  it blunts casual abuse but isn't a hard cross-region guarantee. If this
  becomes a real concern (e.g. the link gets shared widely), swap it for
  [Upstash Redis](https://vercel.com/marketplace/upstash) or [Vercel
  KV](https://vercel.com/docs/storage/vercel-kv), which durably share counters
  across all instances.
- `GROQ_API_KEY` is only ever read server-side inside the Edge Function
  (`process.env.GROQ_API_KEY`) — it's never sent to or readable by the
  browser.
