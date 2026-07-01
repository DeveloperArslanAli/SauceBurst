import { createClient } from '@/app/lib/supabaseServer';
import CategoryNav from '@/components/menu/CategoryNav';
import MenuSlider from '@/components/menu/MenuSlider';
import Image from 'next/image';
import Link from 'next/link';

// ✅ ISR: Revalidate page every 60 seconds
export const revalidate = 60;

// ✅ SEO & Open Graph for Homepage
export async function generateMetadata() {
  return {
    title: 'Home - Sauce Burst',
    description: 'Browse our delicious flame-grilled burgers, authentic wood-fired pizzas, and refreshing drinks!',
  };
}

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

  // ✅ JSON-LD Structured Data (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Sauce Burst",
    "description": "Delicious flame-grilled burgers, authentic wood-fired pizzas, and refreshing drinks waiting just for you.",
    "servesCuisine": ["Burger", "Pizza", "Fast Food"],
    "url": "https://your-domain.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Canal Road, Abbasia Town Main Road",
      "addressLocality": "Rahim Yar Khan",
      "postalCode": "64200",
      "addressCountry": "PK"
    },
    "telephone": "0304-7234727"
  };

  return (
    <div className="space-y-28 pb-16">
      {/* ✅ Inject JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10 md:py-16">
        <div className="space-y-8 z-10 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6600]/10 border border-[#ff6600]/30 rounded-full text-sm font-bold text-[#ff6600]">
            <span className="w-2 h-2 rounded-full bg-[#ff6600] animate-pulse"></span>
            Fresh & Spicy Flavor Burst
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            <span className="text-white block">Taste the Ultimate</span>
            <span className="bg-gradient-to-r from-[#ffd700] via-[#ff6600] to-[#ff0000] bg-clip-text text-transparent">
              Sauce Burst
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
            Unleash your cravings with our signature flame‑grilled burgers, authentic wood‑fired pizzas, and ice‑cold drinks crafted to perfection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link 
              href="#menu" 
              className="px-8 py-4 bg-gradient-to-r from-[#ff6600] to-[#ff4400] hover:from-[#ff5500] hover:to-[#ff2200] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-[#ff6600]/40 transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              Order Now
            </Link>
            <Link 
              href="#store" 
              className="px-8 py-4 bg-[#2a2a2a] hover:bg-[#333] text-[#ffd700] border border-[#ffd700]/30 hover:border-[#ffd700] font-bold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              Visit Store
            </Link>
          </div>
        </div>

        {/* Custom Premium Food SVG */}
        <div className="relative h-[320px] md:h-[450px] w-full flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_35px_rgba(255,102,0,0.25)] select-none animate-float">
            <defs>
              <linearGradient id="bunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffb833" />
                <stop offset="100%" stopColor="#d35400" />
              </linearGradient>
              <linearGradient id="pattyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4a2711" />
                <stop offset="100%" stopColor="#2c1508" />
              </linearGradient>
              <linearGradient id="cheeseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffe600" />
                <stop offset="100%" stopColor="#f39c12" />
              </linearGradient>
              <linearGradient id="sauceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2a00" />
                <stop offset="100%" stopColor="#ff7700" />
              </linearGradient>
              <linearGradient id="pizzaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffdd59" />
                <stop offset="100%" stopColor="#ff5e57" />
              </linearGradient>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6600" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background glowing rings */}
            <circle cx="200" cy="200" r="160" fill="none" stroke="url(#glowGrad)" strokeWidth="2" strokeDasharray="8 8" className="animate-spin-slow origin-center" />
            <circle cx="200" cy="200" r="135" fill="none" stroke="url(#glowGrad)" strokeWidth="1.5" opacity="0.4" />
            
            {/* Sauce Burst background splashes */}
            <path d="M 120 180 C 70 140, 60 220, 110 240 C 130 250, 110 280, 160 270 C 180 260, 200 290, 220 250 C 260 270, 290 220, 250 190 C 280 140, 220 120, 190 160 C 170 140, 130 140, 120 180 Z" fill="url(#sauceGrad)" opacity="0.12" filter="url(#glow)" />
            
            {/* Floating particles / sauce drops */}
            <circle cx="95" cy="115" r="7" fill="#ff6600" opacity="0.8" />
            <circle cx="310" cy="180" r="5" fill="#ffd700" opacity="0.7" />
            <circle cx="280" cy="95" r="4.5" fill="#ff2a00" opacity="0.8" />
            <circle cx="120" cy="290" r="6" fill="#ff6600" opacity="0.6" />
            <circle cx="250" cy="305" r="8" fill="#ffd700" opacity="0.9" />
            
            <g transform="translate(10, 0)">
              {/* Gourmet Burger (Left element) */}
              <g transform="translate(90, 110) scale(0.9)">
                <ellipse cx="100" cy="200" rx="90" ry="14" fill="#000" opacity="0.45" />
                
                {/* Bottom Bun */}
                <path d="M 20 170 C 20 195, 180 195, 180 170 C 180 160, 20 160, 20 170 Z" fill="url(#bunGrad)" />
                
                {/* Patty */}
                <rect x="15" y="135" width="170" height="30" rx="15" fill="url(#pattyGrad)" stroke="#1e0f06" strokeWidth="1.5" />
                {/* Grill Marks */}
                <line x1="45" y1="135" x2="65" y2="165" stroke="#110804" strokeWidth="4" strokeLinecap="round" />
                <line x1="85" y1="135" x2="105" y2="165" stroke="#110804" strokeWidth="4" strokeLinecap="round" />
                <line x1="125" y1="135" x2="145" y2="165" stroke="#110804" strokeWidth="4" strokeLinecap="round" />
                
                {/* Melted Cheese */}
                <path d="M 12 138 L 188 138 C 188 138, 180 160, 160 155 C 150 152, 140 165, 130 150 C 120 138, 105 160, 90 148 C 80 140, 70 158, 60 148 C 50 138, 30 155, 20 145 C 15 140, 12 138, 12 138 Z" fill="url(#cheeseGrad)" />
                
                {/* Tomatoes */}
                <rect x="25" y="118" width="70" height="18" rx="8" fill="#d32f2f" />
                <rect x="105" y="118" width="70" height="18" rx="8" fill="#d32f2f" />
                <circle cx="50" cy="127" r="4.5" fill="#ff7675" />
                <circle cx="130" cy="127" r="4.5" fill="#ff7675" />

                {/* Lettuce */}
                <path d="M 10 118 Q 20 98, 35 118 Q 50 98, 65 118 Q 80 98, 95 118 Q 110 98, 125 118 Q 140 98, 155 118 Q 170 98, 180 118 L 190 120 L 10 120 Z" fill="#2ecc71" />
                
                {/* Top Bun */}
                <path d="M 15 105 C 15 38, 185 38, 185 105 Z" fill="url(#bunGrad)" />
                
                {/* Sesame Seeds */}
                <ellipse cx="60" cy="70" rx="3" ry="1.5" fill="#f1c40f" transform="rotate(-15, 60, 70)" />
                <ellipse cx="100" cy="58" rx="3" ry="1.5" fill="#f1c40f" />
                <ellipse cx="140" cy="73" rx="3" ry="1.5" fill="#f1c40f" transform="rotate(20, 140, 73)" />
                <ellipse cx="80" cy="85" rx="3" ry="1.5" fill="#f1c40f" transform="rotate(10, 80, 85)" />
                <ellipse cx="120" cy="78" rx="3" ry="1.5" fill="#f1c40f" transform="rotate(-5, 120, 78)" />
              </g>
              
              {/* Pizza Slice (Overlapping right) */}
              <g transform="translate(195, 125) rotate(16) scale(0.85)">
                <path d="M 150 50 C 170 50, 220 220, 220 220 L 70 180 Z" fill="#e67e22" stroke="#d35400" strokeWidth="2.5" />
                <path d="M 145 65 C 160 65, 203 205, 203 205 L 82 172 Z" fill="url(#cheeseGrad)" />
                
                {/* Pepperonis */}
                <circle cx="140" cy="120" r="14" fill="#c0392b" stroke="#962d22" strokeWidth="1.5" />
                <circle cx="142" cy="122" r="3.5" fill="#e74c3c" opacity="0.6" />
                <circle cx="170" cy="160" r="14" fill="#c0392b" stroke="#962d22" strokeWidth="1.5" />
                <circle cx="172" cy="162" r="3.5" fill="#e74c3c" opacity="0.6" />
                <circle cx="115" cy="150" r="12" fill="#c0392b" stroke="#962d22" strokeWidth="1.5" />
                
                {/* Basil leaves */}
                <path d="M 150 90 C 140 80, 130 95, 150 90 Z" fill="#27ae60" />
                <path d="M 120 120 C 110 115, 115 130, 120 120 Z" fill="#27ae60" />
                
                {/* Cheese Drips */}
                <path d="M 82 172 C 82 172, 80 188, 75 190 C 72 191, 76 174, 82 172 Z" fill="#f1c40f" />
                <path d="M 130 180 C 130 180, 128 202, 122 205 C 118 207, 124 183, 130 180 Z" fill="#f1c40f" />
              </g>
              
              {/* Central Sauce Splash */}
              <g transform="translate(195, 205)">
                <path d="M -10 -5 C -30 -30, -50 -10, -70 -40 C -80 -10, -60 20, -50 40 C -30 20, -20 30, 0 10 C 20 30, 40 10, 60 30 C 50 0, 30 -20, 20 -40 C 0 -20, 10 -5, -10 -5 Z" fill="url(#sauceGrad)" filter="url(#glow)" />
                <circle cx="-60" cy="-22" r="4.5" fill="#ff5500" />
                <circle cx="50" cy="18" r="3.5" fill="#ffaa00" />
              </g>
            </g>
          </svg>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-[#ffd700] tracking-tight">Featured Offers</h2>
          <p className="text-gray-400 max-w-md mx-auto">Sensational deals, prepared fresh and packed with flavor.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              name: 'Zinger Burger', 
              badge: 'Bestseller',
              desc: 'Crispy breast fillet, fresh lettuce, and signature spicy mayo in a toasted bun.',
              img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=450&q=80' 
            },
            { 
              name: 'Chicken Shawarma', 
              badge: 'Popular',
              desc: 'Flame-grilled shredded chicken, creamy garlic sauce, wrapped in soft pita.',
              img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&h=450&q=80' 
            },
            { 
              name: 'Classic Coke', 
              badge: 'Refreshing',
              desc: 'Chilled carbonated soft drink, the perfect side‑kick to burst your thirst.',
              img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&h=450&q=80' 
            },
          ].map((offer, idx) => (
            <div 
              key={idx} 
              className="group bg-[#2a2a2a]/40 hover:bg-[#2a2a2a]/90 border border-[#ffd700]/10 hover:border-[#ffd700]/40 rounded-2xl p-5 shadow-lg hover:shadow-[#ffd700]/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-[#1a1a1a] mb-5">
                  <Image 
                    src={offer.img} 
                    alt={offer.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="eager"
                  />
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-[#ff6600] to-[#ff0000] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {offer.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-[#ffd700] transition-colors duration-300">
                  {offer.name}
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Menu Section */}
      <section id="menu" className="space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ffd700]/10 pb-4">
          <div>
            <h2 className="text-4xl font-black text-[#ffd700] tracking-tight">Explore Our Menu</h2>
            <p className="text-gray-400 text-sm mt-1">Select a category and slide through our specialties.</p>
          </div>
          <Link href="/" className="text-sm text-[#ff6600] font-extrabold hover:text-[#ff5500] hover:underline transition self-start sm:self-auto">
            View All →
          </Link>
        </div>
        
        <CategoryNav categories={categories || []} />
        
        <MenuSlider items={items || []} />
      </section>

      {/* The Sauce Burst Promise */}
      <section className="bg-[#2a2a2a]/30 rounded-3xl border border-[#ffd700]/10 p-8 md:p-14 space-y-10">
        <h2 className="text-3xl md:text-4xl font-black text-center text-[#ffd700] tracking-tight">The Sauce Burst Promise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center space-y-4 group">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto border border-[#ffd700]/30 group-hover:border-[#ffd700] group-hover:bg-[#ff6600]/10 transition-all duration-300 shadow-inner">
              <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-white">Fresh Ingredients</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">Sourced daily from local organic farms to ensure the crispest flavors.</p>
          </div>
          <div className="text-center space-y-4 group">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto border border-[#ffd700]/30 group-hover:border-[#ffd700] group-hover:bg-[#ff6600]/10 transition-all duration-300 shadow-inner">
              <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-white">Fast Delivery</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">Delivered smoking hot directly to your doorstep in robust thermal packs.</p>
          </div>
          <div className="text-center space-y-4 group">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto border border-[#ffd700]/30 group-hover:border-[#ffd700] group-hover:bg-[#ff6600]/10 transition-all duration-300 shadow-inner">
              <svg className="w-8 h-8 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-white">Quality Taste</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">Handcrafted by culinary masters obsessed with taste buds perfection.</p>
          </div>
        </div>
      </section>

      {/* Store Location Details Section */}
      <section id="store" className="relative scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6600]/5 to-transparent rounded-3xl -z-10" />
        
        <div className="bg-[#2a2a2a]/40 rounded-3xl border border-[#ffd700]/20 p-8 md:p-14 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-[#ffd700] tracking-tight">Visit Our Blum Store</h2>
            <p className="text-gray-300 max-w-xl mx-auto text-base md:text-lg">
              Craving a sizzling, sauce-filled experience? Skip the wait and visit us at our premium store in Rahim Yar Khan.
            </p>
          </div>

          {/* Contact and Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Address */}
            <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#ffd700]/10 space-y-3 hover:border-[#ffd700]/30 transition duration-300">
              <div className="w-10 h-10 bg-[#ff6600]/10 rounded-lg flex items-center justify-center text-[#ff6600]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Address</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Canal Road, Abbasia Town Main Road, Rahim Yar Khan, 64200
              </p>
            </div>

            {/* Hours */}
            <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#ffd700]/10 space-y-3 hover:border-[#ffd700]/30 transition duration-300">
              <div className="w-10 h-10 bg-[#ffd700]/10 rounded-lg flex items-center justify-center text-[#ffd700]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Hours</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                3:00 PM – 2:00 AM <br />
                <span className="text-[#ff6600] font-semibold text-xs">Closes soon at 2:00 AM</span>
              </p>
            </div>

            {/* Service Options */}
            <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#ffd700]/10 space-y-3 hover:border-[#ffd700]/30 transition duration-300">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Service Options</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cash only <br />
                <span className="text-gray-500 text-xs">Dine‑in & Takeaway</span>
              </p>
            </div>

            {/* Phone */}
            <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-[#ffd700]/10 space-y-3 hover:border-[#ffd700]/30 transition duration-300">
              <div className="w-10 h-10 bg-[#ff6600]/10 rounded-lg flex items-center justify-center text-[#ff6600]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Phone</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                0304 7234727 <br />
                <span className="text-[#ffd700] text-xs font-semibold">Available for Support</span>
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link 
              href="/cart" 
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#ff0000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-black text-lg rounded-full shadow-lg hover:shadow-[#ff0000]/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              Order Online Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}