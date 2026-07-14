# Content schema

Everything on the site — and everything the recruiter chat knows about you — comes from
the files in this folder. Edit these, run `npm run content:build` (or just `npm run dev` /
`npm run build`, which do it automatically), and both the rendered site and the chat
context update together. There is no other place your info lives.

## Files

### `profile.json`

```json
{
  "name": "...",
  "title": "...",
  "location": "...",
  "summary": "...", // the italic serif paragraph in the Profile section
  "tagline": "...", // the line in the footer
  "links": { "linkedin": "...", "rhinostats": "...", "email": "..." }
}
```

### `experience.json`

An array of jobs, most recent first:

```json
{ "role": "...", "company": "...", "dates": "MM/YYYY – MM/YYYY", "bullets": ["...", "..."] }
```

### `skills.json`

An array of skill groups, rendered in order:

```json
{ "category": "Design", "items": ["Figma", "Framer", "..."] }
```

### `education.json`

```json
{ "degree": "...", "school": "...", "dates": "...", "extra": "optional string or null" }
```

### `case-studies/*.md`

One file per case study. The filename prefix (`01-`, `02-`, ...) is just for readability
in your editor — the actual ordering comes from the `order` field in frontmatter, so you
can reorder without renaming files.

```md
---
id: unique-slug
order: 1
tag: Category shown as the pill in the card
title: Case study title
roleContext: Your role and dates
metric: The one-line outcome shown on the card and in the detail header
---

## Challenge

...

## Approach

...

## Outcome

...
```

All three sections (`## Challenge`, `## Approach`, `## Outcome`) are required — the build
script (`scripts/generate-content.ts`) throws a clear error naming the offending file if
one is missing, rather than silently rendering a blank section.

To add a case study: drop a new `.md` file in this folder with a unique `order`. To
remove one: delete the file. To reorder: change `order` values.

## How this reaches the site and the chat

`scripts/generate-content.ts` reads all of the above, parses the markdown frontmatter/
sections, and writes a single combined `content/generated/site-content.json`. That
generated file (gitignored, rebuilt on every `dev`/`build`) is the only thing the React
app (`src/lib/content.ts`) and the chat API (`api/_lib/systemPrompt.ts`) import — so
there's exactly one parsing path and one place data can drift out of sync.

If you ever need to regenerate it by hand: `npm run content:build`.
