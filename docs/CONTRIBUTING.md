# Contributing — EdArEview

## Prerequisiti

- **Node.js 22** (vedi `.nvmrc` / `.node-version`)
- **pnpm 9+** (`corepack enable && corepack prepare pnpm@latest --activate`)
- Account Vercel (deploy) e Neon (DB via Marketplace)

## Quick start

```bash
git clone git@github.com:edar-dev/EdArEview.git
cd EdArEview
pnpm install
cp .env.example .env.local
# Compila .env.local con DATABASE_URL, PAYLOAD_SECRET, ecc.
pnpm dev
```

Admin Payload: http://localhost:3000/admin

## Workflow Git

1. Branch da `main`: `feat/nome` o `fix/nome`
2. Commit in inglese, imperativo: `feat: add review collection`
3. PR verso `main` — usa il template in `.github/pull_request_template.md`
4. CI deve passare prima del merge

## Convenzioni codice

- TypeScript strict
- Componenti React in `src/components/`
- Collections Payload in `src/collections/`
- Nessuna stringa hardcoded in UI (quando si aggiunge i18n)
- Metadata API solo in route server-side (`src/app/api/`)

## Database

- **Neon Postgres** via Vercel Marketplace — non Supabase
- Adapter: `@payloadcms/db-postgres` (non vercel-postgres)
- Migration: `pnpm payload migrate` — mai `push: true` in produzione

## Documentazione

- Piano: [ROADMAP.md](ROADMAP.md)
- Agenti AI: [AGENTS.md](../AGENTS.md)
