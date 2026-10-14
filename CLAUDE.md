# Cruze Events — Claude Code Instructions

> **Canonical instructions:** read [AGENTS.md](./AGENTS.md) first, then [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/DESIGN.md](./docs/DESIGN.md), and [docs/WORKFLOWS.md](./docs/WORKFLOWS.md). If those files do not yet exist in your checkout, avoid autonomous infrastructure/database changes until they are available.

## Claude-specific working agreement

- Work only on the requested task. Read related implementation and tests before changing files. Prefer a small, reviewable diff over an unrequested refactor.
- Give a brief plan for multi-file changes. Explain assumptions and report validation results, remaining risks, and file locations afterward.
- Prefer the existing Next.js App Router, TypeScript, Prisma, React, Tailwind and Vitest conventions.
- Preserve the **single-admin** Cruze business model: staff create events, customers discover them. Do not add an organizer marketplace, commissions, or split payouts without a new requirement.
- Protect Qatar-specific behavior: **QAR**, **Asia/Qatar**, Friday/Saturday weekends, EN/Arabic support and accessible RTL layouts.
- Do not bypass authentication, authorization, email verification, inventory holds, QR validation or payment integrity checks.
- Demo listings under `demo-` are fictional. Preserve their explicit labels and booking restrictions unless implementing an approved, safe simulated checkout flow.
- Never access, log, paste, commit, or reveal credentials. Use locally supplied environment variables; `.env.example` must contain **placeholders only**.
- **No production side effects without explicit user approval**: no migrations, seed/reset, live data changes, deployments, payment activation, external messages, or secret rotation. Treat Vercel, Neon, Blob and Redis as external systems, not test fixtures.
- Never run `prisma migrate reset`, `prisma db push`, destructive SQL, or `npm run db:seed` against a connected production database.
- Do not assume OSC hosting, servers or databases from the upstream Eyevinn OpenEvents repository belong to Cruze. Cruze currently uses **Vercel** and **Neon PostgreSQL**; Redis integration and the full checkout path require verification.
- Run appropriate local checks (`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` where practical). Report failures rather than suppressing them.

## Security

Older history inherited from upstream may contain published connection strings. **Do not copy or use them.** Credential rotation and Git history rewriting must be coordinated with the affected owners; editing this file does not revoke an exposed credential.
