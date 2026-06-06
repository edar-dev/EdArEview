# EdArEview

Catalogo personale e recensioni di manga, anime, serie TV, videogiochi e altri media.

**Ed**oardo **Ar**lati **Review** — il nome gioca sulla «R» come punto di unione tra le due parole.

**Produzione:** https://edareview.vercel.app  
**Admin:** https://edareview.vercel.app/admin

## Stack

- **Frontend + CMS:** Next.js 16 + Payload CMS 3.85
- **Database:** Neon Postgres (Vercel Marketplace)
- **Media:** Vercel Blob
- **Deploy:** Vercel
- **Metadata:** AniList, TMDB, IGDB

## Stato

MVP pubblico live (Fasi 0–8). URL canonico: `https://edareview.vercel.app`.

- Panoramica: [docs/ROADMAP.md](docs/ROADMAP.md)
- **Piani implementazione:** [docs/plans/README.md](docs/plans/README.md)

## Prerequisiti

- Node.js **22** (`.nvmrc`)
- pnpm **10+**
- `cp .env.example .env.local` e compila le variabili

## Sviluppo

```bash
pnpm install
cp .env.example .env.local
# Locale: docker compose up -d  → POSTGRES_URL in .env.local
# Produzione: DATABASE_URL da Neon (Vercel Marketplace)
pnpm dev
```

- Admin Payload: `/admin`
- Guida contribuzione: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- Agenti AI: [AGENTS.md](AGENTS.md)

## Struttura repository

```
EdArEview/
├── .github/           # CI, Dependabot, PR template
├── .vscode/           # Settings ed estensioni consigliate
├── docs/
│   ├── ROADMAP.md
│   ├── GO-LIVE.md
│   ├── AGENT-PLAYBOOK.md
│   ├── CONTRIBUTING.md
│   └── plans/         # Piani operativi per fase
├── .env.example       # Template variabili (no segreti)
├── AGENTS.md          # Guida per Cursor / agenti AI
├── LICENSE
└── SECURITY.md
```

## Licenza

Copyright © 2026 Edoardo Arlati — tutti i diritti riservati. Vedi [LICENSE](LICENSE).
