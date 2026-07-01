'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartContext';
import { getPublicImageUrl } from '@/app/lib/utils';
import { useState } from 'react';

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
};

export default function ItemCard({ item }: { item: Item }) {
  const { addItem } = useCart();
  const [imgSrc, setImgSrc] = useState(getPublicImageUrl(item.image_url));

  return (
    <div className="bg-[#2a2a2a] rounded-xl border border-[#ffd700]/20 p-4 hover:border-[#ffd700]/50 transition-all">
      <Link href={`/item/${item.id}`} className="block relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-[#1a1a1a] group">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={true} // ✅ Prevents Next.js image optimizer timeout
          onError={() => setImgSrc('https://placehold.co/400x300/1a1a1a/ffd700?text=No+Image')}
        />
      </Link>
      <Link href={`/item/${item.id}`} className="block">
        <h3 className="text-xl font-bold text-[#ffd700] hover:text-[#ffcc00] transition">{item.name}</h3>
      </Link>
      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-2xl font-bold text-white">Rs. {item.price}</span>
        <button
          onClick={() => addItem(item)}
          className="px-4 py-2 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-lg shadow-md transition hover:-translate-y-0.5"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}