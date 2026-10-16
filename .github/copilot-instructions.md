# GitHub Copilot instructions — Cruze Events

Read the repository-wide [AGENTS.md](../AGENTS.md) first. Also consult [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [docs/DESIGN.md](../docs/DESIGN.md) and [docs/WORKFLOWS.md](../docs/WORKFLOWS.md) when relevant.

- Cruze is a single-admin Qatar event discovery/ticketing platform, not a multi-organizer marketplace.
- Next.js App Router, React, TypeScript, Prisma/Neon, Vercel Blob, NextAuth, Tailwind and Vitest.
- QAR, Asia/Qatar and Friday/Saturday weekend are requirements. Current main UI is English; Arabic/RTL coverage remains incomplete.
- Demo `demo-` events are **fictional** and must not accept real payments or produce misleading tickets. Current code exposes demo checkout and auto-provisions records; treat this as a documented gap, not an enforced restriction.
- Favor narrow, tested changes; preserve authorization and server-side validation.
- Never output or commit secrets, copy upstream OSC credentials, or execute production database/deployment operations without explicit permission.
- Check the existing repository patterns before proposing code. Run lint, TypeScript and tests where practical and report any skipped checks.

- GitHub Actions credits are exhausted: validate locally and use the existing Vercel integration. Do not add an Actions dependency.
- Read docs/DESIGN.md for the current charcoal/cream/orange customer UI; do not assume the old maroon design is current.
- npm start applies migrations; build only generates Prisma Client and builds Next.js. Treat live database operations accordingly.
