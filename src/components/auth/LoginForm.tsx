'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

const REMEMBER_EMAIL_COOKIE = 'oe_remember_email'

function readRememberedEmail(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${REMEMBER_EMAIL_COOKIE}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : ''
}

function saveRememberedEmail(email: string) {
  const expires = new Date()
  expires.setDate(expires.getDate() + 30)
  document.cookie = `${REMEMBER_EMAIL_COOKIE}=${encodeURIComponent(email)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function clearRememberedEmail() {
  document.cookie = `${REMEMBER_EMAIL_COOKIE}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const verified = searchParams.get('verified')
  const urlError = searchParams.get('error')
  const message = searchParams.get('message')

  const getInitialMessage = () => {
    if (verified === 'true')
      return { type: 'success', text: 'Email verified successfully! You can now log in.' }
    if (message === 'already_verified')
      return { type: 'info', text: 'Your email is already verified. Please log in.' }
    if (urlError === 'token_expired')
      return { type: 'error', text: 'Verification link has expired. Please request a new one.' }
    if (urlError === 'invalid_token')
      return { type: 'error', text: 'Invalid verification link.' }
    return null
  }

  const initialMessage = getInitialMessage()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    const email = readRememberedEmail()
    if (email) {
      setValue('email', email)
      setRememberMe(true)
    }
  }, [setValue])

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    if (rememberMe) {
      saveRememberedEmail(data.email)
    } else {
      clearRememberedEmail()
    }

    let redirecting = false

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        redirecting = true
        setIsRedirecting(true)

        const session = await getSession()
        const callbackUrl = searchParams.get('callbackUrl')
        if (session?.user?.mustChangePassword) {
          const choosePasswordUrl = callbackUrl
            ? `/choose-password?callbackUrl=${encodeURIComponent(callbackUrl)}`
            : '/choose-password'
          router.push(choosePasswordUrl)
          router.refresh()
          return
        }

        if (callbackUrl) {
          router.push(callbackUrl)
          router.refresh()
          return
        }

        const roles = session?.user?.roles || []
        const isOrganizerOrAdmin =
          roles.includes('ORGANIZER') || roles.includes('SUPER_ADMIN')
        router.push(isOrganizerOrAdmin ? '/dashboard' : '/events')
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      if (!redirecting) setIsLoading(false)
    }
  }

  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-50 bg-white animate-pulse">
        {/* Navbar skeleton */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="h-7 w-32 rounded-lg bg-gray-200" />
            <div className="flex items-center gap-4">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-5 w-16 rounded bg-gray-200" />
              <div className="h-9 w-9 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Page content skeleton */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-6 space-y-2">
            <div className="h-8 w-48 rounded-lg bg-gray-200" />
            <div className="h-5 w-64 rounded bg-gray-200" />
          </div>

          {/* Stats row */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="mt-2 h-7 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Content blocks */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-4 h-5 w-32 rounded bg-gray-200" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-3">
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 rounded bg-gray-200" />
                      <div className="h-3 w-24 rounded bg-gray-200" />
                    </div>
                    <div className="h-5 w-14 rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-4 h-5 w-28 rounded bg-gray-200" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                      <div className="h-3 w-20 rounded bg-gray-200" />
                    </div>
                    <div className="h-4 w-14 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-white/15 bg-[#11110f] text-[#f1efe8] p-6 sm:p-10 shadow-2xl font-mono">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-2">
          CRUZE® / AUTHENTICATION / QATAR
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#f1efe8]">
          SIGN IN<span>.</span>
        </h1>
        <p className="mt-2 text-xs uppercase tracking-wider text-white/50">
          Access your bookings, passes, and curated Qatar events
        </p>
      </div>

      {/* URL-based status messages */}
      {initialMessage && (
        <div
          className={`mb-6 p-4 text-xs font-mono uppercase tracking-wider border ${
            initialMessage.type === 'success'
              ? 'bg-green-950/40 text-green-300 border-green-800'
              : initialMessage.type === 'error'
              ? 'bg-red-950/40 text-red-300 border-red-800'
              : 'bg-blue-950/40 text-blue-300 border-blue-800'
          }`}
        >
          {initialMessage.text}
        </div>
      )}

      {/* Sign-in error */}
      {error && (
        <div className="mb-6 p-4 text-xs font-mono uppercase tracking-wider bg-red-950/40 text-red-300 border border-red-800">
          {error}
          {error.toLowerCase().includes('verify') && (
            <span>
              {' '}
              <Link href="/verify-email" className="underline font-semibold text-[#d8763d] hover:text-white">
                Resend verification email ↗
              </Link>
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-wider text-white/60">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="email"
              placeholder="YOUR@EMAIL.COM"
              autoComplete="email"
              disabled={isLoading}
              className="h-12 w-full border border-white/20 bg-white/[0.03] pl-11 pr-4 text-xs tracking-wider text-[#f1efe8] placeholder:text-white/20 focus:border-[#d8763d] focus:outline-none disabled:opacity-50"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-wider text-white/60">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className="h-12 w-full border border-white/20 bg-white/[0.03] pl-11 pr-11 text-xs tracking-wider text-[#f1efe8] placeholder:text-white/20 focus:border-[#d8763d] focus:outline-none disabled:opacity-50"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white disabled:opacity-50"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-white/60">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-[#d8763d]"
            />
            <span>Remember credentials</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[#d8763d] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Terms links */}
        <p className="text-center text-[10px] text-white/40">
          By continuing, you agree to our{' '}
          <Link
            href="/terms"
            className="text-[#d8763d] hover:underline"
          >
            Terms
          </Link>
          {' '}and{' '}
          <Link
            href="/privacy"
            className="text-[#d8763d] hover:underline"
          >
            Privacy
          </Link>
        </p>

        {/* Login button at the bottom */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center bg-[#f1efe8] !text-[#11110f] text-xs font-black uppercase tracking-wider transition-colors hover:bg-[#d8763d] hover:!text-[#11110f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin !text-[#11110f]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            'AUTHENTICATE / ENTER ↗'
          )}
        </button>
      </form>
    </div>
  )
}
