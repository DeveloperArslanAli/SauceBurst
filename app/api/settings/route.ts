import { NextResponse } from 'next/server';
import supabaseAdmin from '@/app/lib/supabaseAdmin';

export async function GET() {
  // ✅ Use supabaseAdmin to bypass RLS and fetch the exact DB value
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'whatsapp')
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ whatsapp: null }, { status: 500 });
  }

  // Return the exact value stored in the database
  return NextResponse.json({ whatsapp: data?.value || null });
}