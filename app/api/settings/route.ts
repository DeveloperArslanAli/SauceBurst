import { createClient } from '@/app/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient(); // ✅ Added await

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'whatsapp')
    .single();

  if (error || !data) {
    return NextResponse.json({ whatsapp: null });
  }

  return NextResponse.json({ whatsapp: data.value });
}