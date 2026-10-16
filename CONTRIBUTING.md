# Contributing to Cruze Events

Read [AGENTS.md](AGENTS.md), [Architecture](docs/ARCHITECTURE.md), [Design](docs/DESIGN.md) and [Workflows](docs/WORKFLOWS.md). This repository is `medo94my/cruze-openevents`; upstream OSC deployments are not development fixtures.

## Setup and scope

Use Node.js 24.x, npm, Git and an isolated disposable development database. Follow [Setup](docs/SETUP.md). Use npm ci to respect package-lock.json. Do not connect local tests to production services or reuse historical upstream credentials.

Cruze staff own event creation. Customers may register or use guest checkout; registration must not grant staff roles. Preserve QAR, Asia/Qatar and the Friday/Saturday weekend. Do not introduce marketplace onboarding, commissions or payouts without a requirement.

## Branch and review workflow

1. Branch from main with a descriptive feature/, fix/ or docs/ prefix.
2. Inspect the relevant page, API, database model and tests; keep the change focused.
3. Use typed TypeScript, existing React/Tailwind patterns and Zod for untrusted input.
4. Add meaningful failure/access-control/concurrency tests for sensitive behavior.
5. Run appropriate local checks and open a PR with exact results.
6. Production merging/deployment requires explicit approval; a documentation PR is not approval to release.

GitHub Actions credits are exhausted. Do not wait for Actions or represent skipped Actions as passing checks. Vercel Git integration can build branches independently; existing deployment protection and settings still apply.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
# Focused example:
npm test -- src/__tests__/lib/auth/config.test.ts
```

Tests live in src/__tests__/. Mock external services or use disposable local fixtures. Do not create tests that send real email, charge payments or modify production. Documentation-only changes need link/source consistency review; application tests may be marked not run when no runtime code changes.

## Database changes

Check in a Prisma migration with schema changes, review compatibility/backfills/rollback and test on an expendable database. prisma migrate dev is only for an isolated development DB. Never use db push, migrate reset or the inherited seed against production.

There is no universal app-first migration order: plan a compatible rollout for the specific change. Production migrations require owner approval. The build script does not migrate; npm start does. Do not run npm start as a harmless validation step against a live database.

Some package scripts reference tsconfig.scripts.json, which is absent from the reviewed tree; do not advertise those scripts as working without fixing/verifying them.

## PR contents

State the resulting behavior, affected files/boundaries, checks passed/failed/skipped, screenshots for UI changes, environment/data impacts and remaining risks. Link an actual Vercel preview only if confirmed. Do not claim production success from a build or mocked unit tests. Keep secrets, customer records and token-bearing links out of descriptions and logs.

## Current gaps

[Architecture](docs/ARCHITECTURE.md) records demo provisioning, stub payment fallback, invoice-state inconsistencies, pending reservations, QR replay, cleanup authorization and localization gaps. Do not treat an existing flaw as an intended invariant or silently change business behavior while updating docs.

## License

MIT; see [LICENSE](LICENSE).
