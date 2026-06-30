'use client';

import { useActionState } from 'react';
import { createItem, updateItem, type ItemFormState } from '@/app/actions/items';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Category = { id: string; name: string; };
type ItemFormProps = {
  categories: Category[];
  initialData?: {
    id: string; name: string; description: string; price: number; category_id: string; is_available: boolean; image_url: string | null;
  };
  isEdit?: boolean;
};

const initialState: ItemFormState = { error: null, data: null };

export default function ItemForm({ categories, initialData, isEdit = false }: ItemFormProps) {
  const action = isEdit ? updateItem.bind(null, initialData!.id) : createItem;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [fileError, setFileError] = useState<string | null>(null);

  // Keep user inputs intact on validation errors
  const formData = state?.data || {};
  const defaultName = formData.name ?? initialData?.name ?? '';
  const defaultDescription = formData.description ?? initialData?.description ?? '';
  const defaultPrice = formData.price ?? initialData?.price ?? '';
  const defaultCategoryId = formData.category_id ?? initialData?.category_id ?? '';
  const defaultIsAvailable = formData.is_available !== undefined ? formData.is_available : (initialData?.is_available ?? true);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('Image size must be less than 5MB.');
        e.target.value = ''; 
      } else {
        setFileError(null);
      }
    }
  };

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {/* Server-side error banner */}
      {state?.error && (
        <div className="text-red-500 text-sm p-3 bg-red-900/20 rounded-lg border border-red-500/30">
          ⚠️ {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300">Name (Min 3 letters) *</label>
        <input type="text" name="name" defaultValue={defaultName} required className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Description (Min 30 characters) *</label>
        <textarea name="description" defaultValue={defaultDescription} rows={4} required className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Price (Rs.) *</label>
        <input type="number" name="price" defaultValue={defaultPrice} step="0.01" min="0.01" required className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Category *</label>
        <select name="category_id" defaultValue={defaultCategoryId} required className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]">
          <option value="">Select a category</option>
          {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Image (Max 5MB)</label>
        <input type="file" name="image" accept="image/*" onChange={handleFileChange} className={`w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff6600] file:text-white hover:file:bg-[#ff5500] ${fileError ? 'border border-red-500 rounded-lg' : ''}`} />
        {fileError && <p className="text-red-500 text-sm mt-1 font-medium">{fileError}</p>}
        {initialData?.image_url && <p className="mt-1 text-xs text-gray-400">Current image: {initialData.image_url}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_available" defaultChecked={defaultIsAvailable} className="w-4 h-4 text-[#ff6600] bg-[#1a1a1a] border-[#ffd700]/30 rounded focus:ring-[#ff6600]" />
        <label className="text-sm font-medium text-gray-300">Available</label>
      </div>
      <button type="submit" disabled={isPending || !!fileError} className="w-full py-3 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
        {isPending ? 'Submitting...' : (isEdit ? 'Update Item' : 'Create Item')}
      </button>
    </form>
  );
}