'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { confirmOrderOnline } from '@/app/actions/orders';

export default function OrderConfirmationClient({ 
  orderId, 
  total, 
  items, 
  customerName, 
  customerPhone 
}: { 
  orderId: string; 
  total: number; 
  items: any[]; 
  customerName: string; 
  customerPhone: string;
}) {
  const [showCopyLink, setShowCopyLink] = useState(false);
  const [linkToCopy, setLinkToCopy] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Updated Message to include Customer Details
  const buildMessage = () => {
    let msg = `🍔 *Sauce Burst Order #${orderId}*\n\n`;
    msg += `*Customer:* ${customerName || 'Guest'}\n`;
    msg += `*Phone:* ${customerPhone || 'N/A'}\n\n`;
    msg += `*Items:*\n`;
    items.forEach((item: any) => {
      msg += `- ${item.name} x${item.quantity} = Rs. ${item.price * item.quantity}\n`;
    });
    msg += `\n*Total: Rs. ${total}*\n\nPlease confirm my order.`;
    return encodeURIComponent(msg);
  };

  // ✅ Updated WhatsApp Logic: Opens WhatsApp + Redirects to Home afterwards
  const handleWhatsApp = async () => {
    // Open a blank window first to satisfy browser popup blockers
    const newWindow = window.open('', '_blank');
    if (!newWindow || newWindow.closed) {
      setShowCopyLink(true);
      toast.error('Please allow popups or copy the link manually.');
      return;
    }

    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      const latestNumber = data.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923xxxxxxxxx';
      
      const message = buildMessage();
      const url = `https://wa.me/${latestNumber}?text=${message}`;
      newWindow.location.href = url;

      // 🚀 Success Toast and Redirect to Homepage
      toast.success('✅ Order confirmed via WhatsApp!');
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1500); 

    } catch (error) {
      newWindow.close(); // Close the empty tab if it fails
      toast.error('Failed to fetch WhatsApp number');
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(linkToCopy);
    toast.success('WhatsApp link copied to clipboard!');
    setShowCopyLink(false);
  };

  // ✅ Online Order Logic (Unchanged, redirects to Home)
  const handleOnlineConfirm = async () => {
    if (loading) return;
    setLoading(true);
    const result = await confirmOrderOnline(orderId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('✅ Order successfully placed!', { duration: 2000 });
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1500);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleWhatsApp}
          className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg rounded-lg shadow-lg transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Confirm via WhatsApp
        </button>

        <button
          onClick={handleOnlineConfirm}
          disabled={loading}
          className="w-full py-4 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold text-lg rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Submitting...</span>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5h15M7 13h10"/></svg>
              Place Order Online
            </>
          )}
        </button>
      </div>

      {showCopyLink && (
        <div className="mt-4 p-4 bg-[#1a1a1a] border border-[#ffd700]/30 rounded-lg">
          <p className="text-gray-300 mb-2 text-sm">Popup blocked. Copy the link below and paste it into your browser:</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={linkToCopy}
              className="flex-1 px-3 py-2 bg-[#2a2a2a] text-white border border-gray-600 rounded text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[#ffd700] text-[#1a1a1a] font-bold rounded hover:bg-[#ffcc00] transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}