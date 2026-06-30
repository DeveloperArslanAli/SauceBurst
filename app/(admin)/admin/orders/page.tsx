import supabaseAdmin from '@/app/lib/supabaseAdmin';
import OrdersTable from '@/components/admin/OrdersTable';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; status?: string }>;
}) {
  const { source, status } = await searchParams;

  let query = supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  // 🔥 Filter by Source (Default to 'website' - online orders only, per user request)
  if (source && ['whatsapp', 'website'].includes(source)) {
    query = query.eq('source', source);
  } else {
    query = query.eq('source', 'website');
  }

  // Filter by Status
  if (status && ['pending', 'preparing', 'completed', 'canceled'].includes(status)) {
    query = query.eq('status', status);
  }

  const { data: orders, error } = await query;

  if (error) {
    return <div className="text-red-500">Failed to load orders: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#ffd700]">Manage Orders</h1>
        
        <div className="flex flex-wrap gap-2 items-center">
          {/* Source Filters */}
          <span className="text-xs text-gray-400 self-center">Source:</span>
          <a href="/admin/orders" className={`px-4 py-2 rounded text-sm transition ${(!source || source === 'website') ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Online
          </a>
          <a href="/admin/orders?source=whatsapp" className={`px-4 py-2 rounded text-sm transition ${source === 'whatsapp' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            WhatsApp
          </a>

          {/* Status Filters */}
          <span className="text-xs text-gray-400 self-center ml-4">Status:</span>
          <a href="/admin/orders" className={`px-4 py-2 rounded text-sm transition ${!status ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            All
          </a>
          <a href={`/admin/orders?status=pending${source ? `&source=${source}` : ''}`} className={`px-4 py-2 rounded text-sm transition ${status === 'pending' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Pending
          </a>
          <a href={`/admin/orders?status=preparing${source ? `&source=${source}` : ''}`} className={`px-4 py-2 rounded text-sm transition ${status === 'preparing' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Preparing
          </a>
          <a href={`/admin/orders?status=completed${source ? `&source=${source}` : ''}`} className={`px-4 py-2 rounded text-sm transition ${status === 'completed' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Completed
          </a>
          <a href={`/admin/orders?status=canceled${source ? `&source=${source}` : ''}`} className={`px-4 py-2 rounded text-sm transition ${status === 'canceled' ? 'bg-[#ffd700] text-[#1a1a1a] font-bold' : 'bg-[#333] text-gray-300 hover:bg-[#444]'}`}>
            Canceled
          </a>
        </div>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  );
}