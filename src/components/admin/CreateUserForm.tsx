'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AccountType = 'ORGANIZER' | 'SUPER_ADMIN'

type CreatedUserData = {
  email: string
  oneTimePassword: string
  accountType: AccountType
}

export function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<CreatedUserData | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('ORGANIZER')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)
    setError(null)
    setCreated(null)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          accountType,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result?.message || 'Could not create user.')
        return
      }

      const data = result?.data as CreatedUserData
      setCreated(data)
      setFirstName('')
      setLastName('')
      setEmail('')
      setAccountType('ORGANIZER')
    } catch {
      setError('Could not create user.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#161614] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#f1efe8]">
          Provision New Curator or Admin Account
        </h2>
      </div>
      <p className="mt-2 text-xs font-mono text-[#f1efe8]/60">
        The user receives a temporary one-time credential and is prompted to establish a permanent password upon first access.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 px-3.5 py-2 font-mono text-xs text-red-400">
          {error}
        </p>
      ) : null}

      {created ? (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 font-mono text-xs text-emerald-300">
          <p className="font-bold uppercase tracking-wider text-emerald-400">Account Provisioned Successfully.</p>
          <div className="mt-2 space-y-1">
            <p>Email: <span className="text-white font-bold">{created.email}</span></p>
            <p>Role: <span className="text-white font-bold">{created.accountType}</span></p>
            <p className="mt-2 text-sm">
              One-Time Password:{' '}
              <span className="rounded bg-black/40 px-2 py-0.5 font-mono font-bold text-[#d8763d]">
                {created.oneTimePassword}
              </span>
            </p>
          </div>
          <p className="mt-2 text-[11px] text-emerald-400/80">
            Share this temporary credential securely with the curator. Password change is enforced at gate.
          </p>
        </div>
      ) : null}

      <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="create-first-name" required className="font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
            First Name
          </Label>
          <div className="mt-1">
            <Input
              id="create-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="e.g. Nasser"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="create-last-name" required className="font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
            Last Name
          </Label>
          <div className="mt-1">
            <Input
              id="create-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="e.g. Al-Attiyah"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="create-email" required className="font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
            Qatar Curator Email
          </Label>
          <div className="mt-1">
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="curator@cruze.qa"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="create-account-type" required className="font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
            Account Role
          </Label>
          <select
            id="create-account-type"
            className="mt-1 h-10 w-full rounded-lg border border-white/15 bg-[#11110f] px-3 font-mono text-xs text-[#f1efe8] focus:border-[#d8763d] focus:outline-none"
            value={accountType}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
            required
          >
            <option value="ORGANIZER">ORGANIZER (CURATOR)</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN (PLATFORM ADMIN)</option>
          </select>
        </div>

        <div className="flex items-end justify-start md:justify-end">
          <Button type="submit" isLoading={isLoading}>
            Provision Account ↗
          </Button>
        </div>
      </form>
    </div>
  )
}
