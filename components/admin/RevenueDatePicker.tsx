'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RevenueDatePicker({ defaultStart = '', defaultEnd = '' }: { defaultStart?: string; defaultEnd?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state to fallback to defaultStart/End, ensuring inputs are NEVER empty
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  // Sync state with URL params on load or after back/forward navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStartDate(params.get('startDate') || defaultStart);
    setEndDate(params.get('endDate') || defaultEnd);
  }, [defaultStart, defaultEnd]);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#2a2a2a] p-3 rounded-lg border border-[#ffd700]/20">
      <span className="text-sm text-gray-400">Revenue Range:</span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="px-3 py-1 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white text-sm focus:outline-none focus:border-[#ffd700]"
      />
      <span className="text-gray-400 text-sm">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="px-3 py-1 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white text-sm focus:outline-none focus:border-[#ffd700]"
      />
      <button
        onClick={handleApply}
        className="px-4 py-1 bg-[#ff6600] hover:bg-[#ff5500] text-white text-sm font-bold rounded transition"
      >
        Apply
      </button>
    </div>
  );
}