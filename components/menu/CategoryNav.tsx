'use client';

import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CategoryNav({ categories, activeSlug }: { categories: Category[]; activeSlug?: string }) {
  return (
    <div className="overflow-x-auto pb-2 mb-6 scrollbar-hide flex gap-3">
      <Link
        href="/"
        className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition ${
          !activeSlug
            ? 'bg-[#ffd700] text-[#1a1a1a]'
            : 'bg-[#2a2a2a] text-[#ffd700] hover:bg-[#333] border border-[#ffd700]/20'
        }`}
      >
        All Items
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition ${
            activeSlug === cat.slug
              ? 'bg-[#ffd700] text-[#1a1a1a]'
              : 'bg-[#2a2a2a] text-[#ffd700] hover:bg-[#333] border border-[#ffd700]/20'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}