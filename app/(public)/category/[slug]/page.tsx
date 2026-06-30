import { createClient } from '@/app/lib/supabaseServer';
import { notFound } from 'next/navigation';
import CategoryNav from '@/components/menu/CategoryNav';
import ItemCard from '@/components/menu/ItemCard';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} - Sauce Burst`,
    description: `Browse our delicious ${slug} menu items.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const currentCategory = categories?.find((c) => c.slug === slug);
  if (!currentCategory) return notFound();

  const { data: items } = await supabase
    .from('items')
    .select('id, name, slug, description, price, image_url')
    .eq('category_id', currentCategory.id)
    .eq('is_available', true)
    .order('name');

  return (
    <>
      <CategoryNav categories={categories || []} activeSlug={slug} />
      <h2 className="text-2xl font-bold text-[#ffd700] mb-6 border-b border-[#ffd700]/20 pb-2">
        {currentCategory.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items?.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
        {!items?.length && (
          <p className="col-span-full text-center text-gray-500 py-12">No items in this category yet.</p>
        )}
      </div>
    </>
  );
}