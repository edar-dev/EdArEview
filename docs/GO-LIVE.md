# EdArEview — Go-live checklist

**Produzione attuale:** https://edareview.vercel.app  
**Admin:** https://edareview.vercel.app/admin  
**Ultimo aggiornamento:** Giugno 2026

---

## Env Vercel Production

| Variabile | Stato |
|-----------|--------|
| `DATABASE_URL` | OK (Neon, Production + Preview) |
| `PAYLOAD_SECRET` | OK (Production + Preview globale) |
| `BLOB_READ_WRITE_TOKEN` | OK |
| `TMDB_API_KEY` | OK (Production + Development) |
| `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | OK (Production + Development) |
| `NEXT_PUBLIC_SITE_URL` | OK → `https://edareview.vercel.app` |
| `NEXT_PUBLIC_SERVER_URL` | OK (fallback legacy) |
| `SENTRY_DSN` | Da configurare (Fase 8 — opzionale) |

Preview: `PAYLOAD_SECRET` su **tutte** le branch Preview (non più per-branch).

### Sentry (Fase 8)

1. Crea progetto su [sentry.io](https://sentry.io) → platform **Next.js**
2. Vercel Production → `SENTRY_DSN` (e opzionale `NEXT_PUBLIC_SENTRY_DSN`)
3. Per source maps leggibili: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
4. Redeploy production

---

## Smoke test produzione

| # | Test | Esito |
|---|------|-------|
| 1 | Homepage `/` | OK — ultime recensioni visibili |
| 2 | Listing manga `/manga` | OK — Fullmetal Alchemist |
| 3 | Dettaglio `/manga/fullmetal-alchemist` | OK |
| 4 | Archivio `/reviews` | OK |
| 5 | Sitemap `/sitemap.xml` | OK — URL canonici |
| 6 | Robots `/robots.txt` | OK — 200 |
| 7 | OG `/api/og?title=EdArEview` | OK — 200 |
| 8 | Admin `/admin` | OK — 200 (login Payload) |
| 9 | Import metadata admin | Manuale — richiede TMDB/Twitch in sessione |
| 10 | Publish → visibile su `/` | Manuale |
| 11 | Dark mode | Manuale — toggle header |

---

## Dominio custom (rinviato)

**Decisione:** nessun dominio custom per ora. URL canonico: `https://edareview.vercel.app` (`NEXT_PUBLIC_SITE_URL` già configurato).

Quando vorrai aggiungerne uno:

1. Vercel → Project **edareview** → Settings → Domains → Add domain
2. Configura DNS (CNAME/A) come indicato da Vercel
3. Aggiorna `NEXT_PUBLIC_SITE_URL` su **Production** con il nuovo URL
4. Redeploy production
5. Verifica HTTPS e sitemap con il nuovo dominio

---

## Neon (consigliato pre-go-live)

- [ ] Snapshot manuale del branch production prima di migration rischiose
- [ ] (Opzionale) Branch Neon dedicato per preview PR

---

## Rollback

1. Vercel → Deployments → **Promote** deployment precedente
2. Neon → Restore snapshot se una migration ha causato problemi
