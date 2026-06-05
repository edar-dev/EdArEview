# Overview implementazione — EdArEview

Diagramma delle fasi, dipendenze e deliverable.

## Timeline

```mermaid
gantt
    title EdArEview — Piano implementazione
    dateFormat  YYYY-MM-DD
    section Foundation
    Fase 0-1 Scaffold + Vercel/Neon     :f01, 2026-06-06, 1.5d
    section Backend
    Fase 2 CMS schema                   :f2, after f01, 2d
    section Frontend
    Fase 4 Frontend MVP                 :f4, after f2, 3d
    section Integrations
    Fase 3 Metadata APIs                :f3, after f4, 2d
    section Polish
    Fase 5 Search & SEO                 :f5, after f4, 2d
    section Launch
    Fase 6 Production                   :f6, after f5, 0.5d
```

> Fase 3 può sovrapporsi parzialmente a Fase 5 se due persone lavorano in parallelo; in solitaria: 4 → 3 → 5 → 6.

## Dipendenze

```mermaid
flowchart TD
    F01[Fase 0-1 Foundation]
    F2[Fase 2 CMS Schema]
    F4[Fase 4 Frontend MVP]
    F3[Fase 3 Metadata APIs]
    F5[Fase 5 Discoverability]
    F6[Fase 6 Production]

    F01 --> F2
    F2 --> F4
    F2 --> F3
    F4 --> F5
    F4 --> F3
    F5 --> F6
    F3 --> F6
```

## Deliverable per fase

| Fase | Deliverable chiave | URL / artefatto |
|------|-------------------|-----------------|
| 0–1 | App deployata, admin vuoto | `*.vercel.app/admin` |
| 2 | Modello dati, contenuto manuale | Neon DB popolato |
| 4 | Sito pubblico navigabile | `/`, `/anime/...` |
| 3 | Import da AniList/TMDB/IGDB | Field admin search |
| 5 | Filtri, OG, sitemap | `/sitemap.xml`, share preview |
| 6 | Dominio custom live | `edareview.*` |

## Percorsi

### Path A — MVP veloce (senza import API)

`0-1 → 2 → 4 → 6` — ~5 giorni part-time

### Path B — Completo

`0-1 → 2 → 4 → 3 → 5 → 6` — ~8-10 giorni part-time

### Path C — Solo admin personale (no sito pubblico)

`0-1 → 2 → 3` — catalogo privato via Payload; utile se il frontend può attendere.

## Metriche di successo MVP

| Metrica | Target |
|---------|--------|
| Tempo inserimento recensione | < 5 min con import API |
| Tempo inserimento manuale | < 10 min |
| Pagine indicizzabili | Homepage + listing + dettagli |
| Uptime | Vercel + Neon free tier |
| Costo mensile | €0 (escluso dominio) |

## Riferimenti

- [README piani](README.md)
- [ROADMAP](../ROADMAP.md)
- [AGENT-PLAYBOOK](../AGENT-PLAYBOOK.md)
