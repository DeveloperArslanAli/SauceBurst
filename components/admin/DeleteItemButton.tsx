'use client';

import { deleteItem } from '@/app/actions/items';

export default function DeleteItemButton({ id }: { id: string }) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
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