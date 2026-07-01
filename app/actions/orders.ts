'use server';

import { revalidatePath } from 'next/cache';
import supabaseAdmin from '@/app/lib/supabaseAdmin';
import { z } from 'zod';

const StatusSchema = z.enum(['pending', 'preparing', 'completed', 'canceled', 'received'], {
  message: 'Invalid order status.',
});

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const validation = StatusSchema.safeParse(newStatus);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: validation.data })
    .eq('id', orderId);

  if (error) {
    return { error: 'Failed to update order status: ' + error.message };
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin'); // ✅ Force dashboard to refresh immediately
  return { success: true };
}

export async function confirmOrderOnline(orderId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status: 'received', source: 'website' })
      .eq('id', orderId);

    if (error) throw new Error(error.message);
    
    revalidatePath(`/order/${orderId}`);
    revalidatePath('/admin'); // ✅ Force dashboard to refresh immediately
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to confirm online order.';
    return { error: message };
  }
}