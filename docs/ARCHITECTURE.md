# Cruze Events — Architecture

Reviewed against main commit `c2667ba5998603f28c0fa1674b726193d8fdad62` on 2026-10-16. Source behavior below is separate from intended requirements and live-service verification.

## Product and runtime

Cruze staff curate Qatar events. Customers discover, book and check in. Existing `OrganizerProfile` and `ORGANIZER` naming supports staff workflows; do not infer a multi-organizer marketplace.

| Layer | Implementation |
| --- | --- |
| UI/server | Next.js 16.1.6 App Router, React 19.2.3, TypeScript |
| Styling/forms | Tailwind 4, Radix, React Hook Form, Zod, Tiptap |
| Database | Neon PostgreSQL; Prisma schema and checked-in SQL migrations |
| Auth | NextAuth v4 credentials, bcrypt, verified email, JWT sessions |
| Hosting | Existing Vercel project `cruze-openevents-demo` |
| Media | Vercel Blob event/speaker uploads; inherited S3 handlers remain |
| Email | Nodemailer development logs or SMTP |
| Payments | Stripe and stub adapters selected through a registry |
| Redis | Optional ioredis helpers for rate limiting/cache; not inventory storage |
| Tests | Vitest in `src/__tests__/` |

No GitHub Actions execution is required. No `vercel.json` or `.github/workflows/` files exist in the reviewed tree.

## Routes and modules

| Flow | Entry points |
| --- | --- |
| Homepage | `src/app/page.tsx`, `src/components/landing/CruzeHome.tsx` |
| Discovery | `src/app/(public)/events/page.tsx`, `EventsBrowser.tsx` |
| Event detail/checkout | `src/app/(public)/events/[slug]/`, `CheckoutForm.tsx` |
| Staff | `src/app/(dashboard)/dashboard/`, legacy `src/app/(admin)/admin/` |
| Event editing | `src/components/events/EventForm.tsx`, `src/app/api/events/` |
| Orders | `src/app/api/orders/`, `src/lib/orders/` |
| Payment | `src/lib/payments/`, `src/app/api/webhooks/stripe/route.ts` |
| Check-in | `src/app/api/tickets/verify/[code]/route.ts`, `TicketScanner.tsx` |
| Accounts | `src/lib/auth/`, `src/lib/accountDeletion.ts`, auth/user API routes |
| Branding/legal | `src/lib/platform-settings.ts`, admin settings and layout components |

## Data model

Users have zero or more roles: ORGANIZER and SUPER_ADMIN. There is no ATTENDEE enum. Customer registration does not grant staff roles. Users may have an organizer profile; events reference that profile.

Events own ticket types, media, agenda items, speakers, discount codes and group discounts. Orders reference an event and optionally a user, allowing guest orders. Order items retain prices and attendee data; tickets have unique codes and ACTIVE/USED/CANCELLED status. PlatformSetting stores configurable branding/legal content.

Event statuses: DRAFT, PUBLISHED, CANCELLED, COMPLETED. Order statuses include PENDING, PENDING_INVOICE, PAID, CANCELLED and refund states. PaymentMethod still contains PAYPAL, INVOICE and FREE, despite the Stripe adapter.

Schema defaults still include SEK ticket/order currency, UTC event timezone and 0.25 order VAT. Qatar defaults must be explicit in application code; schema defaults are not confirmed Qatar policy. There is no persistent category model; discovery derives categories from descriptions and static demo data.

## Discovery and demo behavior

Homepage and catalogue queries select published, public, non-deleted Qatar events whose end date is in the future, taking up to 60 results. Client components append six static demo cards when fewer than six database events exist; this can duplicate demo listings.

Event detail and checkout call `src/lib/tickets/demoTickets.ts`. It can create a demo event and organizer/user records, create ticket tiers, reopen sale windows, enlarge depleted demo capacity and move past demo dates into the future. Unrecognized `demo-` slugs use a generic preset. Visiting these pages can therefore write to the connected database.

The detail page currently shows GET TICKETS for non-ended demo events. Checkout availability checks status, start date and stock, not demo identity. The order API refreshes demo tickets rather than rejecting demo orders. This conflicts with the intended fictional/sandbox boundary: no real charges or misleading tickets. Documentation is not an enforcement mechanism.

## Orders, inventory and payment

1. Checkout sends buyer, selected ticket types, attendee data and optional discounts to the order API; a session is optional.
2. Server reads prices, calculates country VAT and discounts, locks ticket rows with FOR UPDATE, and uses a serializable transaction.
3. Paid orders increment sold stock and create tickets; pending orders increment reserved stock. New pending orders currently have no expiry, despite retained cleanup helpers.
4. Zero-total orders are PAID/FREE. Invoice discount codes currently also create PAID/INVOICE orders immediately, while the pay route can place pending orders into PENDING_INVOICE.
5. The payment registry selects an explicitly requested adapter or configured provider, then Stripe if configured, otherwise stub. The fallback has no production guard.
6. The stub supplies a return URL and reports approved/completed payments. Its `isConfigured()` is true, so the pay route generally returns a redirect before its inline auto-capture branch.
7. Capture and Stripe webhook paths call shared fulfillment. Fulfillment locks stock, rechecks status inside a serializable transaction, moves reservations to sales and creates tickets. Email delivery happens after the transaction.
8. Webhooks verify Stripe signatures and require a paid session, but do not visibly reconcile amount, currency or stored payment identity with the order.

Do not infer confirmed production payment acceptance, refunds, QAR settlement or complete concurrency safety from these paths. Guest payment access currently treats an order without userId as accessible by order ID; review guest authorization before real use.

## Authentication and security boundaries

Credentials login requires email verification and a bcrypt password check. JWT sessions have a 24-hour maximum; session callbacks reload the database user/roles and account deletion state. JWT use does not eliminate DB reads.

Page layouts and API handlers enforce access; middleware primarily checks Server Action origins, not global RBAC or Redis rate limits. Registration ignores client roles. Event ownership and SUPER_ADMIN exceptions exist in authorization helpers, but each endpoint must be checked individually.

QR POST checks staff roles, reads ticket state, then updates it. It does not atomically condition the update on ACTIVE or enforce ownership of the ticket's event. Concurrent replay and staff scope remain gaps. `next.config.ts` globally sets `camera=()`, which can block camera scanning.

Redis rate limiting allows requests when Redis is missing or fails. Its pipeline is not an atomic transaction despite the code comment. Login/auth rate-limit coverage requires endpoint review.

Cleanup/reminder POST routes use ORDER_CLEANUP_TOKEN or ACCOUNT_DELETION_CLEANUP_TOKEN; when the token is missing they allow requests. There is no checked-in scheduler. Do not call these mutating routes as health checks.

## Media, notifications and localization

Blob token generation authenticates staff, validates event ownership (except new entities), limits MIME types and size, and issues short-lived upload tokens. The client persists the resulting URL. S3 still supports inherited image/profile/platform routes; Blob does not replace every media path.

Email mode defaults to SMTP when SMTP_HOST exists, otherwise development logging. Logged mail can contain personal data and verification/reset links; use only synthetic local data. SMTP configuration checks are not delivery tests.

The root document currently sets English and the customer interface is largely English. Arabic/RTL, Friday/Saturday filters and full Qatar formatting are acceptance requirements rather than a completed feature set. See [Design](DESIGN.md).

## Deployment and verification

Use [Workflows](WORKFLOWS.md). Vercel was observed READY on the reviewed commit; that is not an end-to-end booking test. Database migration status, Redis connectivity, SMTP delivery and payment configuration were not established by this source review. The build generates Prisma Client; npm start also applies migrations and must be treated as a write-capable operation.
