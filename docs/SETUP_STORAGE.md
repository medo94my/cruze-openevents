# Cruze Events — Media Storage

## Current Vercel Blob path

Event/speaker client uploads use src/app/api/upload/blob/route.ts and a private BLOB_READ_WRITE_TOKEN. Use a separate development store for local tests; production tokens stay in Vercel's environment configuration.

The endpoint uses Vercel's handleUpload flow. Before issuing a token it:

- Authenticates the user and requires ORGANIZER or SUPER_ADMIN.
- Accepts events or speakers folders with an entity ID.
- Validates the pathname prefix and rejects traversal.
- Checks ownership of an existing event, with a SUPER_ADMIN exception; new entities use the new identifier.
- Allows JPEG, PNG, WebP and GIF up to 50 MiB.
- Adds a random suffix and limits token validity to 15 minutes.

The completion callback does not require a browser session; the client persists the uploaded URL separately. Upload success alone is not proof that the event saved the image.

## Local checks

1. Use an isolated staff test account and development Blob store.
2. Upload an allowed image and save the event.
3. Verify the saved image displays on the event/editor.
4. Check rejection for wrong role, another event, bad path, unsupported MIME type and oversized files.
5. Inspect CSP and image remotePatterns in next.config.ts if browser uploads/display fail.

Do not publish signed URLs, upload tokens or raw provider errors containing credentials. Vercel Blob is not automatically used by every inherited media handler.

## Legacy S3/MinIO

src/lib/storage/index.ts and presigned upload/profile/platform routes still use the AWS S3 SDK. Only configure them when deliberately testing those paths on storage you own. Upstream OSC instances do not belong to Cruze.

| Variable | Purpose |
| --- | --- |
| S3_ENDPOINT | Owned S3-compatible endpoint |
| S3_PUBLIC_URL | Optional browser-facing base URL |
| S3_ACCESS_KEY_ID | Private access key |
| S3_SECRET_ACCESS_KEY | Private secret; inherited MINIO_PASSWORD fallback also exists |
| S3_BUCKET_NAME | Explicit bucket; code fallback is openevents |
| S3_REGION | Region; code fallback is us-east-1 |

Folders can include events, speakers, organizers, users and platform. Rewriting a presigned URL to a different public endpoint may affect signature validity; verify against the selected provider.

Do not copy old infrastructure commands, disable TLS verification, grant blanket public access or use wildcard CORS by default. Configure the required origins and permissions for the intended development store. Creating paid/live storage or changing access controls requires approval.

## Limits

Blob token generation is present in code; this does not establish current live token configuration or end-to-end media persistence. See [Architecture](ARCHITECTURE.md) and [Workflows](WORKFLOWS.md).
