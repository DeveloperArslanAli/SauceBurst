'use client';

import { useActionState } from 'react';
import { createCategory, updateCategory, type CategoryFormState } from '@/app/actions/categories';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

type CategoryFormProps = {
  initialData?: { id: string; name: string; description: string };
  isEdit?: boolean;
};

const initialState: CategoryFormState = { error: null, data: null };

export default function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
  const action = isEdit ? updateCategory.bind(null, initialData!.id) : createCategory;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const formData = state?.data || {};
  const defaultName = formData.name ?? initialData?.name ?? '';
  const defaultDescription = formData.description ?? initialData?.description ?? '';

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {state?.error && (
        <div className="text-red-500 text-sm p-3 bg-red-900/20 rounded-lg border border-red-500/30">
          ⚠️ {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300">Category Name (Min 3 letters) *</label>
        <input type="text" name="name" defaultValue={defaultName} required className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea name="description" defaultValue={defaultDescription} rows={3} className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]" />
      </div>
      <button type="submit" disabled={isPending} className="w-full py-3 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
        {isPending ? 'Submitting...' : (isEdit ? 'Update Category' : 'Create Category')}
      </button>
    </form>
  );
}