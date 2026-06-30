'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function OrderConfirmationClient({ orderId, total, items }: { orderId: string; total: number; items: any[] }) {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [showCopyLink, setShowCopyLink] = useState(false);
  const [linkToCopy, setLinkToCopy] = useState('');

  // Fetch WhatsApp number dynamically on mount
  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setWhatsappNumber(data.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923xxxxxxxxx');
      } catch {
        setWhatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923xxxxxxxxx');
      }
    };
    fetchNumber();
  }, []);

  const buildMessage = () => {
    let msg = `🍔 *Sauce Burst Order #${orderId}*\n\n*Items:*\n`;
    items.forEach((item: any) => {
      msg += `- ${item.name} x${item.quantity} = Rs. ${item.price * item.quantity}\n`;
    });
    msg += `\n*Total: Rs. ${total}*\n\nPlease confirm my order.`;
    return encodeURIComponent(msg);
  };

  const handleWhatsApp = () => {
    const message = buildMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Try to open the link
    const newWindow = window.open(url, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup blocked or failed – show fallback
      setLinkToCopy(url);
      setShowCopyLink(true);
      toast.error('Please allow popups or copy the link manually.');
    } else {
      toast.success('WhatsApp opened successfully!');
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(linkToCopy);
    toast.success('WhatsApp link copied to clipboard!');
    setShowCopyLink(false);
  };

  return (
    <div>
      <button
        onClick={handleWhatsApp}
        className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg rounded-lg shadow-lg transition"
      >
        Confirm via WhatsApp
      </button>

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