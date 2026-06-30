'use client';

import { useActionState } from 'react';
import { signIn } from '@/app/auth/actions';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const initialState = { error: null };

export default function SignInPage() {
  const [state, formAction] = useActionState(signIn, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl border-2 border-[#ffd700]/30 shadow-[0_0_40px_rgba(255,215,0,0.1)]">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
            <span className="text-[#ff0000]">Admin</span>
            <span className="text-[#ffd700]"> Panel</span>
          </h1>
          <p className="text-[#ffd700] text-sm font-semibold tracking-widest mt-1 uppercase">
            Manage Your Cravings
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#ffd700] mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ffd700]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition"
              placeholder="chef@diner.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#ffd700] mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ffd700]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] transition"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-[#ff6600]/50 transition-all transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}