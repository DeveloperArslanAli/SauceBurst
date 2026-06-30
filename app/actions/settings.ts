'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/app/lib/supabaseAdmin';
import { z } from 'zod';

// Type definitions for State Management
export type SettingsFormState = {
  error: string | null;
  data: { phone?: string } | null;
};

// Zod Validation for WhatsApp number (Pakistani format: 03xxxxxxxxx)
const PhoneSchema = z.object({
  phone: z.string().regex(/^03\d{9}$/, 'Phone must be in the format 03XXXXXXXXX (11 digits).'),
});

export async function updateSettings(prevState: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const rawData = {
    phone: formData.get('phone') as string,
  };

  const validation = PhoneSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message, data: rawData };
  }

  const { phone } = validation.data;

  // Upsert the 'whatsapp' key in the settings table
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ key: 'whatsapp', value: phone }, { onConflict: 'key' });

  if (error) {
    return { error: 'Failed to update WhatsApp number: ' + error.message, data: rawData };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  redirect('/admin/settings');
}