'use client';

import Image from 'next/image';
import { useCart } from '@/components/cart/CartContext';
import { getPublicImageUrl } from '@/app/lib/utils';
import Link from 'next/link';
import OrderForm from '@/components/cart/OrderForm';

export default function CartPage() {
  const { cart, totalPrice, removeItem, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-[#ffd700] mb-4">Your Cart is Empty</h2>
        <p className="text-gray-400">Add some delicious items from the menu!</p>
        <Link href="/" className="mt-6 inline-block px-6 py-3 bg-[#ff6600] text-white font-bold rounded-lg hover:bg-[#ff5500] transition">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#ffd700] mb-8 border-b border-[#ffd700]/20 pb-4">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ffd700]/20 flex gap-4 items-center">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={getPublicImageUrl(item.image_url)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-[#ffd700]">Rs. {item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-[#1a1a1a] rounded hover:bg-[#333] text-white font-bold"
                >
                  -
                </button>
                <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-[#1a1a1a] rounded hover:bg-[#333] text-white font-bold"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">Rs. {item.price * item.quantity}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm hover:text-red-400 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-[#2a2a2a] border border-[#ffd700]/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#ffd700] mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-300 mb-2">
              <span>Subtotal</span>
              <span>Rs. {totalPrice}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-xl mt-4 border-t border-[#ffd700]/20 pt-4">
              <span>Total</span>
              <span>Rs. {totalPrice}</span>
            </div>
          </div>
          <OrderForm />
        </div>
      </div>
    </div>
  );
}