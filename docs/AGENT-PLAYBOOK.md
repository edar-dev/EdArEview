# Agent Playbook — EdArEview

Workflow operativo per agenti AI e sviluppo manuale.

## Prima di ogni fase

1. Leggere [AGENTS.md](../../AGENTS.md) e il piano in `docs/plans/phase-*.md`
2. Branch da `main` aggiornato: `feat/<nome>` o `chore/<nome>`
3. Verificare `.env.local` (locale) o env Vercel (preview/prod)

## Stack — regole fisse

| Area | Scelta |
|------|--------|
| DB | Neon via Vercel Marketplace — **non** Supabase |
| Adapter | `@payloadcms/db-postgres` — **non** vercel-postgres |
| Media | Vercel Blob |
| Package manager | pnpm |
| Node | 22 (`.nvmrc`) |

## Comandi ricorrenti

```bash
pnpm install
pnpm dev
pnpm payload migrate          # dopo modifica schema
pnpm payload migrate:create   # genera nuova migration
pnpm lint
pnpm build
```

## Migration Payload

- `push: false` in produzione
- Ogni modifica collection → `pnpm payload migrate:create` → commit file in `src/migrations/`
- Build Vercel: `payload migrate && next build` (in `package.json`)

## MCP

| Server | Quando |
|--------|--------|
| `user-vercel` | Nuovo progetto, env, Neon/Blob integration, deploy, log |
| `user-github` | PR, issue, push se `gh` non disponibile in locale |
| `user-supabase` | **Non usare** per EdArEview |

## Checklist pre-PR

```
[ ] Piano fase rispettato
[ ] Nessun segreto in git (.env, chiavi API)
[ ] Migration committate se schema cambiato
[ ] pnpm lint + pnpm build OK in locale
[ ] .env.example aggiornato se nuove variabili
[ ] PR descrive env Vercel da aggiungere (se applicabile)
```

## Deploy

1. Merge su `main` → Vercel deploy automatico
2. Preview su ogni PR (env Preview su Vercel)
3. Smoke test post-deploy:
   - `/` carica
   - `/admin` login Payload
   - Pubblicare una recensione → visibile sul frontend

## Riferimenti

- [ROADMAP.md](ROADMAP.md)
- [plans/README.md](plans/README.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
