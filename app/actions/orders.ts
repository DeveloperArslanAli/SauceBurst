'use server';

import { revalidatePath } from 'next/cache';
import supabaseAdmin from '@/app/lib/supabaseAdmin';
import { z } from 'zod';

const StatusSchema = z.enum(['pending', 'preparing', 'completed', 'canceled'], {
  errorMap: () => ({ message: 'Invalid order status.' }),
});

export async function updateOrderStatus(orderId: string, newStatus: string) {
  // Validate status
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
  return { success: true };
}