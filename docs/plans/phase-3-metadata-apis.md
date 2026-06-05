# Fase 3 — Integrazione metadata API

**Branch suggerito:** `feat/metadata-import`  
**Durata stimata:** 2 giorni  
**Dipende da:** [phase-2-cms-schema.md](phase-2-cms-schema.md)

## Obiettivo

Cercare opere su AniList, TMDB e IGDB dall'admin Payload e precompilare `MediaWork` con cover, anno, generi e cache JSON.

---

## Architettura

```
Admin Payload (field component)
        │
        ▼
/api/metadata/search?type=anime&q=...
        │
        ├── lib/metadata/anilist.ts   (anime, manga)
        ├── lib/metadata/tmdb.ts    (tv, movie)
        └── lib/metadata/igdb.ts    (game)
        │
        ▼
Risposta normalizzata MetadataSearchResult[]
        │
        ▼
Admin: selezione → popola form MediaWork
```

### Tipo normalizzato — `src/lib/metadata/types.ts`

```ts
export type MediaType = 'anime' | 'manga' | 'tv' | 'movie' | 'game'
export type ExternalSource = 'anilist' | 'tmdb' | 'igdb'

export interface MetadataSearchResult {
  externalSource: ExternalSource
  externalId: string
  title: string
  titleOriginal?: string
  year?: number
  genres: string[]
  coverUrl?: string
  summary?: string
  raw: Record<string, unknown>
}
```

---

## Client API

### AniList — `src/lib/metadata/anilist.ts`

- Endpoint: `https://graphql.anilist.co`
- Nessuna API key
- Query `Page.media(search:, type: ANIME | MANGA)`
- Rate limit: ~90 req/min — aggiungere debounce in UI

```graphql
query ($search: String, $type: MediaType) {
  Page(page: 1, perPage: 10) {
    media(search: $search, type: $type) {
      id
      title { romaji english native }
      startDate { year }
      genres
      coverImage { large }
      description
    }
  }
}
```

### TMDB — `src/lib/metadata/tmdb.ts`

- Base: `https://api.themoviedb.org/3`
- Header/query: `api_key=${TMDB_API_KEY}`
- Search: `/search/tv`, `/search/movie`
- Immagini: `https://image.tmdb.org/t/p/w500${poster_path}`
- Env: `TMDB_API_KEY`

### IGDB — `src/lib/metadata/igdb.ts`

- Base: `https://api.igdb.com/v4`
- OAuth Twitch: POST `https://id.twitch.tv/oauth2/token`
- Env: `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`
- Cache token in memoria (server) con expiry
- Search: `POST /games` body `search "zelda"; fields name,summary,first_release_date,cover.*,genres.name;`

```ts
// Token cache singleton (server-only)
let cachedToken: { value: string; expiresAt: number } | null = null
```

---

## Route API

### `src/app/api/metadata/search/route.ts`

| Query param | Valore |
|-------------|--------|
| `type` | MediaType |
| `q` | stringa ricerca (min 2 char) |

- Solo `GET`
- Auth: verificare sessione Payload admin **oppure** secret header per dev
- Rate limit semplice (opzionale): max 30 req/min per IP

```ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const q = searchParams.get('q')
  // switch type → client giusto
  return Response.json({ results: normalized })
}
```

### `src/app/api/metadata/import/route.ts` (opzionale)

`POST { externalSource, externalId, mediaType }` → fetch dettaglio completo → ritorna oggetto pronto per MediaWork.

---

## Admin UI — field component

`src/components/admin/MetadataSearchField.tsx`

- Input ricerca + select tipo
- Lista risultati (cover thumbnail, titolo, anno)
- Click → `setValue` su campi MediaWork (title, externalId, coverUrl, metadata, …)
- Registrare come `ui.Field` custom in `MediaWorks` collection:

```ts
{
  name: 'metadataImport',
  type: 'ui',
  admin: {
    components: {
      Field: '@/components/admin/MetadataSearchField',
    },
  },
},
```

---

## Env da aggiungere

| Variabile | Registrarsi su |
|-----------|----------------|
| `TMDB_API_KEY` | https://developer.themoviedb.org |
| `TWITCH_CLIENT_ID` | https://dev.twitch.tv/console |
| `TWITCH_CLIENT_SECRET` | idem |

Aggiornare `.env.example` e env Vercel Preview + Production.

---

## Gestione errori

| Scenario | UX admin |
|----------|----------|
| API down | Toast "Catalogo temporaneamente non disponibile" |
| Nessun risultato | Messaggio inline |
| Duplicato externalId | Payload validation error già in Fase 2 |
| IGDB token scaduto | Refresh automatico |

---

## Verifica

### Per provider

- [ ] AniList: search "Frieren" → risultati anime
- [ ] AniList: search "Berserk" → risultati manga
- [ ] TMDB: search "Breaking Bad" → tv
- [ ] TMDB: search "Inception" → movie
- [ ] IGDB: search "Zelda" → game con cover

### End-to-end

1. Admin → Nuovo MediaWork → cerca → seleziona
2. Campi precompilati, salva
3. Crea Review collegata, pubblica

### Checklist

- [ ] Chiavi API solo server-side (non in bundle client)
- [ ] `metadata` JSON popolato con `raw`
- [ ] Nessuna chiave committata in git

---

## Definition of Done

- [ ] 3 client metadata + route search
- [ ] Field component admin funzionante
- [ ] Import manuale sostituito da import API per tutti e 5 i tipi
- [ ] Env documentati e configurati su Vercel

---

## File attesi

```
src/lib/metadata/types.ts
src/lib/metadata/anilist.ts
src/lib/metadata/tmdb.ts
src/lib/metadata/igdb.ts
src/app/api/metadata/search/route.ts
src/components/admin/MetadataSearchField.tsx
.env.example (aggiornato)
```
