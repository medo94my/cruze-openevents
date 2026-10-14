/**
 * Payment Gateway Adapter Interfaces & Contracts
 * 
 * Provides an extensible, provider-agnostic abstraction layer so Cruze can
 * run Stripe today and plug in Qatari and regional payment gateways
 * (SkipCash, Sadad, QPay, Apple Pay Direct) without touching core order logic.
 */

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  approvalUrl?: string
  clientSecret?: string // For embedded Apple Pay / Stripe Elements
  provider?: string
  createdAt: Date
}

export interface CreatePaymentOptions {
  amount: number
  currency: string
  orderId: string
  description?: string
  customer?: {
    email: string
    name?: string
    phone?: string
  }
  returnUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export interface CapturePaymentResult {
  captureId: string
  status: PaymentStatus
  amount: number
  currency: string
  provider?: string
}

export interface RefundOptions {
  captureId: string
  amount?: number
  currency?: string
  reason?: string
}

export interface RefundResult {
  refundId: string
  status: 'pending' | 'completed' | 'failed'
  provider?: string
}

export interface GatewayStatusResult {
  status: string
  isApproved: boolean
  transactionId?: string
}

/**
 * Universal Payment Gateway Adapter Contract
 */
export interface PaymentGatewayAdapter {
  /** Unique identifier for the provider (e.g. 'stripe', 'skipcash', 'sadad', 'qpay', 'stub') */
  readonly id: string

  /** Human-readable display label */
  readonly name: string

  /** Supported ISO currencies (e.g. ['QAR', 'USD', 'EUR']) */
  readonly supportedCurrencies: readonly string[]

  /** Whether the gateway has valid environment configuration */
  isConfigured(): boolean

  /** Create an external checkout session or payment intent */
  createPaymentSession(options: CreatePaymentOptions): Promise<PaymentIntent>

  /** Capture or finalize the payment upon return or webhook confirmation */
  capturePayment(paymentSessionId: string): Promise<CapturePaymentResult>

  /** Check current session / authorization status */
  getPaymentStatus(paymentSessionId: string): Promise<GatewayStatusResult>

  /** Process refund for a captured charge */
  refund(options: RefundOptions): Promise<RefundResult>
}
