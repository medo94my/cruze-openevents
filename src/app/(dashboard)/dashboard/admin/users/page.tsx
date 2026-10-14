import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { UsersTable } from '@/components/admin/UsersTable'
import { CreateUserForm } from '@/components/admin/CreateUserForm'
import { Role } from '@prisma/client'
import { WorkspacePageHeader } from '@/components/layout/WorkspaceShell'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  role?: string
  search?: string
  page?: string
}>

export default async function DashboardAdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const roleFilter = params.role || 'all'
  const searchQuery = params.search || ''
  const page = parseInt(params.page || '1', 10)
  const pageSize = 20

  const where: {
    deletedAt: null
    roles?: { some?: { role: Role }; none?: { role: Role } }
    OR?: Array<{ email?: { contains: string; mode: 'insensitive' }; firstName?: { contains: string; mode: 'insensitive' }; lastName?: { contains: string; mode: 'insensitive' } }>
  } = {
    deletedAt: null,
  }

  if (roleFilter === 'ORGANIZER') {
    where.roles = { some: { role: 'ORGANIZER' } }
  }

  if (searchQuery) {
    where.OR = [
      { email: { contains: searchQuery, mode: 'insensitive' } },
      { firstName: { contains: searchQuery, mode: 'insensitive' } },
      { lastName: { contains: searchQuery, mode: 'insensitive' } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  const formattedUsers = users.map((u) => ({
    ...u,
    roles: u.roles.map((r) => r.role),
  }))

  function buildUrl(newParams: Record<string, string | undefined>) {
    const merged = { role: roleFilter, search: searchQuery, page: String(page), ...newParams }
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(merged)) {
      if (value && value !== 'all' && value !== '1' && !(key === 'search' && value === '')) {
        query.set(key, value)
      }
    }
    const qs = query.toString()
    return `/dashboard/admin/users${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        badge="// SYSTEM USERS & ROLES"
        title="User Management"
        description="Create accounts with one-time credentials, assign organizer permissions, and manage staff access."
      />

      <CreateUserForm />

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-[#161614] p-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#f1efe8]/50">Filter:</span>
          <div className="flex gap-1.5">
            <Link
              href={buildUrl({ role: 'all', page: '1' })}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                roleFilter === 'all'
                  ? 'bg-[#d8763d] text-white'
                  : 'bg-white/5 text-[#f1efe8]/70 hover:bg-white/10'
              }`}
            >
              All
            </Link>
            <Link
              href={buildUrl({ role: 'ORGANIZER', page: '1' })}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wider font-bold transition-colors ${
                roleFilter === 'ORGANIZER'
                  ? 'bg-[#d8763d] text-white'
                  : 'bg-white/5 text-[#f1efe8]/70 hover:bg-white/10'
              }`}
            >
              Organizers
            </Link>
          </div>
        </div>

        <form className="flex flex-1 items-center gap-2" action="/dashboard/admin/users" method="GET">
          {roleFilter !== 'all' && <input type="hidden" name="role" value={roleFilter} />}
          <input
            type="text"
            name="search"
            placeholder="Search by name or email..."
            defaultValue={searchQuery}
            className="flex-1 rounded-lg border border-white/15 bg-[#11110f] px-3 py-1.5 text-xs font-mono text-[#f1efe8] placeholder:text-[#f1efe8]/40 focus:border-[#d8763d] focus:outline-none focus:ring-1 focus:ring-[#d8763d]"
          />
          <button
            type="submit"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-[#f1efe8] transition-colors hover:bg-white/10 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <p className="font-mono text-xs text-[#f1efe8]/50">
        Showing {formattedUsers.length} of {total} registered users
      </p>

      <UsersTable users={formattedUsers} currentAdminId={user.id} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 font-mono text-xs">
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 uppercase tracking-wider text-[#f1efe8] transition-colors hover:bg-white/10"
            >
              ← Previous
            </Link>
          )}
          <span className="text-[#f1efe8]/60">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 uppercase tracking-wider text-[#f1efe8] transition-colors hover:bg-white/10"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
