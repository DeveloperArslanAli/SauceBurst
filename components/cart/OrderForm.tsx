'use client';

import { useState } from 'react';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Updated Zod Schema: Name and Phone are REQUIRED
const orderSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  phone: z.string().regex(/^03\d{9}$/, 'Phone must be in the format 03xxxxxxxxx (11 digits).'),
});

export default function OrderForm() {
  const { cart, totalPrice, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // Validate inputs
    const validation = orderSchema.safeParse({ name, phone });
    if (!validation.success) {
      const errorMsg = validation.error.issues[0].message;
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer_name: name,
        customer_phone: phone,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: totalPrice,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to place order');
      }

      const { order } = await res.json();
      
      // Clear cart and redirect to confirmation page
      clearCart();
      router.push(`/order/${order.id}`);
      toast.success('Order placed successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#2a2a2a] border border-[#ffd700]/20 rounded-lg p-6">
      <h2 className="text-xl font-bold text-[#ffd700] mb-4">Customer Details</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Phone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]"
            placeholder="03xxxxxxxxx"
          />
          <p className="text-xs text-gray-500 mt-1">Format: 03xxxxxxxxx</p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading || cart.length === 0}
          className="w-full mt-4 py-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}