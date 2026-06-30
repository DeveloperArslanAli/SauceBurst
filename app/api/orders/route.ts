import { NextResponse } from 'next/server';
import supabaseAdmin from '@/app/lib/supabaseAdmin';

export async function POST(request: Request) {
  const body = await request.json();
  const { customer_name, customer_phone, items, total_amount } = body;

  // ✅ Using supabaseAdmin bypasses RLS and allows public order inserts!
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_name,
      customer_phone,
      total_amount,
      status: 'pending',
      notes: JSON.stringify(items),
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data }, { status: 201 });
}