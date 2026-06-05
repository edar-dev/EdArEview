# Fase 4 — Frontend pubblico MVP

**Branch suggerito:** `feat/frontend-mvp`  
**Durata stimata:** 2–3 giorni  
**Dipende da:** [phase-2-cms-schema.md](phase-2-cms-schema.md)  
**Nota:** eseguire **prima** di Fase 3 (metadata import)

## Obiettivo

Sito pubblico navigabile: homepage, listing per tipo, scheda opera + recensione, archivio recensioni. Design responsive con dark mode e branding EdArEview.

---

## Design system

### Setup shadcn/ui

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge separator input
```

### Tema EdArEview — `src/app/globals.css`

| Token | Valore suggerito |
|-------|------------------|
| Primary | Rosso/coral `#E63946` (richiama la R del logo) |
| Background dark | `#0F0F12` |
| Background light | `#FAFAFA` |
| Font heading | Geist o Inter |
| Font body | Inter |

Logo/wordmark: **Ed**A**r**Eview con la R evidenziata (CSS `span.logo-r`).

### Layout — `src/app/(frontend)/layout.tsx`

- Header: logo, nav link (Anime, Manga, TV, Film, Giochi, Recensioni)
- Footer: bio da SiteSettings, social links
- Theme toggle (dark/light) — `next-themes`

---

## Data fetching

Usare Payload Local API in Server Components:

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const reviews = await payload.find({
  collection: 'reviews',
  where: { status: { equals: 'published' } },
  sort: '-publishedAt',
  depth: 2, // popola mediaWork
})
```

Helper condiviso: `src/lib/payload/queries.ts`

| Funzione | Uso |
|----------|-----|
| `getPublishedReviews(limit?, page?)` | Homepage, archivio |
| `getReviewsByMediaType(type)` | Listing per tipo |
| `getMediaWorkBySlug(type, slug)` | Dettaglio |
| `getSiteSettings()` | Layout |

---

## Pagine

### `/` — Homepage

`src/app/(frontend)/page.tsx`

- Hero con `SiteSettings.homepageIntro`
- Griglia ultime 6 recensioni (card: cover, titolo, rating, tipo, data)
- Chip filtro rapido per `mediaType` (link a listing)
- Stato vuoto: "Nessuna recensione ancora"

### `/[type]` — Listing

`src/app/(frontend)/[type]/page.tsx`

- `type` ∈ `anime | manga | tv | movie | games` (alias: `games` → mediaType `game`)
- Griglia card opere che hanno almeno una review pubblicata
- Ordinamento default: `publishedAt` desc
- `generateStaticParams` per tipi noti (ISR)

### `/[type]/[slug]` — Dettaglio

`src/app/(frontend)/[type]/[slug]/page.tsx`

- Sezione opera: cover, titolo, anno, generi, link esterni (da metadata se presente)
- Sezione recensione: rating (stelle o `/10`), watchStatus badge, spoiler warning
- Body Lexical → componente `RichText` (`@payloadcms/richtext-lexical/react`)
- `notFound()` se slug inesistente o non pubblicato

### `/reviews` — Archivio

`src/app/(frontend)/reviews/page.tsx`

- Lista cronologica tutte le recensioni
- Card compatta: titolo, opera, rating, data, tag

---

## Componenti

| Componente | Path |
|------------|------|
| `ReviewCard` | `src/components/ReviewCard.tsx` |
| `MediaWorkHeader` | `src/components/MediaWorkHeader.tsx` |
| `RatingBadge` | `src/components/RatingBadge.tsx` |
| `SpoilerBanner` | `src/components/SpoilerBanner.tsx` |
| `RichText` | `src/components/RichText.tsx` |
| `SiteHeader` | `src/components/SiteHeader.tsx` |
| `SiteFooter` | `src/components/SiteFooter.tsx` |
| `ThemeToggle` | `src/components/ThemeToggle.tsx` |

### Rating display

- `9.0` → "9/10" con colore (verde ≥8, giallo ≥6, rosso <6)
- Opzionale: stelle `rating / 2` su 5

### Spoiler

Se `hasSpoilers`: banner giallo sopra il body + opzione "Mostra spoiler" (client component con stato).

---

## SEO base

Ogni pagina dettaglio:

```ts
export async function generateMetadata({ params }) {
  const work = await getMediaWorkBySlug(...)
  return {
    title: `${work.title} — Recensione | EdArEview`,
    description: excerpt da review body (primi 160 char),
    openGraph: { images: [work.coverUrl] },
  }
}
```

---

## Route groups

```
src/app/
├── (frontend)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [type]/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── reviews/page.tsx
└── (payload)/
    └── admin/...
```

---

## Verifica

### Responsive

- [ ] Mobile 375px — griglia 1 colonna
- [ ] Tablet — 2 colonne
- [ ] Desktop — 3 colonne

### Funzionale

- [ ] Homepage mostra recensioni pubblicate
- [ ] Draft non appare
- [ ] Navigazione tipo → dettaglio funziona
- [ ] Dark mode persiste (localStorage)
- [ ] 404 su slug inesistente

### Performance

- [ ] Immagini cover via `next/image` con domini esterni configurati in `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { hostname: 's4.anilist.co' },
    { hostname: 'image.tmdb.org' },
    { hostname: 'images.igdb.com' },
    // Vercel Blob hostname
  ],
},
```

---

## Definition of Done

- [ ] 4 route pubbliche funzionanti
- [ ] Contenuto da admin visibile sul sito
- [ ] Dark mode + layout responsive
- [ ] `generateMetadata` su dettaglio
- [ ] Branding EdArEview applicato

---

## File attesi

```
src/app/(frontend)/layout.tsx
src/app/(frontend)/page.tsx
src/app/(frontend)/[type]/page.tsx
src/app/(frontend)/[type]/[slug]/page.tsx
src/app/(frontend)/reviews/page.tsx
src/components/*.tsx
src/lib/payload/queries.ts
src/app/globals.css
components.json (shadcn)
next.config.ts (images remotePatterns)
```
