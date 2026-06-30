'use client';

export default function OrderDetailsModal({ 
  isOpen, 
  onClose, 
  items, 
  customerName, 
  total 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: any[]; 
  customerName: string; 
  total: number; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#2a2a2a] border border-[#ffd700]/20 rounded-xl p-6 max-w-md w-full mx-4 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-[#ffd700] mb-4">Order Items</h2>
        <p className="text-gray-300 mb-3">Customer: <span className="text-white font-medium">{customerName || 'Guest'}</span></p>
        
        <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-2 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-300 border-b border-[#ffd700]/5 pb-2">
                <span>{item.name} <span className="text-gray-500 text-xs">x{item.quantity}</span></span>
                <span className="text-[#ffd700]">Rs. {item.price * item.quantity}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No items found.</p>
          )}
        </div>
        
        <div className="flex justify-between text-white font-bold border-t border-[#ffd700]/20 pt-3">
          <span>Total</span>
          <span className="text-[#ffd700]">Rs. {total}</span>
        </div>
      </div>
    </div>
  );
}