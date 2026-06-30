import { createClient } from '@/app/lib/supabaseServer';
import Link from 'next/link';
import DeleteItemButton from '@/components/admin/DeleteItemButton';

export default async function AdminItemsPage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from('items')
    .select('*, categories(name)')
    .order('name');

  if (error) {
    return <div className="text-red-500">Failed to load items.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#ffd700]">Manage Items</h1>
        <Link
          href="/admin/items/new"
          className="px-4 py-2 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-lg transition"
        >
          + Add Item
        </Link>
      </div>

      <div className="bg-[#2a2a2a] rounded-lg border border-[#ffd700]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-xs font-semibold border-b border-[#ffd700]/10">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffd700]/10">
              {items && items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#333] transition">
                    <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-gray-300">{item.categories?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4 text-[#ffd700]">Rs. {item.price}</td>
                    <td className="px-6 py-4">
                      <span className={item.is_available ? 'text-green-400' : 'text-red-400'}>
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/admin/items/${item.id}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition"
                      >
                        Edit
                      </Link>
                      <DeleteItemButton id={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No items found. Click "Add Item" to create one.
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