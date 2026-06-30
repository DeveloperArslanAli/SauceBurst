'use client';

import { deleteCategory } from '@/app/actions/categories';

export default function DeleteCategoryButton({ id }: { id: string }) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this category? Items will be set to Uncategorized.')) {
      deleteCategory(id);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
    >
      Delete
    </button>
  );
}