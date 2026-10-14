import { describe, it, expect, beforeEach } from 'vitest'
import {
  PaymentGatewayRegistry,
  createPaymentIntent,
  capturePayment,
  getPaymentStatus,
  processRefund,
  type PaymentGatewayAdapter,
  type CreatePaymentOptions,
  type PaymentIntent,
  type CapturePaymentResult,
  type RefundOptions,
  type RefundResult,
  type GatewayStatusResult,
} from '@/lib/payments'

describe('Payment Gateway Adapter Architecture', () => {
  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY
    delete process.env.PAYMENT_GATEWAY_PROVIDER
  })

  it('resolves stub gateway when no external provider is configured', () => {
    const adapter = PaymentGatewayRegistry.getAdapter()
    expect(adapter.id).toBe('stub')
    expect(adapter.isConfigured()).toBe(true)
  })

  it('creates payment session through the active gateway adapter', async () => {
    const intent = await createPaymentIntent({
      orderId: 'order_123',
      amount: 250,
      currency: 'QAR',
      description: 'Cruze Katara Symphony Access',
      returnUrl: 'https://cruze.qa/capture',
      cancelUrl: 'https://cruze.qa/cancel',
    })

    expect(intent.id).toMatch(/^stub_/)
    expect(intent.amount).toBe(250)
    expect(intent.currency).toBe('QAR')
    expect(intent.status).toBe('pending')
    expect(intent.approvalUrl).toContain('order_123')
  })

  it('captures payment and retrieves status through adapter', async () => {
    const capture = await capturePayment('sess_qatar_999')
    expect(capture.status).toBe('completed')
    expect(capture.captureId).toBe('cap_sess_qatar_999')

    const status = await getPaymentStatus('sess_qatar_999')
    expect(status.isApproved).toBe(true)
  })

  it('processes refund through adapter', async () => {
    const refund = await processRefund({
      captureId: 'cap_123',
      amount: 150,
      currency: 'QAR',
      reason: 'Customer requested reschedule',
    })

    expect(refund.status).toBe('completed')
    expect(refund.refundId).toMatch(/^ref_mock_/)
  })

  it('allows dynamic registration of regional Qatari payment gateway (e.g. SkipCash)', async () => {
    class MockSkipCashAdapter implements PaymentGatewayAdapter {
      readonly id = 'skipcash'
      readonly name = 'SkipCash Qatar'
      readonly supportedCurrencies = ['QAR'] as const

      isConfigured(): boolean {
        return true
      }

      async createPaymentSession(options: CreatePaymentOptions): Promise<PaymentIntent> {
        return {
          id: `skipcash_pay_${options.orderId}`,
          amount: options.amount,
          currency: options.currency,
          status: 'pending',
          approvalUrl: `https://skipcash.app/pay/mock_${options.orderId}`,
          provider: this.id,
          createdAt: new Date(),
        }
      }

      async capturePayment(paymentSessionId: string): Promise<CapturePaymentResult> {
        return {
          captureId: `sc_cap_${paymentSessionId}`,
          status: 'completed',
          amount: 100,
          currency: 'QAR',
          provider: this.id,
        }
      }

      async getPaymentStatus(id: string): Promise<GatewayStatusResult> {
        void id
        return { status: 'PAID', isApproved: true }
      }

      async refund(options: RefundOptions): Promise<RefundResult> {
        void options
        return { refundId: 'sc_ref_1', status: 'completed', provider: this.id }
      }
    }

    // Register adapter
    PaymentGatewayRegistry.registerAdapter(new MockSkipCashAdapter())

    // Request adapter explicitly
    const resolved = PaymentGatewayRegistry.getAdapter('skipcash')
    expect(resolved.id).toBe('skipcash')
    expect(resolved.name).toBe('SkipCash Qatar')

    // Create payment using SkipCash
    const intent = await createPaymentIntent({
      orderId: 'order_qatar_456',
      amount: 300,
      currency: 'QAR',
      returnUrl: 'https://cruze.qa/success',
      cancelUrl: 'https://cruze.qa/cancel',
    }, 'skipcash')

    expect(intent.provider).toBe('skipcash')
    expect(intent.approvalUrl).toBe('https://skipcash.app/pay/mock_order_qatar_456')
  })
})
