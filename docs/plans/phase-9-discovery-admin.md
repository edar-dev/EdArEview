# Fase 9 — Discovery & admin

**Branch suggerito:** `feat/phase-9-discovery-admin`  
**Durata stimata:** 1–2 giorni  
**Dipende da:** [phase-8-similar-sentry.md](phase-8-similar-sentry.md)

## Obiettivo

Ampliare scoperta contenuti, import catalogo e pagine editoriali pubbliche.

---

## Import metadata (MAL, Steam, Letterboxd)

Estensione ricerca admin `/api/metadata/search`:

| Tipo media | Sorgenti |
|------------|----------|
| Anime / Manga | AniList + **MAL** (Jikan API) |
| Film | TMDB + **Letterboxd** (autocomplete) |
| Game | IGDB + **Steam** (store search) |

- Nuovi valori `externalSource`: `mal`, `steam`, `letterboxd`
- Client in `src/lib/metadata/{mal,steam,letterboxd}.ts`
- Merge e dedup in `searchMetadata()`

---

## Watchlist pubblica

- Campo `watchStatus` su `MediaWork` (stati pubblici: `planned`, `watching`, `on_hold`)
- Override opzionale su `Review` (priorità recensione se presente)
- Pagina `/watchlist` con sezioni per stato
- Revalidate su publish/unpublish

---

## Pagina About

- Campo `aboutPage` (richText) su global `SiteSettings`
- Pagina `/about` con avatar, tagline, bio fallback, social links
- In sitemap

---

## Ricerca full-text Postgres

- Colonna `reviews.search_vector` (`tsvector`, config `italian`)
- Indice GIN `reviews_search_vector_idx`
- Hook `afterChange` su Reviews aggiorna vettore (titolo + body plain text)
- `buildReviewWhere()` usa `plainto_tsquery` + fallback `contains` su titolo opera

---

## Confronto opere

- Pagina `/compare?a={type}/{slug}&b=...`
- Selettore opere pubblicate + vista side-by-side (generi, tag, voto, anno)
- `ComparePicker` (client) + `CompareView` (server)

---

## Migration

`20260607_120000_phase9_discovery_admin.ts`:

- Enum `external_source` + valori MAL/Steam/Letterboxd
- `media_works.watch_status`
- `reviews.search_vector` + backfill titoli
- `site_settings.about_page`

---

## Definition of Done

- [x] Import MAL / Steam / Letterboxd in admin
- [x] `/watchlist` pubblica
- [x] `/about` con contenuto da Site Settings
- [x] Full-text search su `/reviews?q=`
- [x] `/compare` side-by-side
- [x] Nav header + sitemap aggiornati
- [x] `pnpm lint` verde
- [ ] Migration applicata su Neon production (post-merge)
- [ ] Smoke test produzione
