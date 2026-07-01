import { createClient } from '@/app/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/auth/actions';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const isAdmin = user.app_metadata?.role === 'admin';
  if (!isAdmin) {
    return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white p-8 text-center">
      <h1 className="text-4xl font-bold text-[#ff0000]">Access Forbidden</h1>
      <p className="text-gray-400 mt-2">You are not authorized to view this page.</p>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white">
      <Toaster position="top-center" /> {/* ✅ Fix: Toast context added! */}
      
      <aside className="w-64 bg-[#222] border-r border-[#ffd700]/20 p-6 flex flex-col min-h-screen">
        <Link href="/" className="block mb-8 pb-4 border-b border-[#ffd700]/10 hover:opacity-80 transition">
          <h2 className="text-2xl font-black tracking-tight">
            <span className="text-[#ff0000]">Sauce</span>
            <span className="text-[#ffd700]">Burst</span>
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Admin</p>
        </Link>

        <nav className="flex-1 space-y-1">
          <Link href="/admin" className="block py-2 px-4 rounded-lg hover:bg-[#333] hover:text-[#ffd700] transition">Dashboard</Link>
          <Link href="/admin/items" className="block py-2 px-4 rounded-lg hover:bg-[#333] hover:text-[#ffd700] transition">Items</Link>
          <Link href="/admin/categories" className="block py-2 px-4 rounded-lg hover:bg-[#333] hover:text-[#ffd700] transition">Categories</Link>
          <Link href="/admin/orders" className="block py-2 px-4 rounded-lg hover:bg-[#333] hover:text-[#ffd700] transition">Orders</Link>
          <Link href="/admin/settings" className="block py-2 px-4 rounded-lg hover:bg-[#333] hover:text-[#ffd700] transition">Settings</Link>
        </nav>

        <form action={signOut} className="mt-auto pt-4 border-t border-[#ffd700]/10">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold rounded-lg transition shadow-md"
          >
            Logout
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-[#1a1a1a]">
        {children}
      </main>
    </div>
  );
}