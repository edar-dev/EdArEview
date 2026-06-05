# Fase 5 — Ricerca, filtri & discoverability

**Branch suggerito:** `feat/search-seo`  
**Durata stimata:** 1–2 giorni  
**Dipende da:** [phase-4-frontend-mvp.md](phase-4-frontend-mvp.md)

## Obiettivo

Trovare contenuti rapidamente (filtri + ricerca), migliorare condivisione social (OG images) e indicizzazione (sitemap, robots).

---

## Filtri listing

### Query params su `/[type]` e `/reviews`

| Param | Tipo | Esempio |
|-------|------|---------|
| `q` | string | ricerca titolo |
| `minRating` | number | `7` |
| `year` | number | `2024` |
| `status` | WatchStatus | `completed` |
| `tag` | slug | `isekai` |
| `sort` | enum | `date`, `rating`, `title` |
| `page` | number | paginazione |

### UI — `src/components/FilterBar.tsx`

- Client component con `useSearchParams` + `useRouter`
- Select ordinamento, slider rating minimo, input anno
- Tag cloud da collection Tags (top N usati)

### Backend — estendere `queries.ts`

```ts
export async function searchReviews(filters: ReviewFilters) {
  const where: Where = { status: { equals: 'published' } }
  if (filters.minRating) where.rating = { greater_than_equal: filters.minRating }
  if (filters.q) where.or = [
    { title: { contains: filters.q } },
    { 'mediaWork.title': { contains: filters.q } },
  ]
  // ...
}
```

---

## Ricerca full-text

### Opzione A — Payload `where` con `contains` (MVP)

Sufficiente per <500 recensioni. Già coperto dai filtri sopra.

### Opzione B — Postgres full-text (se serve scala)

Migration custom:

```sql
ALTER TABLE reviews ADD COLUMN search_vector tsvector;
CREATE INDEX reviews_search_idx ON reviews USING GIN(search_vector);
```

Hook `afterChange` su Reviews per aggiornare `search_vector` da title + plain text body.

**Raccomandazione:** iniziare con Opzione A; passare a B solo se lente.

---

## Paginazione

- 12 item per pagina su listing
- Componente `Pagination` shadcn
- `payload.find({ page, limit: 12 })`
- URL: `?page=2` (bookmarkable)

---

## Open Graph images

### `src/app/api/og/route.tsx`

Usare `next/og` (`ImageResponse`):

```
GET /api/og?title=...&rating=9&type=anime&cover=...
```

Layout 1200×630:
- Background gradient brand
- Cover thumbnail (se URL valido)
- Titolo opera + rating grande
- "EdArEview" wordmark

Collegare in `generateMetadata`:

```ts
openGraph: {
  images: [`/api/og?${params}`],
},
```

---

## Sitemap & robots

### `src/app/sitemap.ts`

```ts
export default async function sitemap() {
  const works = await getAllPublishedMediaWorks()
  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    ...works.map(w => ({
      url: `${baseUrl}/${w.mediaType}/${w.slug}`,
      lastModified: w.updatedAt,
    })),
    { url: `${baseUrl}/reviews`, changeFrequency: 'daily' },
  ]
}
```

### `src/app/robots.ts`

```ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

Escludere `/admin` implicitamente (non linkato, `noindex` su layout payload se necessario).

---

## RSS (opzionale in questa fase)

`src/app/feed.xml/route.ts` — ultime 20 recensioni. Se tempo insufficiente → backlog Fase 7.

---

## Verifica

- [ ] Filtro `minRating=8` riduce risultati correttamente
- [ ] Ricerca `q=frieren` trova opera
- [ ] Paginazione mantiene filtri in URL
- [ ] `/sitemap.xml` valido (Google Search Console test)
- [ ] `/robots.txt` corretto
- [ ] Condivisione link → preview OG su Discord/Twitter/Slack
- [ ] Lighthouse SEO ≥ 90 su homepage

---

## Definition of Done

- [ ] FilterBar su listing e archivio
- [ ] Paginazione funzionante
- [ ] OG image route
- [ ] sitemap.ts + robots.ts
- [ ] `NEXT_PUBLIC_SITE_URL` impostato su Vercel prod

---

## File attesi

```
src/components/FilterBar.tsx
src/components/Pagination.tsx
src/lib/payload/queries.ts (esteso)
src/app/api/og/route.tsx
src/app/sitemap.ts
src/app/robots.ts
```
