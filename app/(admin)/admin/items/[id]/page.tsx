import { createClient } from '@/app/lib/supabaseServer';
import ItemForm from '@/components/admin/ItemForm';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditItemPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (catError || itemError || !item) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#ffd700] mb-6">Edit Item</h1>
      <ItemForm
        categories={categories || []}
        initialData={{
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category_id: item.category_id,
          is_available: item.is_available,
          image_url: item.image_url,
        }}
        isEdit
      />
    </div>
  );
}