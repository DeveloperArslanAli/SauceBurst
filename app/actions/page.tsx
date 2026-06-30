'use server';

import { createClient } from '@/app/lib/supabaseServer';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient(); // <--- Added await

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }
  redirect('/admin');
}

export async function signOut() {
  const supabase = await createClient(); // <--- Added await
  await supabase.auth.signOut();
  redirect('/');
}
