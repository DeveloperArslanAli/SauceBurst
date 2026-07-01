/**
 * @jest-environment node
 */
import { testApiHandler } from 'next-test-api-route-handler';
import * as orderRoute from '@/app/api/orders/route';

// ✅ Must mock BEFORE any import of the module
jest.mock('@/app/lib/supabaseAdmin', () => ({
  __esModule: true,
  default: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: { id: 'mock-order-123' },
      error: null,
    }),
  },
}));

describe('POST /api/orders', () => {
  it('should return 201 and the order ID on successful submission', async () => {
    await testApiHandler({
      appHandler: orderRoute,
      params: {},
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify({
            customer_name: 'Test User',
            customer_phone: '03211234567',
            total_amount: 12.49,
            items: [{ id: '1', name: 'Burger', quantity: 1, price: 12.49 }],
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data).toEqual({ order: { id: 'mock-order-123' } });
      },
    });
  });

  it('should return 500 on Supabase error', async () => {
    // ✅ Dynamically require after mocking to get the mocked version
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockSupabase = require('@/app/lib/supabaseAdmin').default;
    mockSupabase.from.mockReturnThis();
    mockSupabase.insert.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'DB Error' },
    });

    await testApiHandler({
      appHandler: orderRoute,
      params: {},
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify({ customer_name: 'Test User', customer_phone: '03211234567', total_amount: 10, items: [] }),
          headers: { 'Content-Type': 'application/json' },
        });

        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data).toEqual({ error: 'DB Error' });
      },
    });
  });
});