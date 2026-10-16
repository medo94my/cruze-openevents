# Cruze Events

Cruze is a Qatar event discovery and ticketing application, forked from Eyevinn OpenEvents. Cruze staff curate events; customers browse, book and check in. It is not an organizer marketplace.

## Current stack

- Next.js 16.1.6 App Router, React 19.2.3, TypeScript and Tailwind CSS 4.
- NextAuth v4 credentials login, bcrypt passwords, email verification and database-backed role checks.
- Neon PostgreSQL through Prisma 6; Vercel hosting and Vercel Blob event/speaker images.
- Optional ioredis rate limiting/cache helpers, Nodemailer SMTP, Stripe and simulated payment adapters.
- Vitest tests in `src/__tests__/`.

Qatar conventions: QAR, Asia/Qatar and Friday/Saturday weekends. Arabic/RTL is a requirement, not a completed application-wide feature.

## Documentation

| Guide | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Repository rules and production boundaries |
| [Setup](docs/SETUP.md) | Isolated local development |
| [Architecture](docs/ARCHITECTURE.md) | Current code paths, data model and known gaps |
| [Design](docs/DESIGN.md) | Current visual direction and accessibility requirements |
| [Workflows](docs/WORKFLOWS.md) | Validation and Vercel delivery without GitHub Actions |
| [Email](docs/SETUP_EMAIL.md) | Development logging and SMTP |
| [Storage](docs/SETUP_STORAGE.md) | Blob uploads and legacy S3 routes |
| [Contributing](CONTRIBUTING.md) | Branches, reviews and database changes |

`SIMPLIFICATION_PLAN.md` and `docs/OpenEvents Organizer Guide.pdf` are historical upstream material, not current setup or release instructions. See the current guides before following them.

## Local development

Use Node.js 24.x to match the inspected Vercel project and a separate disposable PostgreSQL database.

```bash
git clone https://github.com/medo94my/cruze-openevents.git
cd cruze-openevents
npm ci
cp .env.example .env.local
# Configure only your own disposable development services.
npx prisma generate
npm run dev
```

Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` locally. Prisma CLI environment loading differs from Next.js: ensure the development database variable is supplied to Prisma commands explicitly through your local shell/environment tooling. See [Setup](docs/SETUP.md).

## Checks

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Run appropriate checks locally; GitHub Actions credits are exhausted and Actions must not be a dependency for validation or deployment. Report actual results and skipped checks. No current passing-test count is asserted by these docs.

## Vercel deployment

The connected project is `cruze-openevents-demo` in `medo94mys-projects`, with domain https://cruze-openevents-demo.vercel.app. Inspection on 2026-10-16 found a READY production deployment for main commit `c2667ba5998603f28c0fa1674b726193d8fdad62`. READY confirms deployment status, not working payments or bookings. Vercel deployment protection may require authentication.

Use the existing Vercel Git integration or an explicitly authorized Vercel CLI deployment; neither requires a GitHub Actions runner. Keep substantive changes in a branch/PR. Production merges, deployments and migrations require explicit approval. See [Workflows](docs/WORKFLOWS.md).

The build script generates Prisma Client and builds Next.js; it does not deploy migrations. `npm start` runs `prisma migrate deploy` before starting Next.js, so it is not a harmless smoke-test command against a production database. Do not assume Vercel executes this start script.

## Known implementation gaps

These are source observations, not a claim that a live transaction was tested:

- Demo events have `demo-` slugs. Public detail/checkout and order code can create or refresh demo events/ticket stock; demo checkout is currently reachable. Fictional events must not be represented as genuine or charged for.
- If Stripe is unavailable, the registry falls back to a stub without a production-only exclusion. The stub reports payment success; this is not proof of payment. Payment method records still use the legacy `PAYPAL` enum for Stripe/stub flows.
- Order creation uses a serializable transaction and ticket-row locks, but creates pending orders with `expiresAt = null`. Do not assume automatic reservation expiry.
- Invoice-code order creation currently marks orders PAID and issues tickets, while the pay route also supports PENDING_INVOICE. These paths need reconciliation.
- Stripe webhooks verify signatures, but do not visibly reconcile session amount/currency/payment identity against the order before fulfillment.
- QR check-in reads status then updates it; atomic replay prevention and event-specific staff authorization need verification. Global security headers currently disable camera access.
- Redis integration and SMTP delivery require separate verification. Rate limits fail open when Redis is unavailable.
- Cleanup/reminder endpoints accept requests if their configured token is absent. No checked-in Vercel cron schedule exists.
- Inherited schema defaults still include SEK, UTC and 25% VAT. Do not use them as Qatar business rules.
- The customer interface currently uses dark charcoal, cream and orange; older maroon design descriptions are historical.

See [Architecture](docs/ARCHITECTURE.md) for source references. This documentation update does not remediate application behavior.

## License

MIT; see [LICENSE](LICENSE). Upstream attribution is retained; upstream services and credentials are not Cruze resources.
