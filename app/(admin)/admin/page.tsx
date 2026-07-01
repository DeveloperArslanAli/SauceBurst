import supabaseAdmin from '@/app/lib/supabaseAdmin';
import Link from 'next/link';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import RevenueDatePicker from '@/components/admin/RevenueDatePicker';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const { startDate: startParam, endDate: endParam } = await searchParams;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); 
  const lastDay = new Date(year, month + 1, 0).getDate(); 
  
  const defaultStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const defaultEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const startDate = startParam || defaultStart;
  const endDate = endParam || defaultEnd;

  console.log(`🕵️ DEBUG: Querying Revenue from ${startDate} to ${endDate}`);

  const { count: totalOrders } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // ✅ FIX: Use explicit +05:00 timezone offsets to match Pakistan Standard Time
  const { data: revenueData, error: revenueError } = await supabaseAdmin
    .from('orders')
    .select('total_amount')
    .ilike('status', 'completed')
    .gte('created_at', startDate + 'T00:00:00+05:00')
    .lte('created_at', endDate + 'T23:59:59+05:00');

  if (revenueError) {
    console.error('❌ Supabase Error:', revenueError);
  }

  console.log(`📦 DEBUG: Raw Revenue Data from DB:`, JSON.stringify(revenueData, null, 2));

  const totalRevenue = revenueData?.reduce((acc, order) => {
    return acc + (Number(order.total_amount) || 0);
  }, 0) || 0;

  const { count: activeItems } = await supabaseAdmin
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('is_available', true);

  const { data: recentOrders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#ffd700] mb-6">Dashboard</h1>
      
      <div className="mb-6">
        <RevenueDatePicker 
          key={`${startDate}-${endDate}`}
          defaultStart={defaultStart} 
          defaultEnd={defaultEnd} 
          activeStart={startDate}
          activeEnd={endDate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
          <h2 className="text-gray-400 text-sm uppercase font-semibold tracking-wider">Total Orders</h2>
          <p className="text-4xl font-bold text-white mt-2">{totalOrders ?? 0}</p>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
          <h2 className="text-gray-400 text-sm uppercase font-semibold tracking-wider">
            Revenue ({startDate} to {endDate})
          </h2>
          <p className="text-4xl font-bold text-white mt-2">Rs. {totalRevenue}</p>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
          <h2 className="text-gray-400 text-sm uppercase font-semibold tracking-wider">Active Items</h2>
          <p className="text-4xl font-bold text-white mt-2">{activeItems ?? 0}</p>
        </div>
      </div>

      <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#ffd700]/20 shadow-md">
        <div className="flex justify-between items-center mb-4 border-b border-[#ffd700]/10 pb-2">
          <h2 className="text-xl font-bold text-[#ffd700]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-[#ffd700] underline transition">View All</Link>
        </div>
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