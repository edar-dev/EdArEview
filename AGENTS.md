# EdArEview — Guida per Agenti AI

**Ultimo aggiornamento:** Fase 7 (RSS, liste editoriali, statistiche).

## Stack

- **Frontend + CMS**: Next.js 16 + Payload CMS 3.85 (App Router)
- **Database**: Neon Postgres via Vercel Marketplace (`@payloadcms/db-postgres`)
- **Media**: Vercel Blob
- **Deploy**: Vercel (team `edar-dev's projects`)
- **Metadata API**: AniList (anime/manga), TMDB (film/TV), IGDB (videogiochi)

## Vincoli

- **Non** usare Supabase per il database EdArEview (limite progetti Free; SpritzPlanning resta separato)
- **Non** usare `@payloadcms/db-vercel-postgres` né `@vercel/postgres` (deprecati)
- Usare `postgresAdapter` con `push: false` in produzione; migration esplicite
- Chiavi API metadata solo server-side (route `/api/metadata/*`)

## Toolchain

```bash
pnpm install
pnpm dev                    # Next.js + Payload admin su /admin
pnpm payload migrate        # applica migration su Neon
pnpm build                  # payload migrate && next build
```

## Variabili d'ambiente

Vedi `.env.example`. Minimo:

- `DATABASE_URL` — Neon (auto da Vercel Marketplace)
- `PAYLOAD_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_SITE_URL` — URL canonico (prod: `https://edareview.vercel.app`)
- `TMDB_API_KEY`
- `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` (IGDB)

## Produzione

- URL: https://edareview.vercel.app
- Checklist: [docs/GO-LIVE.md](docs/GO-LIVE.md)

## MCP

| Server | Uso |
|--------|-----|
| `user-vercel` | Progetto, deploy, env, Blob, integrazione Neon |
| `user-github` | Repo, PR, CI |
| `user-supabase` | **Non usare** per EdArEview DB |

## Repository

- Node **22** (`.nvmrc`), package manager **pnpm**
- CI: `.github/workflows/ci.yml` (build attivo quando esiste `package.json`)
- Env: solo `.env.example` in git; mai committare `.env*`

## Documentazione

- Panoramica: [docs/ROADMAP.md](docs/ROADMAP.md)
- **Piani implementazione:** [docs/plans/README.md](docs/plans/README.md)
- Playbook delivery: [docs/AGENT-PLAYBOOK.md](docs/AGENT-PLAYBOOK.md)
- Contribuzione: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

## Ordine fasi (implementazione)

1. [phase-0-1-foundation](docs/plans/phase-0-1-foundation.md)
2. [phase-2-cms-schema](docs/plans/phase-2-cms-schema.md)
3. [phase-4-frontend-mvp](docs/plans/phase-4-frontend-mvp.md) — prima di metadata
4. [phase-3-metadata-apis](docs/plans/phase-3-metadata-apis.md)
5. [phase-5-discoverability](docs/plans/phase-5-discoverability.md)
6. [phase-6-production](docs/plans/phase-6-production.md)
