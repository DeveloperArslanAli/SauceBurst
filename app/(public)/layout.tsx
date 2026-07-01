import Link from 'next/link';
import { CartProvider } from '@/components/cart/CartContext';
import CartIcon from '@/components/cart/CartIcon';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { createClient } from '@/app/lib/supabaseServer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  // Fetch dynamic categories for the dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col font-sans selection:bg-[#ff6600] selection:text-white">
        
        {/* Sticky Glassmorphic Header */}
        <header className="bg-[#222222]/85 backdrop-blur-md border-b border-[#ffd700]/10 py-4 px-6 sticky top-0 z-50 shadow-xl transition-all duration-300">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link 
              href="/" 
              className="text-3xl font-black tracking-tight drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)] hover:scale-102 transition duration-200"
            >
              <span className="text-[#ff0000] hover:text-[#ff3333]">Sauce</span>
              <span className="text-[#ffd700] hover:text-[#ffea00]">Burst</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className="text-[#ffd700] font-bold hover:text-white transition duration-200 relative group py-1"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffd700] transform scale-x-100 transition-transform duration-200" />
              </Link>
              <Link 
                href="/#menu" 
                className="text-gray-300 font-bold hover:text-[#ffd700] transition duration-200 relative group py-1"
              >
                Menu
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffd700] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
              
              <div className="relative group">
                <button className="text-gray-300 font-bold hover:text-[#ffd700] transition duration-200 flex items-center gap-1.5 cursor-pointer py-1">
                  Categories
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-52 bg-[#222] border border-[#ffd700]/15 rounded-2xl shadow-2xl z-50 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 transform origin-top group-hover:translate-y-0 translate-y-2">
                  <div className="p-2 space-y-1">
                    {categories?.map((cat) => (
                      <Link 
                        key={cat.id} 
                        href={`/category/${cat.slug}`} 
                        prefetch={true} 
                        className="block px-4 py-2.5 text-gray-300 hover:bg-[#ff6600]/10 hover:text-[#ffd700] rounded-xl transition duration-200"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <Link 
                      href="/" 
                      prefetch={true} 
                      className="block px-4 py-2.5 text-gray-300 hover:bg-[#ff6600]/10 hover:text-[#ffd700] rounded-xl transition border-t border-[#ffd700]/10 mt-1"
                    >
                      View All Items
                    </Link>
                  </div>
                </div>
              </div>

              <Link 
                href="/#store" 
                className="text-gray-300 font-bold hover:text-[#ffd700] transition duration-200 relative group py-1"
              >
                Store Info
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffd700] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </nav>

            <div className="flex items-center gap-6">
              <Link 
                href="/auth/sign-in" 
                className="text-sm font-bold text-gray-300 hover:text-[#ffd700] transition duration-200 hidden sm:block bg-[#2a2a2a] px-4 py-2 rounded-full border border-transparent hover:border-[#ffd700]/30"
              >
                Admin Login
              </Link>
              <CartIcon />
            </div>
          </div>
        </header>

        {/* Breadcrumbs and Main Content Wrapper */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
          <Breadcrumbs />
          {children}
        </main>

        {/* Premium Professional Footer */}
        <footer className="bg-[#151515] border-t border-[#ffd700]/10 pt-16 pb-8 px-6 text-gray-400">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Brand details */}
            <div className="space-y-4">
              <Link href="/" className="text-3xl font-black tracking-tight block">
                <span className="text-[#ff0000]">Sauce</span>
                <span className="text-[#ffd700]">Burst</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fueling your cravings with Rahim Yar Khan&apos;s finest flame‑grilled burgers, authentic wood‑fired pizzas, and cold refreshing beverages. Quality taste is our core promise.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="#" className="w-9 h-9 bg-[#222] border border-[#ffd700]/10 hover:border-[#ffd700] hover:text-[#ffd700] rounded-xl flex items-center justify-center transition duration-300" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1h-3c-3 0-5 2-5 5v2z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-[#222] border border-[#ffd700]/10 hover:border-[#ffd700] hover:text-[#ffd700] rounded-xl flex items-center justify-center transition duration-300" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-[#222] border border-[#ffd700]/10 hover:border-[#ffd700] hover:text-[#ffd700] rounded-xl flex items-center justify-center transition duration-300" aria-label="Twitter">
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-4 md:pl-6">
              <h4 className="font-extrabold text-white text-base tracking-wider uppercase">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-[#ffd700] transition duration-200">Home</Link></li>
                <li><Link href="/#menu" className="hover:text-[#ffd700] transition duration-200">Our Menu</Link></li>
                <li><Link href="/#store" className="hover:text-[#ffd700] transition duration-200">Store Finder</Link></li>
                <li><Link href="/cart" className="hover:text-[#ffd700] transition duration-200">Shopping Cart</Link></li>
                <li><Link href="/auth/sign-in" className="hover:text-[#ffd700] transition duration-200">Admin Area</Link></li>
              </ul>
            </div>

            {/* Column 3: Store Options */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-white text-base tracking-wider uppercase">Store Details</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffd700] mt-0.5">⏱️</span>
                  <span>
                    <strong>Hours:</strong><br />
                    3:00 PM – 2:00 AM Daily
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff6600] mt-0.5">💵</span>
                  <span>
                    <strong>Service options:</strong><br />
                    Cash only (Dine‑in & Takeaway)
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact details */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-white text-base tracking-wider uppercase">Contact Support</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffd700] mt-0.5">📞</span>
                  <span>
                    <strong>Phone:</strong><br />
                    <span className="text-white hover:text-[#ffd700] transition cursor-pointer font-bold">0304 7234727</span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff6600] mt-0.5">📍</span>
                  <span>
                    <strong>Address:</strong><br />
                    Canal Road, Abbasia Town Main Road, Rahim Yar Khan, 64200
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">✉️</span>
                  <span>
                    <strong>Email:</strong><br />
                    info@sauceburst.com
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Footer Copyright and bottom details */}
          <div className="border-t border-[#ffd700]/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              &copy; {new Date().getFullYear()} Sauce Burst. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <span>&middot;</span>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>
    </CartProvider>
  );
}