import type {
  PaymentGatewayAdapter,
  CreatePaymentOptions,
  PaymentIntent,
  CapturePaymentResult,
  RefundOptions,
  RefundResult,
  GatewayStatusResult,
} from '../types'

export class StubPaymentAdapter implements PaymentGatewayAdapter {
  readonly id = 'stub'
  readonly name = 'Simulated Sandbox Gateway'
  readonly supportedCurrencies = ['QAR', 'USD', 'EUR', 'GBP', 'SEK'] as const

  isConfigured(): boolean {
    return true
  }

  async createPaymentSession(options: CreatePaymentOptions): Promise<PaymentIntent> {
    const stubId = `stub_${Date.now()}_${Math.random().toString(36).substring(7)}`

    return {
      id: stubId,
      amount: options.amount,
      currency: options.currency,
      status: 'pending',
      approvalUrl: `${options.returnUrl}?token=${stubId}&session_id=${stubId}&order_id=${options.orderId}`,
      provider: this.id,
      createdAt: new Date(),
    }
  }

  async capturePayment(paymentSessionId: string): Promise<CapturePaymentResult> {
    return {
      captureId: `cap_${paymentSessionId}`,
      status: 'completed',
      amount: 0,
      currency: 'QAR',
      provider: this.id,
    }
  }

  async getPaymentStatus(_paymentSessionId: string): Promise<GatewayStatusResult> {
    return {
      status: 'complete:paid',
      isApproved: true,
      transactionId: `tx_mock_${Date.now()}`,
    }
  }

  async refund(_options: RefundOptions): Promise<RefundResult> {
    return {
      refundId: `ref_mock_${Date.now()}`,
      status: 'completed',
      provider: this.id,
    }
  }
}
