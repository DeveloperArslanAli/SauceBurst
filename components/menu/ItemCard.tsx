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
    // Fixed width + fixed height card — all cards are guaranteed the same size
    <div className="flex flex-col w-[300px] h-[380px] bg-[#2a2a2a] rounded-xl border border-[#ffd700]/20 hover:border-[#ffd700]/50 hover:shadow-lg hover:shadow-[#ffd700]/5 transition-all duration-300 flex-shrink-0 overflow-hidden">
      
      {/* Fixed-height image area */}
      <Link href={`/item/${item.id}`} className="block relative w-full h-[185px] bg-[#1a1a1a] group overflow-hidden flex-shrink-0">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="300px"
          onError={() => setImgSrc('https://placehold.co/300x185/1a1a1a/ffd700?text=No+Image')}
        />
      </Link>

      {/* Card body — flex-col with space-between to pin price+button to bottom */}
      <div className="flex flex-col flex-1 p-4 justify-between">
        <div>
          <Link href={`/item/${item.id}`} className="block">
            <h3 className="text-lg font-bold text-[#ffd700] hover:text-[#ffcc00] transition leading-tight line-clamp-1">
              {item.name}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#ffd700]/10">
          <span className="text-xl font-bold text-white">Rs. {item.price}</span>
          <button
            onClick={() => addItem(item)}
            className="px-4 py-2 bg-[#ff6600] hover:bg-[#ff5500] text-white text-sm font-bold rounded-lg shadow-md transition hover:-translate-y-0.5 active:translate-y-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}