# GitHub Copilot instructions — Cruze Events

Read the repository-wide [AGENTS.md](../AGENTS.md) first. Also consult [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [docs/DESIGN.md](../docs/DESIGN.md) and [docs/WORKFLOWS.md](../docs/WORKFLOWS.md) when relevant.

- Cruze is a single-admin Qatar event discovery/ticketing platform, not a multi-organizer marketplace.
- Next.js App Router, React, TypeScript, Prisma/Neon, Vercel Blob, NextAuth, Tailwind and Vitest.
- QAR, Asia/Qatar, Friday/Saturday weekend, inclusive Arabic/English experience and accessible RTL.
- Demo `demo-` events are **fictional** and must never accept real payments or silently enable booking.
- Favor narrow, tested changes; preserve authorization and server-side validation.
- Never output or commit secrets, copy upstream OSC credentials, or execute production database/deployment operations without explicit permission.
- Check the existing repository patterns before proposing code. Run lint, TypeScript and tests where practical and report any skipped checks.
