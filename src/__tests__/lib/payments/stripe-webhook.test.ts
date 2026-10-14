import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import * as fulfillment from '@/lib/orders/fulfillment'

const mockConstructEvent = vi.fn()

vi.mock('stripe', () => {
  return {
    default: function MockStripe() {
      return {
        webhooks: {
          constructEvent: mockConstructEvent,
        },
      }
    },
  }
})

vi.mock('@/lib/orders/fulfillment', () => ({
  fulfillOrder: vi.fn(),
}))

import { POST } from '@/app/api/webhooks/stripe/route'

describe('Stripe Webhook Handler', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: 'sk_test_mock_123',
      STRIPE_WEBHOOK_SECRET: 'whsec_mock_456',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns 500 when STRIPE_WEBHOOK_SECRET is not configured', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET

    const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const res = await POST(req)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Webhook secret not configured')
  })

  it('returns 400 when stripe-signature header is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Missing stripe-signature header')
  })

  it('returns 400 when signature verification fails', async () => {
    mockConstructEvent.mockImplementationOnce(() => {
      throw new Error('Invalid signature')
    })

    const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 't=123,v1=fake',
      },
      body: JSON.stringify({}),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Webhook signature verification failed')
  })

  it('fulfills order on checkout.session.completed when payment_status is paid', async () => {
    const mockEvent = {
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_session_1',
          payment_status: 'paid',
          payment_intent: 'pi_test_intent_1',
          metadata: {
            orderId: 'order_qatar_101',
          },
        },
      },
    }

    mockConstructEvent.mockReturnValueOnce(mockEvent)
    vi.mocked(fulfillment.fulfillOrder).mockResolvedValueOnce({
      id: 'order_qatar_101',
      status: 'PAID',
    } as unknown as Awaited<ReturnType<typeof fulfillment.fulfillOrder>>)

    const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 't=123,v1=valid',
      },
      body: JSON.stringify(mockEvent),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.received).toBe(true)

    expect(fulfillment.fulfillOrder).toHaveBeenCalledWith({
      orderId: 'order_qatar_101',
      paymentId: 'pi_test_intent_1',
    })
  })

  it('does not fulfill order when payment_status is unpaid', async () => {
    const mockEvent = {
      id: 'evt_test_unpaid',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_session_unpaid',
          payment_status: 'unpaid',
          metadata: {
            orderId: 'order_qatar_102',
          },
        },
      },
    }

    mockConstructEvent.mockReturnValueOnce(mockEvent)

    const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 't=123,v1=valid',
      },
      body: JSON.stringify(mockEvent),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(fulfillment.fulfillOrder).not.toHaveBeenCalled()
  })

  it('fulfills order on checkout.session.async_payment_succeeded when paid', async () => {
    const mockEvent = {
      id: 'evt_test_async',
      type: 'checkout.session.async_payment_succeeded',
      data: {
        object: {
          id: 'cs_test_session_async',
          payment_status: 'paid',
          payment_intent: 'pi_test_async_intent',
          metadata: {
            orderId: 'order_qatar_async',
          },
        },
      },
    }

    mockConstructEvent.mockReturnValueOnce(mockEvent)
    vi.mocked(fulfillment.fulfillOrder).mockResolvedValueOnce({
      id: 'order_qatar_async',
      status: 'PAID',
    } as unknown as Awaited<ReturnType<typeof fulfillment.fulfillOrder>>)

    const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 't=123,v1=valid',
      },
      body: JSON.stringify(mockEvent),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(fulfillment.fulfillOrder).toHaveBeenCalledWith({
      orderId: 'order_qatar_async',
      paymentId: 'pi_test_async_intent',
    })
  })

  it('acknowledges unhandled event types gracefully', async () => {
    const mockEvent = {
      id: 'evt_test_other',
      type: 'payment_intent.created',
      data: {
        object: {},
      },
    }

    mockConstructEvent.mockReturnValueOnce(mockEvent)

    const req = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'stripe-signature': 't=123,v1=valid',
      },
      body: JSON.stringify(mockEvent),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.received).toBe(true)
    expect(fulfillment.fulfillOrder).not.toHaveBeenCalled()
  })
})
