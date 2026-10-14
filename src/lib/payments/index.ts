/**
 * Payment Service (Adapter Pattern)
 *
 * Routes all payments through the universal PaymentGatewayAdapter.
 * Uses Stripe (with Apple Pay & cards) by default, while supporting
 * dynamic runtime selection and registration of future gateways (SkipCash, Sadad, QPay).
 */

import { PaymentGatewayRegistry } from './registry'
import type {
  PaymentIntent,
  CreatePaymentOptions,
  CapturePaymentResult,
  RefundOptions,
  RefundResult,
  GatewayStatusResult,
} from './types'

export * from './types'
export * from './registry'
export { StripePaymentAdapter } from './adapters/stripe.adapter'
export { StubPaymentAdapter } from './adapters/stub.adapter'

/**
 * Create a payment session/intent using the resolved gateway adapter
 */
export async function createPaymentIntent(
  options: CreatePaymentOptions,
  providerId?: string
): Promise<PaymentIntent> {
  const adapter = PaymentGatewayRegistry.getAdapter(providerId)
  return adapter.createPaymentSession(options)
}

/**
 * Capture a payment after user approval or webhook
 */
export async function capturePayment(
  paymentSessionId: string,
  providerId?: string
): Promise<CapturePaymentResult> {
  const adapter = PaymentGatewayRegistry.getAdapter(providerId)
  return adapter.capturePayment(paymentSessionId)
}

/**
 * Get payment/session status from the gateway
 */
export async function getPaymentStatus(
  paymentSessionId: string,
  providerId?: string
): Promise<GatewayStatusResult> {
  const adapter = PaymentGatewayRegistry.getAdapter(providerId)
  return adapter.getPaymentStatus(paymentSessionId)
}

/**
 * Process a refund through the gateway
 */
export async function processRefund(
  options: RefundOptions,
  providerId?: string
): Promise<RefundResult> {
  const adapter = PaymentGatewayRegistry.getAdapter(providerId)
  return adapter.refund(options)
}

/**
 * Cancel a pending payment
 */
export async function cancelPayment(paymentSessionId: string): Promise<void> {
  console.log('[Payment] Cancelling payment session:', paymentSessionId)
}

/**
 * Check if the active payment gateway is in test/sandbox mode
 */
export function isTestMode(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') === true
}

/**
 * Check if the payment provider is configured
 */
export function isPaymentProviderConfigured(providerId?: string): boolean {
  return PaymentGatewayRegistry.getAdapter(providerId).isConfigured()
}

/**
 * Generate URLs for redirect payment flow
 */
export function generatePaymentUrls(
  baseUrl: string,
  orderId: string
): { returnUrl: string; cancelUrl: string } {
  return {
    returnUrl: `${baseUrl}/api/orders/${orderId}/capture`,
    cancelUrl: `${baseUrl}/api/orders/${orderId}/cancel`,
  }
}
