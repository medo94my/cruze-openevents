'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Download, Copy, Check } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'

type Props = {
  eventId: string
  eventSlug: string
}

const itemClass =
  'flex cursor-pointer select-none items-center px-3 py-2 font-mono text-xs uppercase tracking-wider text-[#f1efe8]/80 outline-none hover:bg-white/10 hover:text-white focus:bg-white/10 rounded-lg transition-colors'

export function EventActionButtons({ eventId, eventSlug }: Props) {
  const [copied, setCopied] = useState(false)

  async function copyEventLink() {
    const url = `${window.location.origin}/events/${eventSlug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
      {/* Edit Event button */}
      <Link href={`/dashboard/events/${eventId}/edit`}>
        <Button variant="outline">Edit Event</Button>
      </Link>

      {/* Export dropdown: CSV, Excel */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">
            <Download className="mr-1 h-3.5 w-3.5" />
            Export
            <ChevronDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={4}
            align="start"
            className="z-50 min-w-[160px] rounded-xl border border-white/15 bg-[#161614] p-1.5 shadow-2xl text-[#f1efe8]"
          >
            <DropdownMenu.Item asChild>
              <a
                href={`/api/dashboard/events/${eventId}/attendees/export`}
                download
                className={itemClass}
              >
                Export CSV
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <a
                href={`/api/dashboard/events/${eventId}/attendees/export-excel`}
                download
                className={itemClass}
              >
                Export Excel
              </a>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Primary actions */}
      <Link href={`/dashboard/events/${eventId}/orders`}>
        <Button variant="outline">View Orders</Button>
      </Link>
      <Link href={`/dashboard/events/${eventId}/scan`}>
        <Button variant="outline">Scan Tickets</Button>
      </Link>
      <Button variant="outline" onClick={copyEventLink}>
        {copied ? (
          <>
            <Check className="mr-1 h-4 w-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-1 h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
      <Link href={`/events/${eventSlug}`} target="_blank" rel="noopener noreferrer">
        <Button>Open Public Page</Button>
      </Link>
    </div>
  )
}
