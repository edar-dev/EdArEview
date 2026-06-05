# Fase 0–1 — Foundation & infrastruttura

**Branch suggerito:** `chore/foundation`  
**Durata stimata:** 1–1.5 giorni  
**Dipende da:** repo GitHub (già fatto)

## Obiettivo

Scaffold Next.js 15 + Payload CMS 3, collegare Neon e Vercel Blob, primo deploy preview funzionante con admin vuoto.

---

## Prerequisiti completati

- [x] Repo GitHub `edar-dev/EdArEview`
- [x] `.gitignore`, CI hygiene, `.env.example`
- [ ] Progetto Vercel collegato al repo

---

## Step 1 — Scaffold applicazione

### Comando

```bash
cd EdArEview
pnpm dlx create-payload-app@latest . --template website
# Oppure template ufficiale Vercel+Neon se disponibile nel wizard
```

### Adattamenti post-scaffold

| File | Azione |
|------|--------|
| `package.json` | `"build": "payload migrate && next build"` |
| `payload.config.ts` | `postgresAdapter` da `@payloadcms/db-postgres` |
| `payload.config.ts` | `push: false` in produzione; `push: true` solo dev locale opzionale |
| `payload.config.ts` | Rimuovere `vercelPostgresAdapter` se presente |
| `tsconfig.json` | Verificare `strict: true` |
| `tailwind.config.ts` | Base per shadcn (step successivo in Fase 4) |

### Config database (obbligatoria)

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL,
    max: 10,
  },
  push: process.env.NODE_ENV === 'development',
}),
```

### Struttura cartelle da creare

```
src/
├── app/(frontend)/          # placeholder page.tsx
├── collections/             # vuoto — Fase 2
├── globals/
├── components/
├── lib/
│   └── metadata/            # vuoto — Fase 3
└── migrations/              # generato da Payload
```

### File da rimuovere/semplificare

- Collection demo del template non necessarie (Posts, Pages…) — sostituire in Fase 2
- Mantenere solo `Users` collection di Payload per auth admin

### Verifica locale (con Neon dev branch o DB locale)

```bash
cp .env.example .env.local
# Compilare DATABASE_URL, PAYLOAD_SECRET
pnpm install
pnpm payload migrate
pnpm dev
```

- [ ] `http://localhost:3000` risponde
- [ ] `http://localhost:3000/admin` — creazione primo utente admin

---

## Step 2 — Progetto Vercel

### MCP / Dashboard

1. Nuovo progetto Vercel `edareview` → import `edar-dev/EdArEview`
2. Framework: Next.js (auto-detect)
3. Build command: `pnpm build` (con migrate nel script)
4. Install: `pnpm install`
5. Node: 22

### Integrazione Neon

```bash
vercel integration add neon --name edareview-db --plan free -e production -e preview
```

| Setting | Valore |
|---------|--------|
| Regione | `eu-central-1` |
| Env | `DATABASE_URL` su Production + Preview |

### Integrazione Vercel Blob

1. Storage → Create Blob store `edareview-media` (public read)
2. Collegare al progetto `edareview`
3. Env: `BLOB_READ_WRITE_TOKEN`

### Env manuali

| Variabile | Dove generarla |
|-----------|----------------|
| `PAYLOAD_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | URL preview/prod Vercel |

Aggiornare `.env.example` se compaiono nuove chiavi.

### `vercel.json` (opzionale)

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

### Verifica deploy

- [ ] Push su `main` → deploy Preview/Production parte
- [ ] Build log: `payload migrate` senza errori
- [ ] `/admin` accessibile su URL Vercel
- [ ] Primo utente admin creato su preview

---

## Step 3 — Storage media Payload

Configurare adapter Blob in `payload.config.ts`:

```ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

plugins: [
  vercelBlobStorage({
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
],
```

Collection `media` minima per upload (o rinominare in Fase 2).

- [ ] Upload test immagine da admin funziona su preview

---

## Step 4 — CI aggiornata

Il workflow `.github/workflows/ci.yml` eseguirà build quando esiste `package.json`.

Aggiungere in CI (se build fallisce senza DB):

- Secret GitHub `DATABASE_URL` (Neon branch CI dedicato) **oppure**
- `SKIP_ENV_VALIDATION=true` + mock env (solo per lint/typecheck iniziale)

Preferenza: **branch Neon `ci`** read-only per build su PR.

---

## Definition of Done

- [ ] Next.js + Payload avviabili in locale
- [ ] `@payloadcms/db-postgres` configurato (no vercel-postgres)
- [ ] Vercel progetto collegato, Neon + Blob attivi
- [ ] Deploy preview verde
- [ ] Admin Payload raggiungibile
- [ ] `pnpm build` OK in locale e su Vercel
- [ ] ROADMAP Fase 0–1 checkbox aggiornate

---

## Rischi e mitigazioni

| Rischio | Mitigazione |
|---------|-------------|
| Cold start Neon | Accettabile in dev; documentato in ROADMAP |
| Template Payload con collection extra | Rimuovere demo, tenere Users |
| Build CI senza DB | Branch Neon CI o skip build fino a Fase 2 |
| `git push` locale fallisce | MCP GitHub `push_files` |

---

## File attesi a fine fase

```
package.json
pnpm-lock.yaml
payload.config.ts
next.config.ts
src/app/(payload)/...
src/app/(frontend)/page.tsx
src/collections/Users.ts (da template)
src/migrations/*.ts
vercel.json (opzionale)
.env.example (aggiornato)
```
