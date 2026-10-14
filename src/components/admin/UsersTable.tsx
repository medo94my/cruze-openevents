'use client'

import { useState } from 'react'
import { Role } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/toaster'

type User = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  createdAt: Date
  roles: Role[]
}

type UsersTableProps = {
  users: User[]
  currentAdminId: string
}

type AccountType = 'ORGANIZER' | 'SUPER_ADMIN'

function resolveAccountType(roles: Role[]): AccountType {
  if (roles.includes('SUPER_ADMIN')) return 'SUPER_ADMIN'
  return 'ORGANIZER'
}

export function UsersTable({ users, currentAdminId }: UsersTableProps) {
  const showToast = useToast()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<Record<string, AccountType>>({})
  const [pendingDeactivate, setPendingDeactivate] = useState<{ id: string; email: string } | null>(null)

  async function handleAccountTypeUpdate(userId: string, role: AccountType) {
    if (!confirm(`Are you sure you want to set account type to ${role}?`)) {
      return
    }

    setBusyId(userId)
    setBusyAction('role')
    setError(null)

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message || json?.error || 'Failed to update account type')
      }

      window.location.reload()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Action failed')
    } finally {
      setBusyId(null)
      setBusyAction(null)
    }
  }

  async function handleResetPassword(userId: string) {
    setBusyId(userId)
    setBusyAction('reset')
    setError(null)

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message || json?.error || 'Failed to send reset email')
      }

      showToast('Password reset email sent', 'success')
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Action failed')
    } finally {
      setBusyId(null)
      setBusyAction(null)
    }
  }

  async function handleDeactivate(userId: string) {
    setBusyId(userId)
    setBusyAction('deactivate')
    setError(null)

    try {
      const response = await fetch(`/api/admin/users/${userId}/deactivate`, {
        method: 'POST',
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message || json?.error || 'Failed to deactivate user')
      }

      showToast('User account deactivated', 'success')
      window.location.reload()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Action failed')
    } finally {
      setBusyId(null)
      setBusyAction(null)
      setPendingDeactivate(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center font-mono text-xs text-[#f1efe8]/50">
        No users match the current filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161614] shadow-sm">
      {error ? (
        <p className="border-b border-red-500/20 bg-red-950/30 px-4 py-3 font-mono text-xs text-red-400">{error}</p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-[#1a1a18]">
            <tr>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Name</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Email</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Roles</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Joined</th>
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Account Type</th>
              <th className="px-5 py-3.5 text-right font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f1efe8]/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => {
              const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
              const isSelf = user.id === currentAdminId
              const currentType = resolveAccountType(user.roles)
              const selectedType = selectedTypes[user.id] ?? currentType
              const hasChanges = selectedType !== currentType

              return (
                <tr key={user.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#f1efe8]">{fullName || '—'}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[#f1efe8]/70">{user.email}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            role === 'SUPER_ADMIN'
                              ? 'border-[#d8763d]/40 bg-amber-950/40 text-[#d8763d]'
                              : role === 'ORGANIZER'
                                ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-400'
                                : 'border-white/10 bg-white/5 text-[#f1efe8]/60'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[#f1efe8]/70">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    {isSelf ? (
                      <span className="inline-block h-9 min-w-[150px] rounded-lg border border-white/10 bg-[#11110f] px-3 font-mono text-xs leading-9 text-[#f1efe8]/60">
                        {currentType}
                      </span>
                    ) : (
                      <select
                        value={selectedType}
                        disabled={busyId === user.id}
                        onChange={(event) => {
                          setSelectedTypes((prev) => ({
                            ...prev,
                            [user.id]: event.target.value as AccountType,
                          }))
                        }}
                        className="h-9 min-w-[150px] rounded-lg border border-white/15 bg-[#11110f] px-3 font-mono text-xs text-[#f1efe8] focus:border-[#d8763d] focus:outline-none"
                      >
                        <option value="ORGANIZER">ORGANIZER</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {isSelf ? (
                        <span className="font-mono text-xs text-[#f1efe8]/40">You</span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            isLoading={busyId === user.id && busyAction === 'role'}
                            disabled={!hasChanges || (busyId === user.id && busyAction !== 'role')}
                            onClick={() => handleAccountTypeUpdate(user.id, selectedType)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={busyId === user.id && busyAction === 'reset'}
                            disabled={busyId === user.id && busyAction !== 'reset'}
                            onClick={() => handleResetPassword(user.id)}
                          >
                            Reset Password
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            isLoading={busyId === user.id && busyAction === 'deactivate'}
                            disabled={busyId === user.id && busyAction !== 'deactivate'}
                            onClick={() => setPendingDeactivate({ id: user.id, email: user.email })}
                          >
                            Deactivate
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={pendingDeactivate !== null}
        title="Deactivate User Account"
        description={`This will permanently deactivate ${pendingDeactivate?.email}. All their events will be cancelled, orders refunded, and their account anonymized. This action cannot be undone.`}
        confirmLabel="Deactivate"
        isLoading={busyId === pendingDeactivate?.id && busyAction === 'deactivate'}
        onConfirm={() => {
          if (pendingDeactivate) handleDeactivate(pendingDeactivate.id)
        }}
        onClose={() => setPendingDeactivate(null)}
      />
    </div>
  )
}
