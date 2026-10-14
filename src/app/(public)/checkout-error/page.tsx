import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface CheckoutErrorPageProps {
  searchParams: Promise<{ error?: string; status?: string }>
}

const errorMessages: Record<string, string> = {
  order_not_found: 'The order could not be located in Qatar ticketing records.',
  invalid_token: 'The payment token is invalid or the session has expired.',
  invalid_status: 'The order is in an invalid state for payment processing.',
  no_payment_id: 'No payment confirmation was provided by the gateway.',
  not_approved: 'The transaction was declined by the issuer or card network.',
  capture_failed: 'Failed to capture the payment. Please try again.',
  capture_exception: 'An unexpected gateway error occurred during payment processing.',
  cancel_failed: 'Failed to cancel the reservation session.',
}

export default async function CheckoutErrorPage({ searchParams }: CheckoutErrorPageProps) {
  const params = await searchParams
  const errorCode = params.error || 'unknown'
  const errorMessage = errorMessages[errorCode] || 'An unexpected error occurred during ticket checkout.'

  return (
    <main className="min-h-[75vh] bg-[#11110f] text-[#f1efe8] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-6">
        <div className="border border-white/10 bg-[#161614] p-8 sm:p-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#d8763d]">
              CRUZE® / ORDER EXCEPTION
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#f1efe8]">
              PAYMENT ERROR<span className="text-[#d8763d]">.</span>
            </h1>
          </div>

          <p className="font-mono text-xs uppercase tracking-wider leading-relaxed text-[#f1efe8]/70">
            {errorMessage}
          </p>

          {params.status && (
            <p className="font-mono text-[10px] uppercase text-[#f1efe8]/45">
              Code: {params.status}
            </p>
          )}

          <div className="pt-4 flex flex-col gap-3 font-mono">
            <Link
              href="/events"
              className="w-full bg-[#d8763d] py-3 text-xs font-bold uppercase tracking-wider text-[#11110f] hover:bg-[#e2844d] transition-colors"
            >
              BROWSE EVENTS ↗
            </Link>

            <Link
              href="/"
              className="w-full border border-white/20 py-3 text-xs uppercase tracking-wider text-[#f1efe8] hover:border-white hover:bg-white/5 transition-colors"
            >
              RETURN TO HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
