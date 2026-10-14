'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type DeletionNotice = 'requested' | 'scheduled' | 'cancelled' | 'invalid' | 'expired' | null

type AccountSettingsProps = {
  userEmail: string
  updateEmailAction: (formData: FormData) => Promise<void>
  changePasswordAction: (formData: FormData) => Promise<void>
  deleteAccountAction: (formData: FormData) => Promise<void>
  cancelDeletionAction: (formData: FormData) => Promise<void>
  deletionRequestedAt: Date | null
  deletionScheduledFor: Date | null
  deletionNotice: DeletionNotice
}

export function AccountSettings({
  userEmail,
  updateEmailAction,
  changePasswordAction,
  deleteAccountAction,
  cancelDeletionAction,
  deletionRequestedAt,
  deletionScheduledFor,
  deletionNotice,
}: AccountSettingsProps) {
  const hasPendingConfirmation = Boolean(deletionRequestedAt) && !deletionScheduledFor
  const hasScheduledDeletion = Boolean(deletionScheduledFor)
  const scheduledForLabel = deletionScheduledFor
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(deletionScheduledFor)
    : null

  const noticeMessage =
    deletionNotice === 'requested'
      ? 'Deletion confirmation email sent. Please check your inbox.'
      : deletionNotice === 'scheduled'
        ? 'Account deletion confirmed and scheduled.'
        : deletionNotice === 'cancelled'
          ? 'Account deletion request canceled.'
          : deletionNotice === 'expired'
            ? 'Deletion confirmation link expired. Request a new one.'
            : deletionNotice === 'invalid'
              ? 'Invalid or expired account deletion link.'
              : null

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()

  function handleConfirmDelete() {
    startDeleteTransition(async () => {
      await deleteAccountAction(new FormData())
      setDeleteConfirmOpen(false)
    })
  }

  return (
    <div className="space-y-6">
      {noticeMessage ? (
        <section className="rounded-2xl border border-white/10 bg-[#161614] px-4 py-3 font-mono text-xs text-[#f1efe8]">
          <span className="text-[#d8763d] mr-2">NOTICE //</span>
          {noticeMessage}
        </section>
      ) : null}

      <form action={updateEmailAction} className="space-y-4 rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
          <h1 className="text-base font-bold uppercase tracking-tight text-[#f1efe8]">
            Account Email Address
          </h1>
        </div>
        <div>
          <Label htmlFor="email" required className="font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
            Primary Email
          </Label>
          <div className="mt-1">
            <Input id="email" name="email" type="email" defaultValue={userEmail} required />
          </div>
        </div>
        <div className="pt-2">
          <Button type="submit">Update Email ↗</Button>
        </div>
      </form>

      <form action={changePasswordAction} className="space-y-4 rounded-2xl border border-white/10 bg-[#161614] p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="h-2 w-2 rounded-full bg-[#d8763d]" />
          <h2 className="text-base font-bold uppercase tracking-tight text-[#f1efe8]">
            Change Access Password
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="currentPassword" required className="font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
              Current Password
            </Label>
            <div className="mt-1">
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword" required className="font-mono text-[11px] uppercase tracking-wider text-[#f1efe8]/70">
              New Password
            </Label>
            <div className="mt-1">
              <Input id="newPassword" name="newPassword" type="password" required />
            </div>
          </div>
        </div>
        <div className="pt-2">
          <Button type="submit">Change Password ↗</Button>
        </div>
      </form>

      <section className="space-y-4 rounded-2xl border border-red-500/30 bg-[#161614] p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-red-500/20 pb-3">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <h2 className="text-base font-bold uppercase tracking-tight text-red-400">
            Danger Zone: Delete Account
          </h2>
        </div>

        {hasScheduledDeletion ? (
          <>
            <p className="text-xs font-mono text-[#f1efe8]/70">
              {`Your account deletion is scheduled for ${scheduledForLabel || ''}. You can cancel this during the grace period.`}
            </p>
            <form action={cancelDeletionAction}>
              <Button type="submit" variant="outline">Cancel Deletion Request</Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-xs font-mono text-[#f1efe8]/70">
              Request account deletion by email confirmation. After confirmation, your account enters a grace period before permanent anonymization.
            </p>
            {hasPendingConfirmation ? (
              <p className="text-xs font-mono text-amber-300">
                Check your inbox to confirm deletion. You can request another confirmation email if the previous link expired.
              </p>
            ) : null}
            <div>
              <Button
                type="button"
                variant="destructive"
                isLoading={isDeleting}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                {hasPendingConfirmation ? 'Resend Confirmation Email' : 'Delete Account ↗'}
              </Button>
            </div>
          </>
        )}
      </section>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title={hasPendingConfirmation ? 'Resend deletion confirmation?' : 'Delete your account?'}
        description={
          hasPendingConfirmation
            ? 'A new confirmation email will be sent to your inbox. Follow the link to confirm account deletion.'
            : 'A confirmation email will be sent to your inbox. After you confirm, your account will enter a grace period before being permanently deleted. This cannot be undone.'
        }
        confirmLabel={hasPendingConfirmation ? 'Resend Email' : 'Send Confirmation Email'}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirmOpen(false)}
      />
    </div>
  )
}
