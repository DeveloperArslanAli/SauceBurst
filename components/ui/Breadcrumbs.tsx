'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  // Skip rendering on homepage
  if (pathname === '/') return null;

  // Generate crumbs. Example: /category/burgers -> [Home, Category, Burgers]
  const segments = pathname.split('/').filter(segment => segment !== '');
  // Clean up slugs to display names (e.g., 'burgers' -> 'Burgers')
  const formattedSegments = segments.map(seg => 
    seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
  );

  return (
    <nav className="flex text-sm text-gray-400 mb-6 py-2 border-b border-[#ffd700]/10">
      <Link href="/" className="hover:text-[#ffd700] transition">Home</Link>
      {formattedSegments.map((segment, index) => {
        // Build the href for this segment
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === formattedSegments.length - 1;
        return (
          <span key={href} className="flex items-center">
            <span className="mx-2">/</span>
            {isLast ? (
              <span className="text-white font-semibold">{segment}</span>
            ) : (
              <Link href={href} className="hover:text-[#ffd700] transition">{segment}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}