'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative text-white hover:text-[#ffd700] transition">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5h15M7 13h10" />
      </svg>
      {/* suppressHydrationWarning prevents SSR/client mismatch on cart count badge */}
      <span
        suppressHydrationWarning
        className={`absolute -top-1 -right-1 bg-[#ff0000] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transition-opacity duration-200 ${totalItems > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {totalItems > 0 ? totalItems : ''}
      </span>
    </Link>
  );
}
