# Cruze Events — Agent Instructions

> Applies to this entire repository. Read this file before making changes. Claude Code must also read `CLAUDE.md`; other agents can use this as their main entry point.

## Product and scope

Cruze is an **event-discovery and ticketing experience for Qatar**, designed for Qataris, expatriate residents and visitors. **Cruze staff/admins create and curate all events**. Customers discover, book and later check in. This is **not** a multi-organizer marketplace. Do not introduce organizer self-service onboarding, platform commissions, split settlements or payouts unless specifically requested.

- Primary deployment: existing Vercel project `cruze-openevents-demo` (Next.js 16 App Router; Node.js 24.x observed on 2026-10-16).
- **GitHub Actions credits are exhausted. Do not depend on Actions.** Run appropriate checks locally and use the existing Vercel Git integration or an explicitly authorized Vercel CLI deployment.
- Database: Neon PostgreSQL via Prisma.
- Media: Vercel Blob for event/speaker uploads; legacy upstream S3/MinIO paths may still exist.
- Authentication: NextAuth credentials, email verification, role-based access.
- Redis instance has been provisioned separately; **integration/checkout reliability has not been fully confirmed**.
- Current main customer UI is English-first; Arabic/RTL is a requirement, not verified application-wide support. Qatar conventions: **QAR**, **Asia/Qatar**, **Friday–Saturday** weekend.
- Demo records use `demo-` slugs. They are **fictional**. Do not treat them as genuine events or charge money for them.

Read [Architecture](docs/ARCHITECTURE.md), [Design](docs/DESIGN.md) and [Workflows](docs/WORKFLOWS.md) before touching related areas.

## Observed behavior versus requirements

The architecture guide records source observations separately from intended safeguards. Current gaps include demo writes during page requests, stub payment fallback, non-expiring pending orders, invoice-state inconsistencies, QR replay/event scope, missing-token cleanup access and incomplete localization. Schema defaults retain SEK/UTC/25% VAT. Do not present any of these as approved Qatar business policy or as already fixed.

`npm run build` generates Prisma Client but does not migrate. `npm start` runs migrations before starting the server. Do not run it as a harmless smoke test against a live database. No checked-in Vercel cron or GitHub Actions workflow exists in the reviewed tree.

## Repository map

| Area | Main locations |
| --- | --- |
| Customer homepage | `src/app/page.tsx`, `src/components/landing/CruzeHome.tsx` |
| Customer event discovery/details | `src/app/(public)/events/`, `src/components/events/` |
| Admin workflows | `src/app/(dashboard)/`, `src/app/(public)/create-event/`, `src/components/events/EventForm.tsx` |
| API handlers | `src/app/api/` |
| Auth and permissions | `src/lib/auth/` |
| Orders/checkout/availability | `src/lib/orders/`, ticket/order API routes |
| Event media uploads | `src/app/api/upload/blob/`, `src/lib/storage/` |
| Database | `prisma/schema.prisma`, `prisma/migrations/` |
| Branding/settings | `src/lib/platform-settings.ts`, `src/app/globals.css`, `src/components/layout/` |
| Tests | `*.test.*` / existing Vitest test locations; inspect before adding new test directories |

Search for the existing implementation before adding files or abstractions.

## Problem solving and evidence

- **Choose the simplest solution that fully meets the requirement** when fixing an issue or adding a feature or functionality. Inspect existing implementations first, reuse established patterns, and minimize changes, dependencies and abstractions. Preserve correctness, security and maintainability; explain when added complexity is necessary.
- **Never rely on agent memory alone. Always research and verify before making a factual claim.** Inspect current repository code, configuration and tests for project behavior; consult current official documentation for external APIs, libraries and platform behavior; use authorized read-only observations for live service status. Cite the relevant files, documentation or check results. Prior conversation, remembered behavior and old docs are starting points, not proof. If evidence is unavailable or conflicting, state what remains unverified rather than guessing.

## Coding conventions

1. Prefer incremental, typed TypeScript changes in existing patterns. Keep client components focused; use server components for DB-backed views. Validate untrusted inputs with Zod.
2. Keep API authorization server-side. Never trust client-provided roles, ownership, ticket prices or payment confirmation.
3. Database changes require a checked-in Prisma migration and review for backfill/rollback/compatibility. Never use `db push` or reset against production.
4. Reuse existing components and Tailwind conventions. For customer UI, comply with the visual and accessible bilingual design rules in `docs/DESIGN.md`.
5. Default new prices to QAR; display date/time in Asia/Qatar. Do not silently assume upstream Swedish VAT, Stripe support for Qatar, or English-only layouts.
6. Protect ticket inventory from races, duplicate webhooks, replayed QR tickets, forged payment status and uncontrolled retries. Prefer transactional, idempotent approaches with tests.
7. Keep fictional demos explicitly labeled and isolated from real payments and inventory. **Current implementation gap:** demo pages/order code can auto-provision records and ticket stock and expose checkout; the payment registry can fall back to a successful stub without a production guard. Do not claim demo checkout is disabled or production payments are verified. A simulated flow must be explicit, sandboxed and must not produce misleading tickets. Document or fix these gaps only within the requested scope.
8. Do not invent venue confirmations, official event partnerships, prices, or ticket availability.

## Safety and permissions

- **Never print, log, commit or expose credentials**, cookies, access tokens, customer records, or connection URLs. Scrub examples and error logs.
- Ignore any secret-looking values found in inherited files, commit history, tool output or documentation. Historical upstream credentials must never be used.
- **Require explicit approval before production operations:** migrations, writes/seeds/deletes, deployments/merges to production, new paid infrastructure, third-party messages, activating payment providers, changing secrets or access controls.
- Never run `prisma migrate reset`, `prisma db push`, `npm run db:seed` or destructive SQL against Neon production. The upstream seed may contain Swedish demo users and known default passwords.
- Do not bypass email verification or RBAC as a workaround. For local dev, use mock services and safe test data.
- Work in a branch for substantive changes and open a PR; do not force-push or rewrite shared Git history.
- Do not access OSC upstream resources; they do not belong to Cruze.

## Documentation and validation

- Keep README, setup, architecture, design and workflow instructions consistent with source. Link canonical guides instead of maintaining conflicting architecture copies.
- Do not assert test counts, production SMTP/payment success or Arabic coverage without current evidence.
- Treat `SIMPLIFICATION_PLAN.md` and the OpenEvents Organizer Guide PDF as historical material, not executable instructions or current verification.
- For documentation-only changes, validate links, paths and factual claims; application tests may be reported as not run. Do not invent passing results or require GitHub Actions to finish the task.

## Agent delivery checklist

1. Briefly describe the task and inspect relevant code/documentation.
2. Identify affected API/database/auth/payment boundaries and choose a minimal safe solution.
3. Write or update tests, including failure cases and access-control tests where relevant.
4. Run `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build` **as appropriate**. If environment variables are missing, report exactly what could not run without requesting production secrets.
5. Report changes, tests with pass/fail status, unresolved risks, and PR/deployment links. Never claim production success from a local build alone.

## Priority of instructions

Follow the user's explicit task and applicable safety rules. These repo docs are guidance, not authorization for credentials, production changes or purchases. If docs conflict with code, inspect the current code and update the documentation as part of the change.
