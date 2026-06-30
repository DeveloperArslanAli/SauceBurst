'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ItemImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#2a2a2a] border border-[#ffd700]/20">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        onError={() => setImgSrc('https://placehold.co/600x600/1a1a1a/ffd700?text=No+Image')}
      />
    </div>
  );
}