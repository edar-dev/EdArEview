# Fase 8 — Opere simili & Sentry

**Branch suggerito:** `feat/phase-8-similar-sentry`  
**Durata stimata:** 1 giorno  
**Dipende da:** [phase-7-editorial-stats.md](phase-7-editorial-stats.md)

## Obiettivo

Migliorare la scoperta incrociata tra recensioni e monitorare errori in produzione.

---

## Opere simili

Sezione **Opere simili** in fondo a `/[type]/[slug]`:

| Segnale | Peso |
|---------|------|
| Stesso tipo media | +3 |
| Tag condivisi | +2 ciascuno |
| Voto entro ±1.5 | +2 |
| Genere condiviso | +1 ciascuno |
| Stesso anno opera | +1 |

- Minimo score > 0 per comparire
- Max 4 suggerimenti
- Nascosta se nessun match

---

## Sentry

- SDK `@sentry/nextjs` (opzionale via `SENTRY_DSN`)
- `instrumentation.ts` + client/server/edge config
- `global-error.tsx` per errori React
- Source map upload solo se `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT`

### Env Vercel Production

| Variabile | Obbligatoria |
|-----------|--------------|
| `SENTRY_DSN` | Sì (per abilitare) |
| `NEXT_PUBLIC_SENTRY_DSN` | Opzionale (fallback client) |
| `SENTRY_ORG` | Solo per source maps |
| `SENTRY_PROJECT` | Solo per source maps |
| `SENTRY_AUTH_TOKEN` | Solo per source maps |

---

## Definition of Done

- [x] Sezione opere simili su pagina recensione
- [x] Sentry integrato (disattivato senza DSN)
- [x] `.env.example` e GO-LIVE aggiornati
- [x] ROADMAP Fase 8
