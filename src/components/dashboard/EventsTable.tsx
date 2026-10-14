'use client'

import Link from 'next/link'
import { EventStatus } from '@prisma/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EventStatusBadge } from '@/components/dashboard/EventStatusBadge'
import { useToast } from '@/components/ui/toaster'
import { formatDateTime } from '@/lib/utils'

type EventsTableProps = {
  events: Array<{
    id: string
    slug: string
    title: string
    startDate: Date
    endDate: Date
    status: EventStatus
    visibility: 'PUBLIC' | 'PRIVATE'
    ticketsSold: number
    _count: {
      orders: number
    }
  }>
}

type ErrorAction = {
  label: string
  href: string
}

type UiActionError = {
  message: string
  action?: ErrorAction
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseUiActionError(payload: unknown, fallbackMessage: string): UiActionError {
  if (!isRecord(payload)) return { message: fallbackMessage }

  const messageValue = payload.message ?? payload.error
  const message =
    typeof messageValue === 'string' && messageValue.trim().length > 0
      ? messageValue
      : fallbackMessage

  const actionValue = payload.action
  if (!isRecord(actionValue)) return { message }

  const label = actionValue.label
  const href = actionValue.href
  if (typeof label !== 'string' || typeof href !== 'string') {
    return { message }
  }

  if (!href.startsWith('/')) return { message }

  return {
    message,
    action: { label, href },
  }
}

export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter()
  const showToast = useToast()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null)
  const [pendingCancel, setPendingCancel] = useState<{ id: string; title: string } | null>(null)

  async function runAction(eventId: string, action: 'publish' | 'cancel') {
    setBusyId(eventId)
    const actionLabel = action === 'publish' ? 'publish' : 'cancel'

    try {
      const endpoint = action === 'publish' ? `/api/events/${eventId}/publish` : `/api/events/${eventId}/cancel`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'cancel' ? JSON.stringify({}) : undefined,
      })
      const json = await response.json().catch(() => null)
      if (!response.ok) {
        const { message } = parseUiActionError(
          json,
          `Could not ${actionLabel} the event due to a system error. Please try again.`
        )
        showToast(message, 'error')
        return
      }
      router.refresh()
      showToast(action === 'publish' ? 'Event published successfully' : 'Event cancelled')
    } catch (actionError) {
      console.error(`Failed to ${action} event`, actionError)
      showToast(`Could not ${actionLabel} the event due to a system error. Please try again.`, 'error')
    } finally {
      setBusyId(null)
      setPendingCancel(null)
    }
  }

  async function deleteEvent(eventId: string) {
    setBusyId(eventId)

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })
      const json = await response.json().catch(() => null)
      if (!response.ok) {
        const { message } = parseUiActionError(
          json,
          'Could not delete the event due to a system error. Please try again.'
        )
        showToast(message, 'error')
        return
      }
      router.refresh()
      showToast('Event deleted')
    } catch (deleteError) {
      console.error('Failed to delete event', deleteError)
      showToast('Could not delete the event due to a system error. Please try again.', 'error')
    } finally {
      setBusyId(null)
      setPendingDelete(null)
    }
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f1efe8]/50">
          No events found
        </p>
        <p className="mt-1 text-xs text-[#f1efe8]/40">
          Get started by curating and publishing your first Qatar event.
        </p>
        <Link
          href="/create-event"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#d8763d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#c4652e]"
        >
          Create Event ↗
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161614] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-[#1a1a18]">
            <tr>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Event</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Date (Qatar)</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Status</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Orders</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Tickets Sold</th>
              <th className="px-5 py-3.5 text-right font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((event) => (
              <tr key={event.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#f1efe8]">{event.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#f1efe8]/40">{event.visibility}</p>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-[#f1efe8]/70">{formatDateTime(event.startDate)}</td>
                <td className="px-5 py-4">
                  <EventStatusBadge status={event.status === 'PUBLISHED' && new Date(event.endDate) < new Date() ? 'PASSED' : event.status} />
                </td>
                <td className="px-5 py-4 font-mono text-xs text-[#f1efe8]/70">{event._count.orders}</td>
                <td className="px-5 py-4 font-mono text-xs font-bold text-[#f1efe8]">{event.ticketsSold}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end items-center gap-2">
                    <Link href={`/dashboard/events/${event.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    {event.status !== 'DRAFT' ? (
                      <Link href={`/dashboard/events/${event.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    ) : null}
                    {event.status === 'DRAFT' ? (
                      <Button size="sm" isLoading={busyId === event.id} onClick={() => runAction(event.id, 'publish')}>
                        Publish
                      </Button>
                    ) : null}
                    {event.status === 'PUBLISHED' && new Date(event.endDate) >= new Date() ? (
                      <Button variant="cancel" size="sm" isLoading={busyId === event.id} onClick={() => setPendingCancel({ id: event.id, title: event.title })}>
                        Cancel
                      </Button>
                    ) : null}
                    {event.status === 'CANCELLED' || event.status === 'DRAFT' ? (
                      <Button variant="destructive" size="sm" isLoading={busyId === event.id} onClick={() => setPendingDelete({ id: event.id, title: event.title })}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingCancel !== null}
        title={`Cancel "${pendingCancel?.title}"?`}
        description="This will cancel the event and notify all ticket holders. This action cannot be undone."
        confirmLabel="Cancel Event"
        isLoading={busyId === pendingCancel?.id}
        onConfirm={() => {
          if (pendingCancel) runAction(pendingCancel.id, 'cancel')
        }}
        onClose={() => setPendingCancel(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This will permanently delete the event and all associated ticket types. This cannot be undone."
        confirmLabel="Delete Event"
        isLoading={busyId === pendingDelete?.id}
        onConfirm={() => pendingDelete && deleteEvent(pendingDelete.id)}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  )
}
