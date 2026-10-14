import type {
  PaymentGatewayAdapter,
  CreatePaymentOptions,
  PaymentIntent,
  CapturePaymentResult,
  RefundOptions,
  RefundResult,
  GatewayStatusResult,
} from '../types'
import {
  createStripeCheckoutSession,
  captureStripeCheckoutSession,
  getStripePaymentStatus,
  refundStripePayment,
  isStripeConfigured,
} from '../stripe'

export class StripePaymentAdapter implements PaymentGatewayAdapter {
  readonly id = 'stripe'
  readonly name = 'Stripe (Apple Pay & Cards)'
  readonly supportedCurrencies = ['QAR', 'USD', 'EUR', 'GBP', 'AED', 'SAR'] as const

  isConfigured(): boolean {
    return isStripeConfigured()
  }

  async createPaymentSession(options: CreatePaymentOptions): Promise<PaymentIntent> {
    const result = await createStripeCheckoutSession({
      orderId: options.orderId,
      amount: options.amount,
      currency: options.currency,
      description: options.description,
      returnUrl: options.returnUrl,
      cancelUrl: options.cancelUrl,
    })

    return {
      id: result.checkoutSessionId,
      amount: options.amount,
      currency: options.currency,
      status: 'pending',
      approvalUrl: result.checkoutUrl,
      provider: this.id,
      createdAt: new Date(),
    }
  }

  async capturePayment(paymentSessionId: string): Promise<CapturePaymentResult> {
    const result = await captureStripeCheckoutSession(paymentSessionId)

    return {
      captureId: result.captureId,
      status: result.status === 'COMPLETED' ? 'completed' : 'failed',
      amount: parseFloat(result.amount),
      currency: result.currency,
      provider: this.id,
    }
  }

  async getPaymentStatus(paymentSessionId: string): Promise<GatewayStatusResult> {
    return getStripePaymentStatus(paymentSessionId)
  }

  async refund(options: RefundOptions): Promise<RefundResult> {
    const result = await refundStripePayment({
      captureId: options.captureId,
      amount: options.amount,
      currency: options.currency,
      reason: options.reason,
    })

    return {
      refundId: result.refundId,
      status: result.status === 'COMPLETED' ? 'completed' : result.status === 'PENDING' ? 'pending' : 'failed',
      provider: this.id,
    }
  }
}
