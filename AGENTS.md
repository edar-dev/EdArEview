# EdArEview — Guida per Agenti AI

**Ultimo aggiornamento:** Fase 0 (pianificazione).

## Stack

- **Frontend + CMS**: Next.js 15 + Payload CMS 3 (App Router)
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

Vedi `env.json.example` (o `.env.example`). Minimo:

- `DATABASE_URL` — Neon (auto da Vercel Marketplace)
- `PAYLOAD_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `TMDB_API_KEY`
- `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` (IGDB)

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

- Piano completo: [docs/ROADMAP.md](docs/ROADMAP.md)
- Contribuzione: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
