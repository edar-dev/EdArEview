# Fase 7 — RSS, liste editoriali & statistiche

**Branch suggerito:** `feat/phase-7-rss-lists-stats`  
**Durata stimata:** 1–2 giorni  
**Dipende da:** [phase-6-production.md](phase-6-production.md)

## Obiettivo

Fidelizzazione lettori (RSS), identità editoriale (liste curate) e contenuto distintivo (statistiche catalogo).

---

## Deliverable

| Feature | Route | Admin |
|---------|-------|-------|
| Feed RSS recensioni | `/feed.xml` | — |
| Liste editoriali | `/lists`, `/lists/[slug]` | Collection `editorial-lists` |
| Statistiche | `/stats?year=` | — (calcolo da recensioni) |

---

## RSS

- Route `GET /feed.xml` — ultime 30 recensioni pubblicate
- Link in footer + `atom:link` self
- Revalidate su publish review

## Liste editoriali

- Collection Payload con titolo, slug, descrizione, voci ordinate (relationship → review)
- Flag `featured` per homepage
- Sitemap + nav header

## Statistiche

- Totale recensioni, voto medio
- Distribuzione per tipo media, anno pubblicazione, anno opera, tag top
- Filtro `?year=` per “year in review”

---

## Definition of Done

- [x] Collection `editorial-lists` + migration
- [x] `/feed.xml` valido (RSS 2.0)
- [x] `/lists` e `/lists/[slug]` pubblici
- [x] `/stats` con filtri anno
- [x] Nav + footer + sitemap aggiornati
- [x] ROADMAP Fase 7 completata
