import { createClient } from '@/app/lib/supabaseServer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicImageUrl } from '@/app/lib/utils';
import ItemDetailClient from '@/components/menu/ItemDetailClient';
import ItemImage from '@/components/ui/ItemImage';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from('items')
    .select('name, description')
    .eq('id', id)
    .single();

  if (!item) return { title: 'Item Not Found' };
  return {
    title: `${item.name} - Sauce Burst`,
    description: item.description || 'Delicious food from Sauce Burst',
  };
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from('items')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single();

  if (error || !item) return notFound();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Use the client ItemImage component */}
      <ItemImage
        src={getPublicImageUrl(item.image_url)}
        alt={item.name}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div>
        <Link 
          href={`/category/${item.categories.slug}`} 
          className="inline-block text-sm text-[#ffd700] hover:underline mb-2"
        >
          ← Back to {item.categories.name}
        </Link>
        <h1 className="text-4xl font-black text-[#ffd700] mb-2">{item.name}</h1>
        <p className="text-3xl font-bold text-white mb-4">Rs. {item.price}</p>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          {item.description || 'No description available.'}
        </p>
        <ItemDetailClient 
          id={item.id}
          name={item.name}
          price={item.price}
          image_url={item.image_url}
        />
      </div>
    </div>
  );
}