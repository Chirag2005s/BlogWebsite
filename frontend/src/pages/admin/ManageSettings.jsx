import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function ManageSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setMessage('Global Settings saved successfully!');
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0F6B4F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#0F6B4F]/10 text-[#0F6B4F] rounded-xl">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-heading">Site Settings</h1>
          <p className="text-sm text-muted">Manage global configuration for your platform</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-8">
        {message && (
          <div className={`flex items-center gap-2 p-4 rounded-xl text-sm ${
            message.includes('success') 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            <CheckCircle2 size={16} />
            {message}
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-heading border-b border-line pb-2">General Settings</h2>
          <p className="text-sm text-muted">Other site-wide settings will go here in the future.</p>
        </div>

        <div className="pt-4 border-t border-line flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#0C5A42] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
