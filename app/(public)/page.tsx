import { createClient } from '@/app/lib/supabaseServer';
import CategoryNav from '@/components/menu/CategoryNav';
import ItemCard from '@/components/menu/ItemCard';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  const { data: items } = await supabase
    .from('items')
    .select('id, name, slug, description, price, image_url')
    .eq('is_available', true)
    .order('name');

  return (
    <div className="space-y-20 pb-12">
      
      {/* HERO SECTION with SVG Character */}
      <section className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-8">
        <div className="space-y-6 z-10">
          <h1 className="text-5xl md:text-6xl font-black leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
            <span className="text-[#ffd700]">Taste the</span><br />
            <span className="text-white">Sauce Burst</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed">
            Delicious flame‑grilled burgers, authentic wood‑fired pizzas, and refreshing drinks waiting just for you.
          </p>
          <Link href="#menu" className="inline-block px-8 py-4 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-full shadow-lg transition transform hover:-translate-y-1 hover:shadow-[#ff6600]/50">
            Order Now
          </Link>
        </div>
        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
          {/* Professional SVG Chef/Burger Illustration */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,215,0,0.2)]">
            <circle cx="100" cy="100" r="90" fill="#ffd700" />
            <circle cx="100" cy="100" r="80" fill="#1a1a1a" />
            <path d="M70 110 L130 110 L140 140 L60 140 Z" fill="#ff6600" />
            <circle cx="100" cy="110" r="40" fill="#ffcc00" />
            <rect x="50" y="150" width="100" height="10" rx="2" fill="#fff" />
            <text x="100" y="175" fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">Sauce Burst</text>
          </svg>
        </div>
      </section>

      {/* FEATURED OFFERS - 1x3 Grid */}
      <section>
        <h2 className="text-3xl font-black text-center text-[#ffd700] mb-8">Featured Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: 'Zinger Burger', price: 'Rs. 599', img: 'https://placehold.co/400x400/2a2a2a/ffd700?text=Zinger' },
            { name: 'Chicken Shawarma', price: 'Rs. 450', img: 'https://placehold.co/400x400/2a2a2a/ffd700?text=Shawarma' },
            { name: 'Classic Coke', price: 'Rs. 199', img: 'https://placehold.co/400x400/2a2a2a/ffd700?text=Coke' },
          ].map((offer, idx) => (
            <div key={idx} className="bg-[#2a2a2a] border border-[#ffd700]/20 rounded-2xl p-4 hover:scale-105 transition-all duration-300">
              <div className="relative h-48 w-full rounded-xl overflow-hidden bg-[#1a1a1a] mb-4">
                <Image src={offer.img} alt={offer.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="text-xl font-bold text-white">{offer.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold text-[#ffd700]">{offer.price}</span>
                <button className="px-4 py-2 bg-[#ff6600] text-white font-bold rounded-lg shadow hover:bg-[#ff5500] transition">Order</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPLORE OUR MENU - Horizontal Slider */}
      <section id="menu">
        <div className="flex items-center justify-between mb-6 border-b border-[#ffd700]/10 pb-4">
          <h2 className="text-3xl font-black text-[#ffd700]">Explore Our Menu</h2>
          <Link href="/" className="text-sm text-[#ff6600] font-bold hover:underline">View All →</Link>
        </div>
        
        <CategoryNav categories={categories || []} />
        
        {/* Horizontal Scroll Grid */}
        <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory">
          {items?.map((item) => (
            <div key={item.id} className="min-w-[280px] snap-center first:ml-0 last:mr-0">
              <ItemCard item={item} />
            </div>
          ))}
          {!items?.length && (
            <div className="w-full text-center text-gray-500 py-12">No items available right now.</div>
          )}
        </div>
      </section>

      {/* THE PROMISE SECTION */}
      <section className="bg-[#2a2a2a] rounded-2xl border border-[#ffd700]/20 p-8 md:p-12">
        <h2 className="text-3xl font-black text-center text-[#ffd700] mb-8">The Sauce Burst Promise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto border-2 border-[#ffd700]">
              <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Fresh Ingredients</h3>
            <p className="text-gray-400 text-sm">Sourced daily for that farm‑to‑table taste.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto border-2 border-[#ffd700]">
              <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Fast Delivery</h3>
            <p className="text-gray-400 text-sm">Hot and fresh, right to your doorstep.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto border-2 border-[#ffd700]">
              <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white">Quality Taste</h3>
            <p className="text-gray-400 text-sm">Crafted by experts with love and passion.</p>
          </div>
        </div>
      </section>

      {/* VISIT BLUM SECTION (CTA) - with safe background pattern */}
      <section className="relative bg-[#2a2a2a] rounded-2xl border-2 border-[#ffd700] p-8 md:p-12 text-center overflow-hidden">
        {/* Simple safe SVG dot grid pattern - no parsing issues */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd700' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }}></div>
        <h2 className="text-4xl font-black text-[#ffd700] relative z-10">Visit Our Blum Store</h2>
        <p className="text-gray-300 max-w-lg mx-auto mt-4 text-lg relative z-10">
          Craving a fresh bite? Come visit us at our main location in Blum for a dine‑in experience like no other.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <span className="bg-[#1a1a1a] px-6 py-3 border border-[#ffd700]/30 rounded-full text-white">📍 123 Blum Street, Food City</span>
          <Link href="/cart" className="px-8 py-3 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-full shadow-lg transition transform hover:-translate-y-1">
            Order Online Now
          </Link>
        </div>
      </section>

    </div>
  );
}