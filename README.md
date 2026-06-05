# EdArEview

Catalogo personale e recensioni di manga, anime, serie TV, videogiochi e altri media.

**Ed**oardo **Ar**lati **Review** — il nome gioca sulla «R» come punto di unione tra le due parole.

## Stack (pianificato)

- **Frontend + CMS:** Next.js 15 + Payload CMS 3
- **Database:** Neon Postgres (Vercel Marketplace)
- **Media:** Vercel Blob
- **Deploy:** Vercel
- **Metadata:** AniList, TMDB, IGDB

## Stato

Progetto in fase di bootstrap (documentazione e setup repo). Vedi [docs/ROADMAP.md](docs/ROADMAP.md).

## Prerequisiti

- Node.js **22** (`.nvmrc`)
- pnpm **9+**
- `cp .env.example .env.local` e compila le variabili

## Sviluppo

```bash
pnpm install
pnpm dev          # dopo scaffold Payload (Fase 0)
```

- Admin Payload: `/admin` (dopo implementazione)
- Guida contribuzione: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- Agenti AI: [AGENTS.md](AGENTS.md)

## Struttura repository

```
EdArEview/
├── .github/           # CI, Dependabot, PR template
├── .vscode/           # Settings ed estensioni consigliate
├── docs/
│   ├── ROADMAP.md     # Piano di realizzazione
│   └── CONTRIBUTING.md
├── .env.example       # Template variabili (no segreti)
├── AGENTS.md          # Guida per Cursor / agenti AI
├── LICENSE
└── SECURITY.md
```

## Licenza

Copyright © 2026 Edoardo Arlati — tutti i diritti riservati. Vedi [LICENSE](LICENSE).
