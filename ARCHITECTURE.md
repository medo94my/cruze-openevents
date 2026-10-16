# Cruze Events Architecture

The canonical current architecture is [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Cruze runs a Next.js application on Vercel with Neon PostgreSQL through Prisma and Vercel Blob for event/speaker uploads. Legacy S3, organizer and payment naming remains in code; it does not define a separate marketplace or authorize access to upstream OSC resources.

Use [AGENTS.md](AGENTS.md) for rules, [Setup](docs/SETUP.md) for development and [Workflows](docs/WORKFLOWS.md) for validation/deployment. The former upstream OSC architecture in this file has been superseded to prevent conflicting instructions.
