import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, hasRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getDownloadPresignedUrl } from '@/lib/storage'
import { extractObjectKeyFromStorageRef } from '@/lib/storage/object-key'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const slot = request.nextUrl.searchParams.get('slot') === 'bottom' ? 'bottom' : 'cover'

    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      select: {
        id: true,
        status: true,
        coverImage: true,
        organizer: {
          select: {
            userId: true,
          },
        },
        media: {
          where: {
            type: 'IMAGE',
            title: 'BOTTOM_IMAGE',
          },
          select: {
            url: true,
          },
          take: 1,
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.status !== 'PUBLISHED') {
      const user = await getCurrentUser()
      const canAccessDraft = user
        ? hasRole(user.roles, ['ORGANIZER', 'SUPER_ADMIN']) &&
          (hasRole(user.roles, 'SUPER_ADMIN') || event.organizer.userId === user.id)
        : false

      if (!canAccessDraft) {
        return NextResponse.json({ error: 'Event image not found' }, { status: 404 })
      }
    }

    const imageUrl = slot === 'cover' ? event.coverImage : event.media[0]?.url

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Public Vercel Blob images are already addressable by an HTTPS URL.
    // Restrict redirects to this exact storage provider to avoid an open redirect.
    try {
      const parsed = new URL(imageUrl)
      if (parsed.protocol === 'https:' && (parsed.hostname.endsWith('.public.blob.vercel-storage.com') || parsed.hostname === 'images.pexels.com')) {
        return NextResponse.redirect(parsed.toString(), { headers: { 'Cache-Control': 'no-store' } })
      }
    } catch {
      // S3/MinIO object keys are not necessarily full URLs; use the original path.
    }

    // Allow only trusted Unsplash imagery on explicitly fictional catalogue entries.
    if (event.status === 'PUBLISHED' && id.startsWith('demo-') && (imageUrl.startsWith('https://images.unsplash.com/photo-') || imageUrl.startsWith('https://images.pexels.com/photos/'))) {
      return NextResponse.redirect(imageUrl, { headers: { 'Cache-Control': 'public, max-age=1800' } })
    }

    const key = extractObjectKeyFromStorageRef(imageUrl, ['events', 'speakers', 'users'])
    if (!key) {
      return NextResponse.json({ error: 'Invalid image key' }, { status: 400 })
    }

    const signedUrl = await getDownloadPresignedUrl(key, 900)
    return NextResponse.redirect(signedUrl, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Get event image failed:', error)
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 })
  }
}
