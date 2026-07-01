'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/app/lib/supabaseAdmin';
import { z } from 'zod';

// Type definitions for State Management
export type ItemFormState = {
  error: string | null;
  data: {
    name?: string;
    description?: string;
    price?: number | string;
    category_id?: string;
    is_available?: boolean;
  } | null;
};

// Helper: Generate URL-friendly slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Ensure slug uniqueness
async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data, error } = await supabaseAdmin
      .from('items')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

// Zod Schema (Strict validation)
const ItemSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(30, 'Description must be at least 30 characters.'),
  price: z.coerce.number().positive('Price must be greater than 0.'),
  category_id: z.string().min(1, 'Please select a valid category.'),
  is_available: z.boolean().default(true),
});

// Helper: Upload image to Supabase Storage
async function uploadImage(file: File, itemId: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${itemId}.${fileExt}`;
    
    const { data, error } = await supabaseAdmin.storage
      .from('items')
      .upload(fileName, file, { upsert: true });
      
    if (error) return null;
    if (!data) return null;

    const { data: urlData } = supabaseAdmin.storage
      .from('items')
      .getPublicUrl(fileName);
      
    return urlData.publicUrl;
  } catch {
    return null; // Gracefully fail image upload, but keep the item
  }
}

export async function createItem(prevState: ItemFormState, formData: FormData): Promise<ItemFormState> {
  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    category_id: formData.get('category_id') as string,
    is_available: formData.get('is_available') === 'on',
  };
  const imageFile = formData.get('image') as File;

  const validation = ItemSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message, data: rawData };
  }

  const { name, description, price, category_id, is_available } = validation.data;
  const baseSlug = generateSlug(name);
  const slug = await getUniqueSlug(baseSlug);

  const { data: item, error } = await supabaseAdmin
    .from('items')
    .insert({
      name, slug, description, price, category_id, is_available, image_url: null,
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to create item: ' + error.message, data: rawData };
  }

  // Attempt image upload async (doesn't block the redirect)
  if (imageFile && imageFile.size > 0) {
    const publicUrl = await uploadImage(imageFile, item.id);
    if (publicUrl) {
      const relativePath = publicUrl.replace(/.*\/items\//, '');
      await supabaseAdmin.from('items').update({ image_url: relativePath }).eq('id', item.id);
    }
  }

  revalidatePath('/admin/items');
  revalidatePath('/');
  redirect('/admin/items'); // 🚀 redirect() throws a specific error
}

export async function updateItem(id: string, prevState: ItemFormState, formData: FormData): Promise<ItemFormState> {
  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    category_id: formData.get('category_id') as string,
    is_available: formData.get('is_available') === 'on',
  };
  const imageFile = formData.get('image') as File;

  const validation = ItemSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message, data: rawData };
  }

  const { name, description, price, category_id, is_available } = validation.data;
  let slug = generateSlug(name);
  
  const { data: existing } = await supabaseAdmin
    .from('items').select('id').eq('slug', slug).neq('id', id).maybeSingle();
  if (existing) slug = await getUniqueSlug(slug);

  const { error } = await supabaseAdmin
    .from('items').update({ name, slug, description, price, category_id, is_available }).eq('id', id);

  if (error) {
    return { error: 'Failed to update item: ' + error.message, data: rawData };
  }

  if (imageFile && imageFile.size > 0) {
    const publicUrl = await uploadImage(imageFile, id);
    if (publicUrl) {
      const relativePath = publicUrl.replace(/.*\/items\//, '');
      await supabaseAdmin.from('items').update({ image_url: relativePath }).eq('id', id);
    }
  }

  revalidatePath('/admin/items');
  revalidatePath('/');
  revalidatePath(`/item/${id}`);
  redirect('/admin/items');
}

export async function deleteItem(id: string) {
  try {
    const { error } = await supabaseAdmin.from('items').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/items');
    revalidatePath('/');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error('Failed to delete item: ' + message);
  }
}