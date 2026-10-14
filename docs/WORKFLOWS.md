# Cruze Events — Development and Agent Workflows

These steps apply to coding agents and human contributors. Start with [AGENTS.md](../AGENTS.md). Environment changes always require explicit owner approval.

## Normal engineering loop

1. Inspect the relevant page, API handler, Prisma model and tests.
2. Write a short task plan and call out payment, authentication, data or infrastructure impacts.
3. Make one focused change on a feature branch. Avoid incidental refactors.
4. Add or adjust tests for success and failure scenarios.
5. Run supported local checks, report results honestly, and open a reviewable PR.
6. After explicit approval, merge/deploy and verify the actual Vercel deployment and logs.

## Local setup (with a disposable development database)

```bash
npm ci
cp .env.example .env.local
# Supply your OWN safe dev-only environment settings locally.
npx prisma generate
npm run dev
```

The .env example contains placeholders. Do not paste production connection strings into AI chats, commits, issue bodies or CI logs. Never use database credentials from the old upstream CLAUDE.md or Git history.

## Validation commands

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

- Some integration tests may need local test services. Mock APIs/payment and storage where practical.
- `npm run build` uses `prisma generate && next build`; database-backed dynamic pages may still require environment setup to test properly.
- When changing Prisma, use `npx prisma migrate dev` **only in an isolated disposable local database**; review generated SQL and commit the migration.
- Avoid `npm run db:reset`, `npm run db:push` or `npm run db:seed` except on clearly isolated, expendable development data. The upstream seed is not Cruze-specific.

## Before editing sensitive flows

| Concern | Required checks |
| --- | --- |
| Auth and account registration | Negative permission tests, rate limits, email verification, session handling |
| Events | Ownership checks, publish constraints, timezone correctness, public/draft visibility |
| Media uploads | Auth, file type/size limits, path ownership, Blob token expiry, CSP and display routes |
| Tickets | Atomic capacity enforcement, reservation expiry, concurrency stress tests |
| Payments | Provider sandbox, signed webhook validation, idempotency, amount/currency integrity |
| QR check-in | Server-side verification, one-time checks, replay prevention, scoped staff roles |
| Refunds | Consistent DB/payment states, stock reconciliation and auditability |
| Demo data | Clearly fictional labels, no real charges, no misleading bookings |

## Deployment checklist

1. Run tests and inspect the PR diff (especially database migrations, API/permission changes and environmental assumptions).
2. Confirm required Vercel environment variables exist **without displaying their values**.
3. Deploy to a preview. Check homepage, /events, a real/draft event as appropriate, sign-in permissions and image paths.
4. For schema changes: plan compatible app/schema rollout, backup/restore and rollback; apply reviewed migrations only with owner approval.
5. Deploy to the appropriate Vercel environment only after approval.
6. Inspect Vercel deployment status and recent runtime errors; run non-destructive smoke tests. Do not claim booking works solely because pages returned HTTP 200.
7. Record which flows were manually checked and which were *not* checked.

## Demo/real booking boundary

Current `demo-` events are fictional examples, with ticket purchasing intentionally disabled. Never silently re-enable public checkout for those events. A requested demo booking mode must use safe isolated test orders and explicit simulated payment labels, no real financial provider, no sending misleading QR tickets to customers and no accidental charges.

## Secret and historical-leak response

The inherited upstream CLAUDE.md once included plaintext connection details. The current copy has been sanitized, but existing Git history may still contain those values. Do not republish them. Credential owners should revoke/rotate exposed credentials, assess access logs and coordinate confidential notification with upstream maintainers. Removing a file or a Git commit alone does not rotate credentials. Git history rewriting requires a separate, carefully coordinated decision.

## Agent handover / PR description

Always include: goal, changed files, test results (pass/fail/skipped), screenshots where UI is involved, environment/data changes, assumptions, security considerations, unresolved blockers, and the exact preview/deployment link if confirmed.
