'use client';

import { useActionState } from 'react';
import { updateSettings, type SettingsFormState } from '@/app/actions/settings';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

type SettingsFormProps = {
  initialPhone?: string;
};

const initialState: SettingsFormState = { error: null, data: null };

export default function SettingsForm({ initialPhone }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateSettings, initialState);

  const formData = state?.data || {};
  const defaultPhone = formData.phone ?? initialPhone ?? '';

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
        <label className="block text-sm font-medium text-gray-300">WhatsApp Number (Format: 03XXXXXXXXX) *</label>
        <input
          type="tel"
          name="phone"
          defaultValue={defaultPhone}
          required
          placeholder="03211234567"
          className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#ffd700]/30 rounded text-white focus:outline-none focus:border-[#ffd700]"
        />
        <p className="text-xs text-gray-400 mt-1">Must be an 11-digit Pakistani number starting with 03.</p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-[#ff6600] hover:bg-[#ff5500] text-white font-bold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Saving...' : 'Update WhatsApp Number'}
      </button>
    </form>
  );
}