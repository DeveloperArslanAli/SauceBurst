import { createClient } from '@/app/lib/supabaseServer';
import OrdersTable from '@/components/admin/OrdersTable';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filter if status is provided
  if (status && ['pending', 'preparing', 'completed', 'canceled'].includes(status)) {
    query = query.eq('status', status);
  }

  const { data: orders, error } = await query;

  if (error) {
    return <div className="text-red-500">Failed to load orders: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#ffd700]">Manage Orders</h1>
        <div className="flex gap-2">
          <a href="/admin/orders" className={`px-4 py-2 rounded text-sm transition ${!status ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            All
          </a>
          <a href="/admin/orders?status=pending" className={`px-4 py-2 rounded text-sm transition ${status === 'pending' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Pending
          </a>
          <a href="/admin/orders?status=preparing" className={`px-4 py-2 rounded text-sm transition ${status === 'preparing' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Preparing
          </a>
          <a href="/admin/orders?status=completed" className={`px-4 py-2 rounded text-sm transition ${status === 'completed' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Completed
          </a>
          <a href="/admin/orders?status=canceled" className={`px-4 py-2 rounded text-sm transition ${status === 'canceled' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Canceled
          </a>
        </div>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  );
}