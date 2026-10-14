import Link from 'next/link'
import { requireOrganizerProfile } from '@/lib/dashboard/organizer'

export default async function OrganizerProfilePage() {
  const { user, organizerProfile } = await requireOrganizerProfile()
  const socialLinks = (organizerProfile?.socialLinks as Record<string, string> | null) || {}
  const orgName =
    organizerProfile?.orgName ||
    user.name ||
    user.email.split('@')[0] ||
    'Organization'
  const website = organizerProfile?.website || null
  const description = organizerProfile?.description || null

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#161614] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-6">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8763d]">
              // CURATOR CREDENTIALS
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#f1efe8]">
              {orgName}
              <span className="text-[#d8763d]">.</span>
            </h1>
            <p className="mt-1 text-xs font-mono text-[#f1efe8]/60">Verified platform curator profile</p>
          </div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#f1efe8] transition-colors hover:bg-white/10"
          >
            Edit Profile ↗
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 font-mono text-xs sm:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-[#11110f] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">Official Email</p>
            <p className="mt-1.5 text-sm text-[#f1efe8]">{user.email}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#11110f] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">Website</p>
            <p className="mt-1.5 text-sm">
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#d8763d] hover:underline"
                >
                  {website}
                </a>
              ) : (
                <span className="text-[#f1efe8]/40">Not configured</span>
              )}
            </p>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-white/5 bg-[#11110f] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">Curator Statement / Bio</p>
            <p className="mt-1.5 whitespace-pre-wrap font-sans text-sm text-[#f1efe8]/80 leading-relaxed">
              {description || 'No public curator description provided yet.'}
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#11110f] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1efe8]/50">LinkedIn / Public Channel</p>
            <p className="mt-1.5 text-sm text-[#f1efe8]">{socialLinks.linkedin || 'Not linked'}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
