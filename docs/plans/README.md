# Piani di implementazione — EdArEview

Indice dei piani operativi. La panoramica di prodotto resta in [ROADMAP.md](../ROADMAP.md).

## Ordine di esecuzione

| # | Piano | Stato | Branch | Durata |
|---|-------|-------|--------|--------|
| 0–1 | [Foundation](phase-0-1-foundation.md) | ✅ | `chore/foundation` | 1–1.5 gg |
| 2 | [CMS schema & admin](phase-2-cms-schema.md) | ✅ | `feat/cms-schema` | 1–2 gg |
| 3 | [Metadata APIs](phase-3-metadata-apis.md) | ✅ | `feat/metadata-import` | 2 gg |
| 4 | [Frontend MVP](phase-4-frontend-mvp.md) | ✅ | `feat/frontend-mvp` | 2–3 gg |
| 5 | [Discoverability](phase-5-discoverability.md) | ✅ | `feat/search-seo` | 1–2 gg |
| 6 | [Production](phase-6-production.md) | ✅ | `chore/go-live` | ½ gg |
| 7 | [RSS, liste & stats](phase-7-editorial-stats.md) | ✅ | `feat/phase-7-rss-lists-stats` | 1–2 gg |
| 8 | [Similar works & Sentry](phase-8-similar-sentry.md) | ✅ | `feat/phase-8-similar-sentry` | 1 gg |

> **Nota ordine:** Fase 4 prima di Fase 3 — il sito pubblico è utilizzabile anche con catalogo inserito manualmente da admin; l'import API accelera ma non blocca.

**Live:** https://edareview.vercel.app — checklist [GO-LIVE.md](../GO-LIVE.md)

## Percorsi alternativi

### MVP minimo (3–4 giorni part-time)

1. Foundation → CMS schema → Frontend MVP (senza metadata import) → Production base

### Percorso completo (7–10 giorni part-time)

Tutte le fasi in ordine tabella.

## Playbook agenti

Vedi [AGENT-PLAYBOOK.md](../AGENT-PLAYBOOK.md) per workflow branch → PR → deploy Vercel.

## Backlog (post-MVP)

Non ha piano dedicato; voci in [ROADMAP.md § Fase 7](../ROADMAP.md#fase-7--backlog-post-mvp).
