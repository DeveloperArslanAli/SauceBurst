import supabaseAdmin from '@/app/lib/supabaseAdmin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OrderConfirmationClient from '@/components/order/OrderConfirmationClient';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !order) return notFound();

  const items = JSON.parse(order.notes || '[]');

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-black text-[#ffd700] mb-2">Order Received! 🎉</h1>
      <p className="text-gray-400 mb-6">Thank you for your order. Please confirm it via WhatsApp below.</p>
      
      <div className="bg-[#2a2a2a] border border-[#ffd700]/20 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-[#ffd700] border-b border-[#ffd700]/10 pb-3 mb-4">Order Summary</h2>
        <div className="space-y-2">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between text-gray-300 text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#ffd700]/10 flex justify-between text-white font-bold text-lg">
          <span>Total</span>
          <span>Rs. {order.total_amount}</span>
        </div>
      </div>

      <div className="bg-[#2a2a2a] border border-[#ffd700]/20 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-300 mb-2">Customer Details</h2>
        <p className="text-white">Name: {order.customer_name || 'Guest'}</p>
        <p className="text-white">Phone: {order.customer_phone || 'N/A'}</p>
      </div>

      {/* Pass customer details to the client component */}
      <OrderConfirmationClient 
        orderId={id} 
        total={order.total_amount} 
        items={items}
        customerName={order.customer_name || 'Guest'}
        customerPhone={order.customer_phone || 'N/A'}
      />
      
      <Link href="/" className="block mt-6 text-center text-[#ffd700] hover:underline">
        ← Continue Shopping
      </Link>
    </div>
  );
}