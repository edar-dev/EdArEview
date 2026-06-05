# Fase 2 — CMS schema & admin

**Branch suggerito:** `feat/cms-schema`  
**Durata stimata:** 1–2 giorni  
**Dipende da:** [phase-0-1-foundation.md](phase-0-1-foundation.md)

## Obiettivo

Definire il modello dati EdArEview in Payload: catalogo opere, recensioni, tag e impostazioni sito. Admin utilizzabile per inserire contenuti manualmente.

---

## Collections

### `MediaWorks` — `src/collections/MediaWorks.ts`

| Campo | Tipo | Note |
|-------|------|------|
| `title` | text | required, indexed |
| `titleOriginal` | text | opzionale (titolo giapponese/originale) |
| `slug` | text | unique, auto da `title` + hook |
| `mediaType` | select | `anime`, `manga`, `tv`, `movie`, `game` |
| `externalSource` | select | `anilist`, `tmdb`, `igdb`, `manual` |
| `externalId` | text | required se source ≠ manual |
| `year` | number | anno uscita / inizio |
| `genres` | array di text | o relationship a Tags |
| `coverUrl` | text | URL esterno (API) |
| `cover` | upload | relazione Media collection (Blob) — opzionale |
| `metadata` | json | cache raw API |
| `status` | select | `draft`, `published` |

**Indice unique composto:** `externalSource` + `externalId` (hook `beforeValidate` o campo compound unique via migration custom).

```ts
// Esempio slug hook
hooks: {
  beforeChange: [
    ({ data, operation }) => {
      if (operation === 'create' && !data.slug) {
        data.slug = slugify(data.title)
      }
      return data
    },
  ],
},
```

### `Reviews` — `src/collections/Reviews.ts`

| Campo | Tipo | Note |
|-------|------|------|
| `title` | text | titolo recensione (può differire dall'opera) |
| `mediaWork` | relationship | → MediaWorks, required |
| `body` | richText (Lexical) | required |
| `rating` | number | min 0, max 10, step 0.5 |
| `watchStatus` | select | `planned`, `watching`, `completed`, `dropped`, `on_hold` |
| `hasSpoilers` | checkbox | default false |
| `tags` | relationship | → Tags, hasMany |
| `status` | select | `draft`, `published` |
| `publishedAt` | date | auto su publish |

**Access:** solo utenti autenticati Payload possono create/update; read pubblico solo `status === published` (access control).

### `Tags` — `src/collections/Tags.ts`

| Campo | Tipo |
|-------|------|
| `name` | text, required, unique |
| `slug` | text, unique, auto |

### `Media` — upload (da template o nuova)

Per cover uploadate su Blob; slug `media`.

### Global `SiteSettings` — `src/globals/SiteSettings.ts`

| Campo | Tipo |
|-------|------|
| `siteName` | text — default "EdArEview" |
| `tagline` | text |
| `bio` | textarea |
| `avatar` | upload |
| `socialLinks` | array: `{ platform, url }` |
| `homepageIntro` | richText |

---

## Registrazione in `payload.config.ts`

```ts
collections: [Users, MediaWorks, Reviews, Tags, Media],
globals: [SiteSettings],
```

Rimuovere collection demo del template (Posts, Categories, ecc.).

---

## Revalidation on publish

`src/collections/hooks/revalidateReview.ts`:

```ts
import { revalidatePath } from 'next/cache'

// afterChange su Reviews:
// se status === 'published' → revalidatePath('/'), revalidatePath(`/reviews`)
// revalidatePath per tipo/slug media work
```

---

## Migration

```bash
pnpm payload migrate:create
pnpm payload migrate
```

Commit file generati in `src/migrations/`.

---

## Admin UX (minimo)

| Task | Dettaglio |
|------|-----------|
| Gruppi sidebar | Catalogo (MediaWorks), Contenuti (Reviews), Taxonomy (Tags), Impostazioni |
| Default columns Reviews | title, mediaWork, rating, status, publishedAt |
| Default columns MediaWorks | title, mediaType, year, status |
| Preview link | `admin.livePreview` opzionale — Fase 4 |

---

## Verifica

### Manuale

1. Crea `MediaWork` manuale (source: manual) per "Chainsaw Man" manga
2. Crea `Review` collegata, rating 9, body con Lexical
3. Pubblica entrambi
4. Verifica in DB Neon (Neon Console): tabelle `media_works`, `reviews`

### Checklist

- [ ] Slug generato automaticamente
- [ ] Unique externalId per source rispettato
- [ ] Draft non visibile via Local API pubblica
- [ ] `pnpm payload migrate` OK su Vercel preview dopo deploy
- [ ] Types generati: `pnpm payload generate:types` → `src/payload-types.ts` committato

---

## Definition of Done

- [ ] 3 collections + 1 global operativi in `/admin`
- [ ] Primo contenuto inserito manualmente end-to-end
- [ ] Migration committate
- [ ] Hook revalidate presente (anche se frontend non ancora implementato)

---

## File attesi

```
src/collections/MediaWorks.ts
src/collections/Reviews.ts
src/collections/Tags.ts
src/collections/Media.ts
src/globals/SiteSettings.ts
src/collections/hooks/revalidateReview.ts
src/migrations/YYYYMMDD_*.ts
src/payload-types.ts
```
