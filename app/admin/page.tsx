'use client';

import { useState } from 'react';
import {
  Lock, LogOut, Settings, Eye, EyeOff, ToggleLeft, ToggleRight,
  MonitorPlay, Megaphone, Clock, Save, CheckCircle2, AlertTriangle, Shield
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import toast from 'react-hot-toast';

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function LoginForm() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login } = useAdminStore();

  const handleLogin = () => {
    const ok = login(password);
    if (ok) {
      toast.success('Welcome to the Admin Panel');
    } else {
      toast.error('Incorrect password');
    }
    setPassword('');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your admin password to continue</p>
        </div>

        <div className="card">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div className="relative mb-4">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={handleLogin} disabled={!password} className="btn-primary w-full justify-center py-2.5">
            <Lock className="w-4 h-4" /> Sign In
          </button>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Default password: <code className="font-mono bg-amber-100 px-1 rounded">powerdoc2024</code>. Change this in <code className="font-mono">store/adminStore.ts</code> before production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const {
    isLoggedIn, logout,
    adBeforeDownload, adDuration,
    topBannerEnabled, sidebarAdsEnabled,
    topBannerCode, leftAdCode, rightAdCode,
    updateSetting,
  } = useAdminStore();

  const [saved, setSaved] = useState(false);

  if (!isLoggedIn) return <LoginForm />;

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" /> Admin Panel
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage advertising and download settings</p>
        </div>
        <button onClick={logout} className="btn-secondary py-2 px-3 text-sm">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="space-y-6">
        {/* Download Ad Section */}
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <MonitorPlay className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Download Ad Gate</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">When enabled, users must watch an ad for the configured duration before they can download or print a document.</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="font-medium text-slate-700 text-sm">Enable ad before download</p>
                <p className="text-xs text-slate-500 mt-0.5">Show a countdown ad when user clicks download or print</p>
              </div>
              <Toggle enabled={adBeforeDownload} onChange={(v) => updateSetting('adBeforeDownload', v)} />
            </div>

            <div className={`transition-opacity ${adBeforeDownload ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ad duration (seconds)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={adDuration}
                  onChange={(e) => updateSetting('adDuration', Number(e.target.value))}
                  className="flex-1"
                />
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg min-w-[56px] justify-center">
                  <Clock className="w-4 h-4" />
                  {adDuration}s
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Users will wait {adDuration} seconds before the download button activates.</p>
            </div>
          </div>
        </div>

        {/* Ad Space Visibility */}
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Ad Space Visibility</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">Control which ad slots are visible on the site.</p>

          <div className="space-y-0">
            {[
              { key: 'topBannerEnabled' as const, label: 'Top banner (728×90)', desc: 'Shown across the top of every page' },
              { key: 'sidebarAdsEnabled' as const, label: 'Sidebar ads (160×600)', desc: 'Left and right column ads on wide screens' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  enabled={item.key === 'topBannerEnabled' ? topBannerEnabled : sidebarAdsEnabled}
                  onChange={(v) => updateSetting(item.key, v)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ad Code Injection */}
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Ad Code</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Paste your Google AdSense code or custom HTML for each ad slot. Leave empty to show placeholder boxes.
          </p>

          <div className="space-y-4">
            {[
              { key: 'topBannerCode' as const, label: 'Top banner code', value: topBannerCode, placeholder: '<!-- Google AdSense or custom HTML for top banner (728×90) -->' },
              { key: 'leftAdCode' as const, label: 'Left sidebar code', value: leftAdCode, placeholder: '<!-- Google AdSense or custom HTML for left sidebar (160×600) -->' },
              { key: 'rightAdCode' as const, label: 'Right sidebar code', value: rightAdCode, placeholder: '<!-- Google AdSense or custom HTML for right sidebar (160×600) -->' },
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{item.label}</label>
                <textarea
                  rows={3}
                  value={item.value}
                  onChange={(e) => updateSetting(item.key, e.target.value)}
                  placeholder={item.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-slate-600 bg-slate-50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`btn-primary w-full justify-center py-3 text-base ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {saved ? (
            <><CheckCircle2 className="w-5 h-5" /> Saved!</>
          ) : (
            <><Save className="w-5 h-5" /> Save Settings</>
          )}
        </button>

        <p className="text-xs text-center text-slate-400">
          Settings are stored in your browser&apos;s local storage. They persist across sessions on this device.
        </p>
      </div>
    </div>
  );
}
