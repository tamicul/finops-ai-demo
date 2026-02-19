"use client";

import { useState } from "react";
import { ArrowLeft, Save, Shield, Bell, Lock, User, Landmark, CreditCard, Smartphone, Key } from "lucide-react";
import Link from "next/link";
import { CurrencySelector } from "@/components/currency-selector";
import { CurrencyCode } from "@/lib/currency/config";

interface SettingsClientProps {
  user: {
    firstName: string;
    email?: string;
    has2FA: boolean;
  };
  financialData: {
    cashBalance: number;
    monthlyBurn: number;
    monthlyRevenue: number;
    runway: number;
  } | null;
  currency: string;
}

export default function SettingsClient({ user, financialData, currency }: SettingsClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    cashBalance: financialData?.cashBalance || 0,
    monthlyBurn: financialData?.monthlyBurn || 0,
    monthlyRevenue: financialData?.monthlyRevenue || 0,
    runway: financialData?.runway || 0,
    currency: currency as CurrencyCode,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Settings</h1>
              <p className="text-sm text-zinc-400">Manage your account and preferences</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "profile" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                <User className="w-5 h-5" /> Profile
              </button>
              <button onClick={() => setActiveTab("financial")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "financial" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                <CreditCard className="w-5 h-5" /> Financial Data
              </button>
              <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "security" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                <Shield className="w-5 h-5" /> Security
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
                  <div><label className="block text-sm text-zinc-400 mb-2">Name</label><input type="text" value={user.firstName} disabled className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white opacity-50" /></div>
                  <div className="mt-4"><label className="block text-sm text-zinc-400 mb-2">Email</label><input type="email" value={user.email} disabled className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white opacity-50" /></div>
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Currency</h2>
                  <CurrencySelector value={formData.currency} onChange={(c) => setFormData({ ...formData, currency: c })} />
                </div>
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Financial Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-zinc-400 mb-2">Cash Balance</label><input type="number" value={formData.cashBalance} onChange={(e) => setFormData({ ...formData, cashBalance: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" /></div>
                    <div><label className="block text-sm text-zinc-400 mb-2">Monthly Burn</label><input type="number" value={formData.monthlyBurn} onChange={(e) => setFormData({ ...formData, monthlyBurn: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" /></div>
                    <div><label className="block text-sm text-zinc-400 mb-2">Monthly Revenue</label><input type="number" value={formData.monthlyRevenue} onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" /></div>
                    <div><label className="block text-sm text-zinc-400 mb-2">Runway (months)</label><input type="number" value={formData.runway} onChange={(e) => setFormData({ ...formData, runway: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" /></div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl transition-colors">
                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Shield className="w-6 h-6 text-emerald-400" /></div>
                    <div><h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2><p className="text-sm text-zinc-400">Add an extra layer of security</p></div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-zinc-400" /><div><p className="text-sm font-medium text-white">Authenticator App</p><p className="text-xs text-zinc-500">Use Google Authenticator</p></div></div>
                      <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">Enable</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

