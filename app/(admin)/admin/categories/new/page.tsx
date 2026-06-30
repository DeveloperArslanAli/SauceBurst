import CategoryForm from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#ffd700] mb-6">Add New Category</h1>
      <CategoryForm />
    </div>
  );
}