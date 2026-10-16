# Cruze Events — Local Setup

## Prerequisites

Use Node.js 24.x to match the inspected Vercel runtime, npm, Git and a disposable PostgreSQL database owned by you. Redis, SMTP, Blob and Stripe are optional for isolated feature work; use mocks or dedicated development resources.

## Install

```bash
git clone https://github.com/medo94my/cruze-openevents.git
cd cruze-openevents
npm ci
cp .env.example .env.local
```

Populate placeholders locally. Never paste production secrets into chats, docs or commits.

| Variable | Use |
| --- | --- |
| DATABASE_URL | Separate disposable PostgreSQL database |
| NEXTAUTH_SECRET | Locally generated signing secret |
| NEXTAUTH_URL | http://localhost:3000 for local auth |
| NEXT_PUBLIC_APP_URL | http://localhost:3000 for local links |
| APP_NAME | Cruze Events |
| EMAIL_MODE | development for synthetic local mail only |
| BLOB_READ_WRITE_TOKEN | Optional separate development Blob store |
| REDIS_URL | Optional dedicated development Redis |
| PAYMENT_GATEWAY_PROVIDER | stub only for deliberately isolated simulations |

Next.js loads .env.local. Prisma CLI does not automatically use Next.js's environment loader: supply DATABASE_URL through your local shell/environment tooling, or a private ignored .env used only for the disposable DB. Do not print it. A generated Prisma client does not create database tables.

```bash
# With DATABASE_URL already scoped to your disposable DB:
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The development app runs at http://localhost:3000. Do not seed from the inherited seed by default. If migrations fail, diagnose the migration history on the disposable DB; do not reset a shared database as a workaround.

## Isolate side effects

Demo detail and checkout pages can provision database rows and reopen ticket stock. Use a disposable DB even for browsing demos. Stub payments report success, so simulated booking tests must be visibly sandboxed and isolated from live inventory, real email and real payment rails.

Development emails log content and links. Use synthetic addresses/data and keep verification/reset links private. Login requires verified email; complete the local verification flow rather than bypassing it.

See [Email](SETUP_EMAIL.md) and [Storage](SETUP_STORAGE.md). Missing service variables can disable feature paths; do not request production secrets to make local checks pass.

## Validation and delivery

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Do not use npm start as a neutral test: it runs prisma migrate deploy first. Build may require additional environment configuration and network access for fonts. Report failures accurately.

GitHub Actions is unavailable due to exhausted credits. Run checks locally and use the existing Vercel integration under [Workflows](WORKFLOWS.md). Never restart an upstream OSC service or assume all developers share its database.
