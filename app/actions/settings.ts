'use server';

import { revalidatePath } from 'next/cache';
import supabaseAdmin from '@/app/lib/supabaseAdmin';
import { z } from 'zod';

// Type definitions for State Management
export type SettingsFormState = {
  error: string | null;
  data: { phone?: string } | null;
  success?: boolean;
};

// Zod Validation — Pakistani format: 03xxxxxxxxx
const PhoneSchema = z.object({
  phone: z.string().regex(/^03\d{9}$/, 'Phone must be in the format 03XXXXXXXXX (11 digits).'),
});

export async function updateSettings(
  prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const rawData = { phone: formData.get('phone') as string };

  const validation = PhoneSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message, data: rawData };
  }

  const { phone } = validation.data;

  // Upsert the 'whatsapp' key — updates instantly in DB
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ key: 'whatsapp', value: phone }, { onConflict: 'key' });

  if (error) {
    return { error: 'Failed to update WhatsApp number: ' + error.message, data: rawData };
  }

  // Revalidate all paths that use the WhatsApp number
  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/cart');
  revalidatePath('/order/[id]');

  return { error: null, data: { phone }, success: true };
}