import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth, hasRole } from '@/lib/auth'

// Vercel Blob is used for image uploads in the Cruze evaluation deployment.
// Other installations can keep using the existing S3/MinIO upload endpoint.
const payloadSchema = z.object({
  folder: z.enum(['events', 'speakers']),
  entityId: z.string().min(1).max(150),
})

const allowedContentTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Image storage is not configured' }, { status: 503 })
    }

    const body = (await request.json()) as HandleUploadBody
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const user = await requireAuth()
        if (!hasRole(user.roles, ['ORGANIZER', 'SUPER_ADMIN'])) {
          throw new Error('Organizer permissions required')
        }

        const payload = payloadSchema.parse(JSON.parse(clientPayload || '{}'))
        const expectedPrefix = `${payload.folder}/${payload.entityId}/`
        if (!pathname.startsWith(expectedPrefix) || pathname.includes('..')) {
          throw new Error('Invalid upload path')
        }

        // Never allow modifying another organizer's existing event images.
        if (payload.entityId !== 'new') {
          const event = await prisma.event.findFirst({
            where: { id: payload.entityId, deletedAt: null },
            select: { organizer: { select: { userId: true } } },
          })
          if (!event || (event.organizer.userId !== user.id && !user.roles.includes('SUPER_ADMIN'))) {
            throw new Error('Not authorized to upload for this event')
          }
        }

        return {
          allowedContentTypes,
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
          validUntil: Date.now() + 15 * 60 * 1000,
          tokenPayload: JSON.stringify({ userId: user.id, ...payload }),
        }
      },
      onUploadCompleted: async () => {
        // The client saves the URL to the event after the upload succeeds.
        // This callback is made by Vercel and must not require a browser session.
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Blob upload failed:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Unable to upload image. Check the file type, size and your permissions.' },
      { status: 400 }
    )
  }
}
