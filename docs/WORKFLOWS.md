# Cruze Events — Development and Delivery

Read [AGENTS.md](../AGENTS.md). Work in a branch and open a PR for substantive changes.

## Engineering loop

1. Inspect the affected UI, API, authorization, Prisma models and tests.
2. State the focused change and any payment/data/infrastructure boundaries.
3. Implement within existing patterns; add meaningful failure tests for sensitive flows.
4. Run appropriate local checks and review the diff.
5. Open a PR with results, skipped checks, remaining risks and confirmed links.
6. Obtain explicit approval for production merge, deployment, migration or live data changes.

## Validation without GitHub Actions

The owner reports GitHub Actions credits are exhausted. Do not depend on Actions for tests, previews or releases. The reviewed tree contains no workflow files.

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Use isolated development services or mocks. Report each result honestly; missing variables are not a reason to request production secrets. For documentation-only changes, check links, paths and source accuracy; application checks can be recorded as not run.

Follow [Setup](SETUP.md). Prisma CLI does not automatically load .env.local like Next.js; supply only a disposable DB environment to Prisma commands.

## Vercel project and delivery

Inspection on 2026-10-16 identified:

| Setting | Observed value |
| --- | --- |
| Team | medo94mys-projects |
| Project | cruze-openevents-demo |
| Framework/runtime | Next.js / Node.js 24.x |
| Production domain | https://cruze-openevents-demo.vercel.app |
| Reviewed production commit | c2667ba5998603f28c0fa1674b726193d8fdad62 |
| Deployment state | READY |
| Protection | Vercel SSO protection enabled for all_except_custom_domains |

This is a dated observation, not a guarantee of current configuration or booking reliability.

Use the existing Vercel Git integration for branch previews and approved main releases, subject to project settings. Git integration builds do not consume GitHub Actions runner credits. Creating a branch/PR can trigger an existing preview automatically; verify its actual result.

If the Git integration cannot deploy, an authorized operator can use Vercel CLI for the verified team/project/environment. Do not create a second project, bypass release checks or add an Actions-based pipeline by default.

Before releasing: verify the exact branch/commit, environment, team/project, required variable names (without values), migration plan and local checks. Inspect the resulting deployment and sanitized runtime errors. A READY build or HTTP 200 does not prove a successful booking.

## Database lifecycle

The build script is prisma generate followed by next build. It does not apply migrations. npm start applies prisma migrate deploy before next start; do not use it as a read-only check against a connected production database, and do not assume Vercel executes it.

Schema changes require a checked-in migration, isolated migration test, compatible rollout/backfill/rollback plan and explicit production approval. Do not run db push, migrate reset, the inherited seed or destructive SQL on Neon production.

## Sensitive-flow checks

| Flow | Verification |
| --- | --- |
| Auth | Verified email, current DB roles, deletion state, negative access tests and rate-limit coverage |
| Events | Staff/ownership checks, drafts/private visibility, publish rules, timezone |
| Uploads | Role/path/entity scope, MIME/size, token expiry, save/display |
| Orders | Server prices, discounts/tax, locked stock, retries, pending reservations |
| Payments | Explicit sandbox, signature, identity/amount/currency reconciliation, idempotency |
| Check-in | Staff event scope, atomic ACTIVE-to-USED update, replay rejection and camera policy |
| Refunds | Provider/DB state consistency, inventory and audit trail |
| Email | Correct mode, isolated recipients, token privacy, delivery failure handling |
| Cleanup | Authentication, deliberate scheduling and owner-approved mutations |

No vercel.json cron schedule exists in the reviewed tree. Cleanup/reminder routes are POST operations and currently allow access when their token variable is absent. Do not invoke them as health checks or assume they run automatically.

## Demo behavior and safe testing

Current source auto-provisions demo records and ticket tiers, exposes checkout and can select a successful stub payment fallback. This differs from the intended boundary: fictional demos must not charge customers or issue misleading tickets.

Even a GET to a demo detail/checkout page can write to the connected DB. Use an isolated DB and synthetic data for demo smoke tests. This documentation update neither authorizes live demo purchases nor claims the enforcement gaps are fixed.

## Secrets and handover

Never print or reuse historical upstream credentials. Do not access upstream OSC resources. Keep customer data and token-bearing email links out of shared logs. Credential rotation, infrastructure/access changes and external messages require appropriate authorization.

A PR should describe final behavior, files, validation results, environment/data impacts, screenshots when relevant, known limitations and actual deployment links. No fixed historical test count establishes today's correctness.
