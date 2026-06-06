# Fase 6 — Produzione & go-live

**Branch suggerito:** `chore/go-live`  
**Durata stimata:** ½ giornata  
**Dipende da:** [phase-5-discoverability.md](phase-5-discoverability.md)

## Obiettivo

Dominio custom, deploy produzione stabile, smoke test completi, monitoraggio base.

---

## Checklist pre-produzione

### Env Vercel Production

| Variabile | Presente |
|-----------|----------|
| `DATABASE_URL` | Neon production branch |
| `PAYLOAD_SECRET` | Univoco, ≥32 char |
| `BLOB_READ_WRITE_TOKEN` | Blob store prod |
| `TMDB_API_KEY` | Se Fase 3 completata |
| `TWITCH_CLIENT_ID/SECRET` | Se Fase 3 completata |
| `NEXT_PUBLIC_SITE_URL` | URL dominio finale |

### Neon

- [ ] Branch `main` (production) separato da branch dev
- [ ] Regione `eu-central-1`
- [ ] Backup: snapshot manuale pre-go-live (1 snapshot free)

### Sicurezza

- [ ] `/admin` protetto da login Payload
- [ ] Nessun endpoint metadata esposto senza auth admin
- [ ] `PAYLOAD_SECRET` diverso tra preview e production
- [ ] CORS non necessario (same-origin)

---

## Dominio custom

### Vercel

1. Project Settings → Domains → Add `edareview.<tld>` (o dominio scelto)
2. DNS: record CNAME/A come indicato da Vercel
3. Aggiornare `NEXT_PUBLIC_SITE_URL` su Production
4. Redeploy

### MCP

`user-vercel` → `check_domain_availability_and_price` se dominio non ancora acquistato.

---

## Deploy produzione

```bash
git checkout main
git pull
# Verifica CI verde
# Merge ultima PR se necessario
```

Vercel deploy automatico su push `main`.

### Verifica build log

- [ ] `payload migrate` OK
- [ ] `next build` OK
- [ ] Nessun warning env mancante

---

## Smoke test produzione

| # | Test | URL |
|---|------|-----|
| 1 | Homepage carica | `/` |
| 2 | Listing anime | `/anime` |
| 3 | Dettaglio recensione | `/anime/{slug}` |
| 4 | Archivio | `/reviews` |
| 5 | Admin login | `/admin` |
| 6 | Crea bozza → pubblica → visibile su / | admin + / |
| 7 | Import metadata (se Fase 3) | admin |
| 8 | OG image | link condivisione |
| 9 | sitemap | `/sitemap.xml` |
| 10 | Dark mode | toggle |

### Cold start Neon

- [ ] Prima visita dopo 10 min idle: accettabile (<5s)
- [ ] Se troppo lento: valutare disabilitare scale-to-zero (piano Launch) — backlog

---

## Monitoraggio base

### Vercel

- Analytics (free) abilitato
- Runtime logs per errori 500

### Opzionale — Sentry

Se errori in produzione difficili da debuggare:

```bash
pnpm add @sentry/nextjs
```

Env: `SENTRY_DSN` — backlog se non urgente.

---

## Neon branch per preview (opzionale)

Per allineare DB preview alle PR:

1. Neon Console → Create branch `preview/pr-{n}` da template
2. Vercel Preview env `DATABASE_URL` → branch specifico
3. Automazione futura via GitHub Action + Neon API

Non bloccante per go-live iniziale.

---

## Post go-live

### Documentazione

- [x] Aggiornare README: URL produzione
- [x] ROADMAP: checkbox Fase 6 (dominio custom rinviato)
- [x] `docs/plans/README.md`: stato fasi
- [x] `docs/GO-LIVE.md`: checklist env + smoke test

### Comunicazione

- Aggiornare bio/link social in SiteSettings con URL live (`https://edareview.vercel.app`)

---

## Definition of Done

- [x] Sito live su HTTPS (`https://edareview.vercel.app`; dominio custom rinviato)
- [x] Smoke test automatici (homepage, listing, sitemap, OG, robots, admin)
- [x] Env production documentati in GO-LIVE.md (non in git)
- [x] README con link live
- [x] CI GitHub funzionante (fix action versions + pnpm 10)

---

## Rollback

Se deploy fallisce:

1. Vercel → Deployments → Promote previous deployment
2. Neon: ripristino snapshot se migration ha causato problemi
3. Non fare `payload migrate` rollback automatico — preparare migration down manualmente se necessario
