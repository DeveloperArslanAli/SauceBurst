'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartContext';

type ItemDetailClientProps = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

export default function ItemDetailClient({ id, name, price, image_url }: ItemDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // Add the item to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem({ id, name, price, image_url });
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-gray-300 font-medium">Quantity:</span>
        <div className="flex items-center bg-[#1a1a1a] rounded-lg border border-[#ffd700]/20">
          <button 
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 text-white hover:bg-[#333] transition font-bold"
          >
            -
          </button>
          <span className="w-12 text-center text-white font-bold">{quantity}</span>
          <button 
            onClick={() => setQuantity(prev => prev + 1)}
            className="w-10 h-10 text-white hover:bg-[#333] transition font-bold"
          >
            +
          </button>
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="w-full sm:w-auto px-8 py-4 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold text-lg rounded-lg shadow-lg transition hover:-translate-y-0.5"
      >
        Add to Cart (Rs. {price * quantity})
      </button>
    </div>
  );
}