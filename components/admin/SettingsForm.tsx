'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateSettings, type SettingsFormState } from '@/app/actions/settings';
import toast from 'react-hot-toast';

type SettingsFormProps = {
  initialPhone?: string;
};

const initialState: SettingsFormState = { error: null, data: null };

export default function SettingsForm({ initialPhone }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateSettings, initialState);
  const [savedNumber, setSavedNumber] = useState(initialPhone || '');

  const defaultPhone = state?.data?.phone ?? initialPhone ?? '';

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success && state?.data?.phone) {
      setSavedNumber(state.data.phone);
      toast.success('WhatsApp number updated! All order links now use the new number.');
    }
  }, [state]);

  // Also sync when page first loads with initialPhone from DB
  useEffect(() => {
    if (initialPhone) setSavedNumber(initialPhone);
  }, [initialPhone]);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {/* Current saved number live indicator */}
      {savedNumber && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <div>
            <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">Active WhatsApp Number</p>
            <p className="text-white font-mono text-sm mt-0.5">{savedNumber}</p>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg border border-red-500/30">
          ⚠️ {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          WhatsApp Number <span className="text-[#ffd700]">*</span>
          <span className="ml-2 text-xs text-gray-500 font-normal">Format: 03XXXXXXXXX</span>
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={defaultPhone}
          required
          placeholder="03211234567"
          maxLength={11}
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#ffd700]/30 rounded-lg text-white font-mono text-base focus:outline-none focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700]/30 transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          11-digit Pakistani number starting with 03. Saved value updates WhatsApp links site-wide instantly.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-lg shadow-lg shadow-[#ff6600]/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Saving…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L0 24l6.335-1.51A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.032-1.386l-.36-.214-3.732.89.93-3.618-.235-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Update WhatsApp Number
          </>
        )}
      </button>
    </form>
  );
}