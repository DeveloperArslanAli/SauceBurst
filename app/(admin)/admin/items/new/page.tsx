import { createClient } from '@/app/lib/supabaseServer';
import ItemForm from '@/components/admin/ItemForm';
import { notFound } from 'next/navigation';

export default async function NewItemPage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  if (error) {
    return <div className="text-red-500">Failed to load categories.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#ffd700] mb-6">Add New Item</h1>
      <ItemForm categories={categories || []} />
    </div>
  );
}