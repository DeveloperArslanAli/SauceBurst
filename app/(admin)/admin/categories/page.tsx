import { createClient } from '@/app/lib/supabaseServer';
import Link from 'next/link';
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    return <div className="text-red-500">Failed to load categories.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#ffd700]">Manage Categories</h1>
        <Link href="/admin/categories/new" className="px-4 py-2 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-lg transition">
          + Add Category
        </Link>
      </div>

      <div className="bg-[#2a2a2a] rounded-lg border border-[#ffd700]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-xs font-semibold border-b border-[#ffd700]/10">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffd700]/10">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#333] transition">
                    <td className="px-6 py-4 text-white font-medium">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-300 max-w-[200px] truncate">{cat.description || '-'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link href={`/admin/categories/${cat.id}`} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition">Edit</Link>
                      <DeleteCategoryButton id={cat.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No categories found. Click &quot;Add Category&quot; to create one.
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