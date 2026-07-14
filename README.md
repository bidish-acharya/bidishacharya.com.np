# Bidish Acharya — Portfolio

Vite + React + TypeScript + Tailwind CSS portfolio site with a Groq-powered
recruiter chat, grounded in a structured, self-editable content layer.

## Quick start

```bash
npm install
cp .env.example .env   # add your GROQ_API_KEY for the chat
npm run dev             # frontend only, http://localhost:5173
npm run dev:full        # frontend + /api/chat together (requires Vercel CLI)
```

## Project layout

- `content/` — single source of truth for everything on the site and in the
  recruiter chat. See [content/README.md](content/README.md) for the schema.
- `src/` — the React app (`src/components`, `src/lib/content.ts`).
- `api/chat.ts` — the recruiter chat's Edge Function; calls Groq server-side.
- `scripts/generate-content.ts` — builds `content/generated/site-content.json`
  from `/content` (runs automatically before `dev`/`build`).

## Deploying

See [DEPLOY.md](DEPLOY.md).

## Linting & formatting

```bash
npm run lint
npm run format
```
"# bidishacharya.com.np" 
