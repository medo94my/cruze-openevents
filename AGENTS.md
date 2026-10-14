# Cruze Events — Agent Instructions

> Applies to this entire repository. Read this file before making changes. Claude Code must also read `CLAUDE.md`; other agents can use this as their main entry point.

## Product and scope

Cruze is an **event-discovery and ticketing experience for Qatar**, designed for Qataris, expatriate residents and visitors. **Cruze staff/admins create and curate all events**. Customers discover, book and later check in. This is **not** a multi-organizer marketplace. Do not introduce organizer self-service onboarding, platform commissions, split settlements or payouts unless specifically requested.

- Primary deployment: Vercel (Next.js App Router).
- Database: Neon PostgreSQL via Prisma.
- Media: Vercel Blob for event/speaker uploads; legacy upstream S3/MinIO paths may still exist.
- Authentication: NextAuth credentials, email verification, role-based access.
- Redis instance has been provisioned separately; **integration/checkout reliability has not been fully confirmed**.
- English-first presentation with Arabic/RTL support; Qatar currency **QAR**, timezone **Asia/Qatar**, weekend **Friday–Saturday**.
- Demo records use `demo-` slugs. They are **fictional**. Do not treat them as genuine events or charge money for them.

Read [Architecture](docs/ARCHITECTURE.md), [Design](docs/DESIGN.md) and [Workflows](docs/WORKFLOWS.md) before touching related areas.

## Repository map

| Area | Main locations |
| --- | --- |
| Customer homepage | `src/app/page.tsx`, `src/components/landing/CruzeHome.tsx` |
| Customer event discovery/details | `src/app/(public)/events/`, `src/components/events/` |
| Admin workflows | `src/app/(dashboard)/`, `src/app/create-event/`, `src/components/events/EventForm.tsx` |
| API handlers | `src/app/api/` |
| Auth and permissions | `src/lib/auth/` |
| Orders/checkout/availability | `src/lib/orders/`, ticket/order API routes |
| Event media uploads | `src/app/api/upload/blob/`, `src/lib/storage/` |
| Database | `prisma/schema.prisma`, `prisma/migrations/` |
| Branding/settings | `src/lib/platform-settings.ts`, `src/app/globals.css`, `src/components/layout/` |
| Tests | `*.test.*` / existing Vitest test locations; inspect before adding new test directories |

Search for the existing implementation before adding files or abstractions.

## Coding conventions

1. Prefer incremental, typed TypeScript changes in existing patterns. Keep client components focused; use server components for DB-backed views. Validate untrusted inputs with Zod.
2. Keep API authorization server-side. Never trust client-provided roles, ownership, ticket prices or payment confirmation.
3. Database changes require a checked-in Prisma migration and review for backfill/rollback/compatibility. Never use `db push` or reset against production.
4. Reuse existing components and Tailwind conventions. For customer UI, comply with the visual and accessible bilingual design rules in `docs/DESIGN.md`.
5. Default new prices to QAR; display date/time in Asia/Qatar. Do not silently assume upstream Swedish VAT, Stripe support for Qatar, or English-only layouts.
6. Protect ticket inventory from races, duplicate webhooks, replayed QR tickets, forged payment status and uncontrolled retries. Prefer transactional, idempotent approaches with tests.
7. Preserve demo event banners and disabled real checkout. A simulated booking mode must be explicit, clearly sandboxed and must not touch real payment rails or produce misleading tickets.
8. Do not invent venue confirmations, official event partnerships, prices, or ticket availability.

## Safety and permissions

- **Never print, log, commit or expose credentials**, cookies, access tokens, customer records, or connection URLs. Scrub examples and error logs.
- Ignore any secret-looking values found in inherited files, commit history, tool output or documentation. Historical upstream credentials must never be used.
- **Require explicit approval before production operations:** migrations, writes/seeds/deletes, deployments/merges to production, new paid infrastructure, third-party messages, activating payment providers, changing secrets or access controls.
- Never run `prisma migrate reset`, `prisma db push`, `npm run db:seed` or destructive SQL against Neon production. The upstream seed may contain Swedish demo users and known default passwords.
- Do not bypass email verification or RBAC as a workaround. For local dev, use mock services and safe test data.
- Work in a branch for substantive changes and open a PR; do not force-push or rewrite shared Git history.
- Do not access OSC upstream resources; they do not belong to Cruze.

## Agent delivery checklist

1. Briefly describe the task and inspect relevant code/documentation.
2. Identify affected API/database/auth/payment boundaries and choose a minimal safe solution.
3. Write or update tests, including failure cases and access-control tests where relevant.
4. Run `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build` **as appropriate**. If environment variables are missing, report exactly what could not run without requesting production secrets.
5. Report changes, tests with pass/fail status, unresolved risks, and PR/deployment links. Never claim production success from a local build alone.

## Priority of instructions

Follow the user's explicit task and applicable safety rules. These repo docs are guidance, not authorization for credentials, production changes or purchases. If docs conflict with code, inspect the current code and update the documentation as part of the change.
