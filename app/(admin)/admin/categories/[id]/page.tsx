import { createClient } from '@/app/lib/supabaseServer';
import CategoryForm from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cat, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !cat) return notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#ffd700] mb-6">Edit Category</h1>
      <CategoryForm 
        initialData={{ id: cat.id, name: cat.name, description: cat.description }}
        isEdit
      />
    </div>
  );
}