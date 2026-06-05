# Security Policy

## Segnalazioni

Questo è un progetto personale. Per problemi di sicurezza, apri una [issue privata](https://github.com/edar-dev/EdArEview/security/advisories/new) su GitHub oppure contatta il maintainer direttamente.

## Buone pratiche nel repo

- **Mai** committare `.env`, chiavi API o `PAYLOAD_SECRET`
- Usare solo `.env.example` come template (senza valori reali)
- Chiavi TMDB, Twitch/IGDB e Neon restano in Vercel Environment Variables
- Rotazione periodica di `PAYLOAD_SECRET` se compromesso

## Dipendenze

Dependabot apre PR settimanali per aggiornamenti npm e GitHub Actions.
