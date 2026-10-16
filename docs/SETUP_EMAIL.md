# Cruze Events — Email Setup

Implementation: src/lib/email/index.ts. Mail supports verification, password setup/reset, order/attendee tickets, reminders, invoices, cancellation and account-deletion flows. Login requires verified email.

## Local development

Set EMAIL_MODE=development with synthetic local data. The transport logs mail text and links instead of delivering it. These logs can contain personal data and authentication tokens: keep them local and private, and do not paste them into tickets or PRs.

If EMAIL_MODE is absent, code selects smtp when SMTP_HOST exists, otherwise development. NODE_ENV=production alone does not force SMTP delivery.

## SMTP configuration

Configure a dedicated development provider for tests. A live provider or external test message requires the appropriate owner authorization.

| Variable | Meaning |
| --- | --- |
| EMAIL_MODE | smtp for actual delivery; development for logs |
| SMTP_HOST | Provider hostname |
| SMTP_PORT | Defaults to 587 |
| SMTP_SECURE | true for implicit TLS, commonly port 465 |
| SMTP_USER / SMTP_PASSWORD | Private provider credentials |
| FROM_EMAIL / EMAIL_FROM | Sender; FROM_EMAIL takes precedence |
| SITE_NAME / APP_NAME | Display name; SITE_NAME takes precedence |
| PUBLIC_URL / NEXT_PUBLIC_APP_URL | Link base URL; PUBLIC_URL takes precedence |

Verify the sender domain with the provider, including SPF/DKIM and applicable DMARC configuration. Configure each Vercel environment deliberately; a protected preview should not send customer mail unintentionally.

## Verification

isEmailConfigured() returns true in development and checks SMTP fields otherwise. It does not prove network access, authentication, delivery or correct links. getEmailMode() reports selected mode.

Test verification/reset using synthetic accounts and a local mailbox or isolated provider. Check token expiry, generated URLs, plain-text/HTML content and attachments. Do not remove email verification to work around delivery problems.

For authorized SMTP tests, inspect provider delivery status and sanitized application errors. Confirm host, TLS/port pairing, verified sender and network reachability. Never log credentials or publish complete mail bodies.

## Current limits

Production SMTP delivery has not been established by the documentation review. Shared fulfillment sends mail after committing the order and catches delivery errors; a PAID order is not proof that tickets reached the recipient. Existing development logging needs care before any real-user testing. See [Architecture](ARCHITECTURE.md).
