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
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
        <header className="bg-[#222] border-b border-[#ffd700]/20 py-4 px-6 sticky top-0 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-3xl font-black tracking-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
              <span className="text-[#ff0000]">Sauce</span>
              <span className="text-[#ffd700]">Burst</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-[#ffd700] font-semibold hover:text-white transition">Home</Link>
              <div className="relative group">
                <button className="text-gray-300 font-semibold hover:text-[#ffd700] transition flex items-center gap-1">
                  FOOD
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 mt-3 w-48 bg-[#2a2a2a] border border-[#ffd700]/20 rounded-lg shadow-xl z-50 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 transform origin-top-left group-hover:translate-y-0 translate-y-2">
                  <div className="py-2 px-1">
                    {categories?.map((cat) => (
                      <Link key={cat.id} href={`/category/${cat.slug}`} prefetch={true} className="block px-4 py-2 text-gray-300 hover:bg-[#333] hover:text-[#ffd700] rounded-lg transition">
                        {cat.name}
                      </Link>
                    ))}
                    <Link href="/" prefetch={true} className="block px-4 py-2 text-gray-300 hover:bg-[#333] hover:text-[#ffd700] rounded-lg transition border-t border-[#ffd700]/10 mt-1">View All</Link>
                  </div>
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-6">
              <Link href="/auth/sign-in" className="text-sm font-semibold text-gray-300 hover:text-[#ffd700] transition hidden sm:block">Admin Login</Link>
              <CartIcon />
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
          <Breadcrumbs />
          {children}
        </main>
        <footer className="bg-[#222] border-t border-[#ffd700]/20 py-8 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-black text-[#ffd700] mb-2">Sauce Burst</h3>
              <p className="text-gray-400 text-sm">Fueling your cravings with the best burgers, pizzas, and drinks in town!</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Contact</h4>
              <p className="text-gray-400 text-sm">Phone: <span className="text-[#ffd700]">0327 9317307</span></p>
              <p className="text-gray-400 text-sm">Email: info@sauceburst.com</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Follow Us</h4>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="#" className="text-gray-400 hover:text-[#ffd700] transition">FB</a>
                <a href="#" className="text-gray-400 hover:text-[#ffd700] transition">IG</a>
                <a href="#" className="text-gray-400 hover:text-[#ffd700] transition">TW</a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs mt-8 border-t border-[#ffd700]/10 pt-4">
            &copy; {new Date().getFullYear()} Sauce Burst. All rights reserved.
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}