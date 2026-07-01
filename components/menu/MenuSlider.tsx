'use client';

import { useRef, useState, useEffect } from 'react';
import ItemCard from './ItemCard';

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
};

export default function MenuSlider({ items }: { items: Item[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftBtn(scrollLeft > 5);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScroll);
      checkScroll();
      
      const observer = new ResizeObserver(() => {
        checkScroll();
      });
      observer.observe(slider);
      
      return () => {
        slider.removeEventListener('scroll', checkScroll);
        observer.disconnect();
      };
    }
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.85 : clientWidth * 0.85;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) {
    return <div className="w-full text-center text-gray-500 py-12">No items available right now.</div>;
  }

  return (
    <div className="relative group w-full px-2">
      {/* Navigation Buttons */}
      {showLeftBtn && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-[#1a1a1a]/90 hover:bg-[#ff6600] text-[#ffd700] hover:text-white rounded-full border border-[#ffd700]/30 shadow-lg hover:shadow-[#ff6600]/40 transition duration-300 -translate-x-2 md:-translate-x-6"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {showRightBtn && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-[#1a1a1a]/90 hover:bg-[#ff6600] text-[#ffd700] hover:text-white rounded-full border border-[#ffd700]/30 shadow-lg hover:shadow-[#ff6600]/40 transition duration-300 translate-x-2 md:translate-x-6"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Slider Scroll Track */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-6 pb-6 pt-2 scroll-smooth scrollbar-hide snap-x snap-mandatory"
        onScroll={checkScroll}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] flex-shrink-0 snap-start"
          >
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
