import type { PaymentGatewayAdapter } from './types'
import { StripePaymentAdapter } from './adapters/stripe.adapter'
import { StubPaymentAdapter } from './adapters/stub.adapter'

/**
 * Payment Gateway Registry
 * Manages registered payment providers and resolves the active gateway.
 */
class PaymentGatewayRegistryImpl {
  private adapters = new Map<string, PaymentGatewayAdapter>()
  private defaultAdapterId: string = 'stripe'

  constructor() {
    // Register standard adapters
    this.registerAdapter(new StripePaymentAdapter())
    this.registerAdapter(new StubPaymentAdapter())
  }

  /**
   * Register a new gateway adapter (e.g. SkipCash, Sadad, QPay, ApplePayDirect)
   */
  registerAdapter(adapter: PaymentGatewayAdapter): void {
    this.adapters.set(adapter.id.toLowerCase(), adapter)
  }

  /**
   * Get an adapter by ID, or return the configured default
   */
  getAdapter(providerId?: string): PaymentGatewayAdapter {
    if (providerId) {
      const adapter = this.adapters.get(providerId.toLowerCase())
      if (adapter) return adapter
    }

    // Check configured environment override
    const envProvider = process.env.PAYMENT_GATEWAY_PROVIDER?.toLowerCase()
    if (envProvider && this.adapters.has(envProvider)) {
      const envAdapter = this.adapters.get(envProvider)!
      if (envAdapter.isConfigured()) return envAdapter
    }

    // Default to Stripe if configured
    const stripeAdapter = this.adapters.get('stripe')
    if (stripeAdapter && stripeAdapter.isConfigured()) {
      return stripeAdapter
    }

    // Fall back to stub adapter for safe local dev / sandbox
    return this.adapters.get('stub') || new StubPaymentAdapter()
  }

  /**
   * List all registered gateways and configuration status
   */
  listAdapters(): Array<{ id: string; name: string; isConfigured: boolean; supportedCurrencies: readonly string[] }> {
    return Array.from(this.adapters.values()).map((adapter) => ({
      id: adapter.id,
      name: adapter.name,
      isConfigured: adapter.isConfigured(),
      supportedCurrencies: adapter.supportedCurrencies,
    }))
  }
}

export const PaymentGatewayRegistry = new PaymentGatewayRegistryImpl()
