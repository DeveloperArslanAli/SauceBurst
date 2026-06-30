import { createClient } from '@/app/lib/supabaseServer';
import Link from 'next/link';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch Total Orders Count
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch Total Revenue from 'completed' orders
  const { data: revenueData } = await supabase
    .from('orders')
    .select('sum(total_amount)')
    .eq('status', 'completed')
    .maybeSingle();
  const totalRevenue = revenueData?.sum || 0;

  // 3. Fetch Active Items Count
  const { count: activeItems } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('is_available', true);

  // 4. Fetch 5 Most Recent Orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#ffd700] mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
          <h2 className="text-gray-400 text-sm uppercase font-semibold tracking-wider">Total Orders</h2>
          <p className="text-4xl font-bold text-white mt-2">{totalOrders ?? 0}</p>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
          <h2 className="text-gray-400 text-sm uppercase font-semibold tracking-wider">Total Revenue</h2>
          <p className="text-4xl font-bold text-white mt-2">Rs. {totalRevenue}</p>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
          <h2 className="text-gray-400 text-sm uppercase font-semibold tracking-wider">Active Items</h2>
          <p className="text-4xl font-bold text-white mt-2">{activeItems ?? 0}</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
        <h2 className="text-xl font-bold text-[#ffd700] mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase text-gray-500 border-b border-[#ffd700]/10">
              <tr>
                <th className="pb-3 pr-6">Order ID</th>
                <th className="pb-3 pr-6">Customer</th>
                <th className="pb-3 pr-6">Total</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#ffd700]/5 hover:bg-[#333] transition">
                    <td className="py-3 pr-6 font-mono text-white text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="py-3 pr-6 text-white">{order.customer_name || 'Guest'}</td>
                    <td className="py-3 pr-6 text-[#ffd700]">Rs. {order.total_amount}</td>
                    <td className="py-3 pr-6">
                      <OrderStatusBadge status={order.status || 'pending'} />
                    </td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="pt-6 text-center text-gray-500">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}