import { createClient } from '@/app/lib/supabaseServer';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Fetch the current WhatsApp number from the settings table
  const { data: setting, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'whatsapp')
    .maybeSingle();

  if (error) {
    return <div className="text-red-500">Failed to load settings.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#ffd700] mb-6">Admin Settings</h1>
      <p className="text-gray-400 mb-6">Manage your restaurant&apos;s global configuration.</p>

      <div className="bg-[#2a2a2a] border border-[#ffd700]/20 rounded-lg p-6 max-w-2xl">
        <h2 className="text-lg font-bold text-white mb-4 border-b border-[#ffd700]/10 pb-3">WhatsApp Integration</h2>
        <SettingsForm initialPhone={setting?.value || ''} />
      </div>
    </div>
  );
}