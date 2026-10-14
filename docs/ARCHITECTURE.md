# Cruze Events — Architecture

This is a Next.js/TypeScript event discovery and ticketing application, forked from Eyevinn OpenEvents. Cruze is operated by one internal administrator/team. Customers discover and eventually book Qatar events. The demo is **not** a fully validated production ticketing service.

## Runtime topology

- **Frontend:** Next.js App Router, React, Tailwind CSS, English/Arabic UI.
- **Server:** Next.js API route handlers for events, authentication, bookings, tickets and media.
- **Database:** Prisma ORM with isolated Neon PostgreSQL. Schema: `prisma/schema.prisma`. Migrations: `prisma/migrations/`.
- **Authentication:** NextAuth credential login, email verification, role checks in `src/lib/auth/`.
- **Images:** Vercel Blob client uploads through `src/app/api/upload/blob/route.ts`. Some legacy S3 handlers remain from upstream.
- **Infrastructure:** Vercel deployment, Neon database, Vercel Blob; separately provisioned Redis still needs end-to-end integration checks.
- **Notifications and payment:** development emails are not delivered; no verified Qatar payment integration. Never infer working production payments from inherited Stripe code.

## Primary code locations

| Feature | Path |
| --- | --- |
| Homepage | `src/app/page.tsx` and `src/components/landing/CruzeHome.tsx` |
| Customer listing and details | `src/app/(public)/events/` |
| Staff event editor | `src/components/events/EventForm.tsx`, `src/app/(dashboard)/` |
| APIs | `src/app/api/` |
| Business logic | `src/lib/` |
| Database model | `prisma/schema.prisma` |

## Event workflow

1. Authorized staff create a draft event and event image.
2. Staff set schedule, location, ticket types and stock, then publish.
3. Customers browse public upcoming events. Site defaults to Qatar.
4. Booking must reserve inventory atomically and validate capacity.
5. Verified sandbox/production payment webhooks must process orders idempotently.
6. A paid or otherwise authorized order can issue a validated QR ticket.
7. Staff perform server-validated, replay-resistant check-in.

Steps 4–7 are **acceptance criteria**, not claims of currently working production flows.

## Qatar requirements

- **QAR** currency; backend verifies payment-provider capabilities, rounding and price integrity.
- **Asia/Qatar** display timezone; UTC timestamps in storage; Friday/Saturday weekend.
- English/Arabic/RTL. Keep user-entered content intact unless separately translated.
- Some inherited Swedish code may use 25% VAT or SEK; audit before accepting money.

## Demo safeguards

Current database contains clearly labeled *fictional* `demo-` events used to review the UI. Tickets to demo listings must remain unsellable. Do not assume the upstream seed file is safe: it creates unrelated data and known-password example accounts. Only run disposable, dedicated test seeding.

## Non-negotiable safety

Use environment-managed secrets, never commit credentials. Require the user's approval for production migrations, data changes, deployments, payment activation and real messages. Do not access upstream OSC infrastructure. Never run database reset or database push on production.

For coding standards, read [AGENTS.md](../AGENTS.md). For visual work, read [DESIGN.md](DESIGN.md). For safe validation and deployment, read [WORKFLOWS.md](WORKFLOWS.md).
