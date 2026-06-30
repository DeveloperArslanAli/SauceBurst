'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/orders';
import toast from 'react-hot-toast';
import OrderStatusBadge from './OrderStatusBadge';
import OrderDetailsModal from './OrderDetailsModal';

export default function OrdersTable({ orders }: { orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Status updated successfully!');
    }
  };

  return (
    <>
      <div className="bg-[#2a2a2a] rounded-lg border border-[#ffd700]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-xs font-semibold border-b border-[#ffd700]/10">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffd700]/10">
              {orders && orders.length > 0 ? (
                orders.map((order) => {
                  // Parse items from notes (stored as JSON)
                  let items = [];
                  try { items = JSON.parse(order.notes || '[]'); } catch (e) {}

                  return (
                    <tr key={order.id} className="hover:bg-[#333] transition">
                      <td className="px-6 py-4 font-mono text-white text-xs">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-white">{order.customer_name || 'Guest'}</td>
                      <td className="px-6 py-4 text-gray-300">{order.customer_phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-[#ffd700] font-bold">Rs. {order.total_amount}</td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status || 'pending'} />
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 flex gap-2 items-center">
                        {/* View Items Modal Trigger */}
                        <button
                          onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                          className="px-3 py-1 bg-[#ffd700] text-[#1a1a1a] text-xs font-bold rounded hover:bg-[#ffcc00] transition"
                        >
                          View Items
                        </button>

                        {/* Status Update Dropdown */}
                        <select
                          defaultValue={order.status || 'pending'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-[#ffd700]"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Render */}
      {selectedOrder && (
        <OrderDetailsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          items={JSON.parse(selectedOrder.notes || '[]')}
          customerName={selectedOrder.customer_name}
          total={selectedOrder.total_amount}
        />
      )}
    </>
  );
}