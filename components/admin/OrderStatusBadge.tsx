'use client';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-900 text-yellow-300',
  preparing: 'bg-blue-900 text-blue-300',
  completed: 'bg-green-900 text-green-300',
  canceled: 'bg-red-900 text-red-300',
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const colorClass = statusColors[status] || statusColors.pending;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${colorClass}`}>
      {status || 'pending'}
    </span>
  );
}