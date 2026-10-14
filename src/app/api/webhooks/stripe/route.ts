import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillOrder } from '@/lib/orders/fulfillment'

export const dynamic = 'force-dynamic'

function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey)
}

/**
 * Stripe Webhook Handler (Stripe Best Practices compliant)
 * Handles checkout.session.completed and checkout.session.async_payment_succeeded
 * with idempotent fulfillment and signature validation.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    console.warn('[Stripe Webhook] Missing stripe-signature header')
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  const rawBody = await request.text()

  try {
    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown signature error'
    console.error('[Stripe Webhook] Signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session

        // Gated on payment_status per Stripe best practices
        if (session.payment_status === 'paid') {
          const orderId = session.metadata?.orderId

          if (orderId) {
            const paymentId = typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.id

            console.log(`[Stripe Webhook] Fulfilling order ${orderId} for event ${event.type}`)
            await fulfillOrder({
              orderId,
              paymentId,
            })
          } else {
            console.warn('[Stripe Webhook] Session completed without orderId in metadata:', session.id)
          }
        } else {
          console.log(`[Stripe Webhook] Session ${session.id} status is ${session.payment_status}; awaiting completion`)
        }
        break
      }

      default:
        // Acknowledge other events gracefully
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`[Stripe Webhook] Error processing event ${event.type}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 }
    )
  }
}
