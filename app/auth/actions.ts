'use server';

import { createClient } from '@/app/lib/supabaseServer';
import { redirect } from 'next/navigation';

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let supabaseError = null;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      supabaseError = error.message;
    }
  } catch (err) {
    console.error('Sign in error:', err);
    supabaseError = 'Configuration error. Please check server logs.';
  }

  if (supabaseError) {
    return { error: supabaseError };
  }

  // ✅ Redirect MUST be outside the try/catch block!
  redirect('/admin');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}