'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/app/lib/supabaseAdmin';
import { z } from 'zod';

export type CategoryFormState = {
  error: string | null;
  data: {
    name?: string;
    description?: string;
  } | null;
};

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data, error } = await supabaseAdmin
      .from('categories')
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

const CategorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().optional().default(''),
});

export async function createCategory(prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  };

  const validation = CategorySchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message, data: rawData };
  }

  const { name, description } = validation.data;
  const baseSlug = generateSlug(name);
  const slug = await getUniqueSlug(baseSlug);

  const { error } = await supabaseAdmin
    .from('categories')
    .insert({ name, slug, description });

  if (error) {
    return { error: 'Failed to create category: ' + error.message, data: rawData };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export async function updateCategory(id: string, prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  };

  const validation = CategorySchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.issues[0].message, data: rawData };
  }

  const { name, description } = validation.data;
  let slug = generateSlug(name);
  
  const { data: existing } = await supabaseAdmin
    .from('categories').select('id').eq('slug', slug).neq('id', id).maybeSingle();
  if (existing) slug = await getUniqueSlug(slug);

  const { error } = await supabaseAdmin
    .from('categories')
    .update({ name, slug, description })
    .eq('id', id);

  if (error) {
    return { error: 'Failed to update category: ' + error.message, data: rawData };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/categories');
    revalidatePath('/admin/items');
    revalidatePath('/');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error('Failed to delete category: ' + message);
  }
}