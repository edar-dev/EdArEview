# EdArEview — Piano di realizzazione

**Ultimo aggiornamento:** Giugno 2026 — Neon Postgres via Vercel Marketplace.

Sito personale per catalogare e recensire manga, anime, serie TV, videogiochi e contenuti simili.

---

## Obiettivo del prodotto

| Funzione | Descrizione |
|----------|-------------|
| **Catalogo** | Schede per ogni opera (titolo, cover, anno, generi, metadati da API esterne) |
| **Recensioni** | Testo ricco, voto, spoiler tag, stato (pianificato / in corso / completato / droppato) |
| **Navigazione** | Filtri per tipo, genere, voto, anno; ricerca full-text |
| **CMS** | Pannello admin (`/admin`) per creare e pubblicare contenuti senza toccare il codice |
| **Deploy** | Vercel con preview su PR, produzione su dominio custom |

---

## Decisioni architetturali

### Database: Neon (non Supabase, non Vercel Postgres)

| Opzione valutata | Esito |
|------------------|-------|
| Nuovo progetto Supabase | Scartato — limite Free: max 2 progetti attivi |
| Schema condiviso su SpritzPlanning | Scartato — 500 MB condivisi, accoppiamento tra app |
| Riattivare `gym-blog` (Supabase) | Scartato — consuma slot Supabase, pausa dopo 7 giorni idle |
| **Vercel Postgres** | **Deprecato** (giugno 2025) — migrato a Neon |
| **Neon via Vercel Marketplace** | **Scelta ufficiale** |

**Perché Neon:**
- DB dedicato senza impattare SpritzPlanning
- Free permanente: 100 progetti, 0.5 GB/progetto, 100 CU-hours/mese
- Nessuna pausa per inattività (a differenza di Supabase Free)
- Branching DB per preview Vercel (fino a 10 branch/progetto)
- Stack ufficiale del template Payload "Deploy with Vercel"
- Regione `eu-central-1` disponibile

**Nota cold start:** Neon scala a zero dopo 5 min di inattività. Il primo accesso a `/admin` può richiedere 1–3 s — accettabile per un sito personale.

### CMS: Payload CMS 3

Admin integrato in Next.js, schema TypeScript, editor Lexical per recensioni lunghe, zero costi SaaS CMS.

Alternative valutate: Sanity (ottimo editor, lock-in GROQ), TinaCMS (git-based, poco adatto a catalogo strutturato).

### Adapter database Payload

Usare **`@payloadcms/db-postgres`** (TCP via `pg.Pool`), **non** `@payloadcms/db-vercel-postgres` (deprecato, WebSocket fragile su query grandi).

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL,
    max: 10,
  },
  push: false,
}),
```

### Media: Vercel Blob

Cover e screenshot personali. Metadati API (AniList, TMDB, IGDB) forniscono URL cover esterni; upload locale solo quando serve.

---

## Stack tecnico

```
┌─────────────────────────────────────────────────────────┐
│  Vercel — team: edar-dev's projects                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Next.js 15 App Router                            │  │
│  │  ├── Frontend pubblico (/, /anime, /reviews/…)     │  │
│  │  ├── Payload Admin (/admin)                       │  │
│  │  └── API Routes (metadata, og, revalidate)        │  │
│  └───────────────────────────────────────────────────┘  │
│  Vercel Blob (media upload)                             │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌──────────────────────────┐
│ Neon Postgres   │          │ API metadata esterne      │
│ (Marketplace)   │          │ • AniList — anime/manga   │
│ eu-central-1    │          │ • TMDB — film/serie TV    │
│ schema public   │          │ • IGDB — videogiochi      │
└─────────────────┘          └──────────────────────────┘
```

| Layer | Tecnologia |
|-------|------------|
| Framework | Next.js 15 + TypeScript |
| CMS | Payload CMS 3 + Lexical editor |
| Database | **Neon Postgres** (integrazione Vercel Marketplace) |
| Media | Vercel Blob |
| Styling | Tailwind CSS + shadcn/ui |
| Auth admin | Payload built-in (solo admin personale) |
| Metadata | AniList GraphQL, TMDB REST, IGDB REST |
| MCP operativi | `user-vercel`, `user-github` |
| MCP non usati per DB | `user-supabase` (riservato a SpritzPlanning) |

---

## Modello dati (Payload collections)

```
MediaWork (catalogo)
├── mediaType: anime | manga | tv | movie | game
├── externalSource: anilist | tmdb | igdb
├── externalId (unique per source)
├── title, titleOriginal, slug
├── year, genres[], coverUrl
└── metadata (JSON cache API)

Review
├── → MediaWork (relation)
├── title, body (Lexical rich text)
├── rating (0–10)
├── watchStatus: planned | watching | completed | dropped | on_hold
├── hasSpoilers, tags[]
├── status: draft | published
└── publishedAt

Tag
├── name, slug

SiteSettings (global)
├── bio, avatar, social links, homepage copy
```

**Flusso admin:** cerca opera → import da API → crea `MediaWork` precompilato → scrivi `Review` → pubblica.

---

## API metadata esterne

| Tipo | API | Auth |
|------|-----|------|
| Anime / Manga | [AniList GraphQL](https://docs.anilist.co/) | Nessuna (rate limit) |
| Film / Serie TV | [TMDB](https://developer.themoviedb.org/) | API key gratuita |
| Videogiochi | [IGDB](https://api-docs.igdb.com/) | Twitch OAuth2 |

Route server-side: `/api/metadata/search`, `/api/metadata/import`. Chiavi solo in env Vercel.

---

## Variabili d'ambiente

| Variabile | Fonte |
|-----------|-------|
| `DATABASE_URL` | Neon (auto-iniettata da Vercel Marketplace) |
| `PAYLOAD_SECRET` | Generata manualmente |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store |
| `TMDB_API_KEY` | TMDB Developer |
| `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | Twitch Developer (per IGDB) |
| `NEXT_PUBLIC_SITE_URL` | URL produzione/preview |

---

## Piani di implementazione

Dettaglio operativo per fase in [`docs/plans/`](plans/):

| Fase | Piano | Branch |
|------|-------|--------|
| 0–1 | [phase-0-1-foundation.md](plans/phase-0-1-foundation.md) | `chore/foundation` |
| 2 | [phase-2-cms-schema.md](plans/phase-2-cms-schema.md) | `feat/cms-schema` |
| 3 | [phase-3-metadata-apis.md](plans/phase-3-metadata-apis.md) | `feat/metadata-import` |
| 4 | [phase-4-frontend-mvp.md](plans/phase-4-frontend-mvp.md) | `feat/frontend-mvp` |
| 5 | [phase-5-discoverability.md](plans/phase-5-discoverability.md) | `feat/search-seo` |
| 6 | [phase-6-production.md](plans/phase-6-production.md) | `chore/go-live` |

Panoramica Gantt e dipendenze: [plans/OVERVIEW.md](plans/OVERVIEW.md)  
Playbook operativo: [AGENT-PLAYBOOK.md](AGENT-PLAYBOOK.md)

---

## Fasi di delivery

### Fase 0 — Bootstrap (½ giornata)

- [x] GitHub repo + branch `main`
- [x] Init repo `EdArEview` con template Payload + Next.js
- [x] Configurare `@payloadcms/db-postgres` (non vercel-postgres)
- [x] Struttura: `src/collections/`, `src/app/(frontend)/`, `src/lib/metadata/`
- [x] `.env.example`, `AGENTS.md`, `README.md`

### Fase 1 — Infrastruttura (1 giornata)

- [x] Progetto Vercel `edareview` collegato al repo GitHub
- [x] Integrazione Neon `edareview-db` (plan `free_v3`, regione `fra1` / Frankfurt)
- [x] `DATABASE_URL` su Production + Preview
- [x] Vercel Blob store `edareview-media` (public read)
- [x] Env `PAYLOAD_SECRET` (production) + `BLOB_READ_WRITE_TOKEN` (production, preview) su Vercel
- [x] Build script: `payload migrate && payload build`
- [x] Prima migration Payload su Neon (`20260409_155721_initial`)
- [x] Deploy production verde

**MCP:** `user-vercel` (deploy, env, logs); `user-github` (repo).

### Fase 2 — Schema CMS e admin (1–2 giorni)

- [x] Collection `MediaWorks` (validazione `mediaType` + `externalId` unique)
- [x] Collection `Reviews` (Lexical, rating, spoiler, draft/published)
- [x] Collection `Tags`
- [x] Global `SiteSettings`
- [x] Hook: auto-slug, `revalidatePath` on publish
- [x] Migration `20260605_211500_edareview_cms_schema` su Neon
- [x] Rimossi template demo (Pages, Posts, Categories, Header/Footer)

**Deliverable:** `/admin` utilizzabile per inserire recensioni manualmente.

### Fase 3 — Integrazione metadata (2 giorni)

- [x] Client `lib/metadata/anilist.ts`
- [x] Client `lib/metadata/tmdb.ts`
- [x] Client `lib/metadata/igdb.ts` (OAuth token cache)
- [x] Route `/api/metadata/search` (auth admin Payload)
- [x] Field component admin "Import from catalog"
- [x] Cache metadata in campo JSON su `MediaWork`

**Deliverable:** import cover + metadati in un click da admin.

### Fase 4 — Frontend pubblico MVP (2–3 giorni)

- [x] Homepage: ultime recensioni + filtri rapidi per tipo
- [x] `/[type]` — listing (anime, manga, tv, games…)
- [x] `/[type]/[slug]` — scheda opera + recensione
- [x] `/reviews` — archivio cronologico
- [x] Layout responsive, dark mode, branding EdArEview
- [x] `generateMetadata` per SEO base

**Deliverable:** sito navigabile e presentabile.

### Fase 5 — Ricerca, filtri, polish (1–2 giorni)

- [x] Filtri: tipo, voto, anno, stato, tag
- [x] Ricerca full-text (Payload `contains` — MVP)
- [x] Paginazione e ordinamento
- [x] OG images (`/api/og`)
- [x] `sitemap.xml` + `robots.txt`

### Fase 6 — Produzione (½ giornata)

- [ ] Dominio custom via Vercel
- [ ] Deploy `main` → produzione
- [ ] Smoke test: admin, import, publish, pagina pubblica
- [ ] (Opzionale) branch Neon per preview DB allineato alle PR

### Fase 7 — Backlog (post-MVP)

- [ ] Liste personali ("Da vedere", "Top 10 2026")
- [ ] Confronto opere simili
- [ ] RSS / newsletter
- [ ] i18n IT/EN
- [ ] Integrazione MAL, Steam, Letterboxd
- [ ] Statistiche (opere per anno, media voti per genere)
- [ ] Commenti (Giscus) — solo se serve interazione
- [ ] Disabilitare scale-to-zero Neon (piano Launch) se cold start fastidioso

---

## Struttura repo

```
EdArEview/
├── src/
│   ├── app/
│   │   ├── (frontend)/          # Sito pubblico
│   │   │   ├── page.tsx
│   │   │   ├── anime/
│   │   │   ├── manga/
│   │   │   ├── tv/
│   │   │   ├── games/
│   │   │   └── reviews/
│   │   ├── (payload)/admin/     # Payload admin (auto)
│   │   └── api/
│   │       ├── metadata/
│   │       └── og/
│   ├── collections/
│   │   ├── MediaWorks.ts
│   │   ├── Reviews.ts
│   │   └── Tags.ts
│   ├── globals/
│   │   └── SiteSettings.ts
│   ├── components/
│   ├── lib/metadata/
│   └── payload.config.ts
├── .env.example
├── vercel.json
├── AGENTS.md
└── docs/
    ├── ROADMAP.md               # questo file
    ├── AGENT-PLAYBOOK.md
    └── plans/
        ├── README.md
        ├── OVERVIEW.md
        └── phase-*.md
```

---

## Costi stimati (uso personale)

| Servizio | Costo |
|----------|-------|
| Vercel Hobby | Gratis |
| Neon Free (via Marketplace) | Gratis (0.5 GB, 100 CU-hours/mese) |
| Vercel Blob | Gratis fino a ~1 GB |
| TMDB / AniList / IGDB | Gratis |
| Dominio custom | ~10–15 €/anno |
| Supabase | **Non usato** per EdArEview |

---

## Ordine di esecuzione consigliato

1. **Fase 0 + 1** — repo, Neon, Vercel Blob, primo deploy preview
2. **Fase 2** — admin subito utilizzabile
3. **Fase 4** — frontend MVP (anche senza import automatico)
4. **Fase 3** — import metadata (acceleratore)
5. **Fase 5 + 6** — polish e go-live

**Tempo stimato:** 7–10 giorni part-time, 3–4 giorni full-time.

---

## Relazione con altri progetti

| Progetto | Ruolo | Condivisione con EdArEview |
|----------|-------|----------------------------|
| SpritzPlanning | Supabase `eyvfsgzbrdibheyejikf` | Nessuna — stack separato |
| gym-blog | Supabase in pausa | Non riattivare per EdArEview |
| EdArEview | Neon + Vercel | Progetto autonomo |
