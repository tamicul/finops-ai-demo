"use client";

import { useState } from "react";
import { ArrowLeft, Save, Shield, Bell, Lock, User, Building2, CreditCard, Smartphone, Key } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<'profile' | 'financial' | 'security' | 'integrations'>('profile');
  const [formData, setFormData] = useState({
    cashBalance: financialData?.cashBalance || 0,
    monthlyBurn: financialData?.monthlyBurn || 0,
    monthlyRevenue: financialData?.monthlyRevenue || 0,
    runway: financialData?.runway || 0,
    currency: currency as CurrencyCode,
  });
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    spendingAlerts: true,
    weeklyReport: true,
    anomalyAlerts: true,
  });
  
  const [security, setSecurity] = useState({
    twoFactor: user.has2FA,
    loginNotifications: true,
    sessionTimeout: 30,
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
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'financial', label: 'Financial Data', icon: CreditCard },
    { id: 'security', label: 'Security & 2FA', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
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
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Name</label>
                      <input
                        type="text"
                        value={user.firstName}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white opacity-50"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Managed by Clerk</p>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white opacity-50"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Managed by Clerk</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [key]: !value })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            value ? 'bg-emerald-500' : 'bg-zinc-700'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Financial Data Tab */}
            {activeTab === 'financial' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Currency</h2>
                  <CurrencySelector 
                    value={formData.currency}
                    onChange={(newCurrency) => setFormData({ ...formData, currency: newCurrency })}
                  />
                </div>

                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Financial Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Cash Balance</label>
                      <input
                        type="number"
                        value={formData.cashBalance}
                        onChange={(e) => setFormData({ ...formData, cashBalance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Monthly Burn</label>
                      <input
                        type="number"
                        value={formData.monthlyBurn}
                        onChange={(e) => setFormData({ ...formData, monthlyBurn: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Monthly Revenue</label>
                      <input
                        type="number"
                        value={formData.monthlyRevenue}
                        onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Runway (months)</label>
                      <input
                        type="number"
                        value={formData.runway}
                        onChange={(e) => setFormData({ ...formData, runway: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
                      <p className="text-sm text-zinc-400">Add an extra layer of security to your account</p>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Authenticator App</p>
                          <p className="text-xs text-zinc-500">Use Google Authenticator or similar</p>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          security.twoFactor
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        {security.twoFactor ? 'Enabled' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-zinc-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Backup Codes</p>
                          <p className="text-xs text-zinc-500">Generate backup codes for account recovery</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Login Notifications</p>
                        <p className="text-xs text-zinc-500">Get notified of new sign-ins</p>
                      </div>
                      <button
                        onClick={() => setSecurity({ ...security, loginNotifications: !security.loginNotifications })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          security.loginNotifications ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          security.loginNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Session Timeout</p>
                        <p className="text-xs text-zinc-500">Auto-logout after inactivity</p>
                      </div>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                        className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Landmark Connections</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Chase', status: 'Not connected', icon: '🏦' },
                      { name: 'Landmark of America', status: 'Not connected', icon: '🏦' },
                      { name: 'Wells Fargo', status: 'Not connected', icon: '🏦' },
                      { name: 'Stripe', status: 'Not connected', icon: '💳' },
                      { name: 'PayPal', status: 'Not connected', icon: '💰' },
                    ].map((bank) => (
                      <div key={bank.name} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{bank.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-white">{bank.name}</p>
                            <p className="text-xs text-zinc-500">{bank.status}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-2xl p-6 border border-blue-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">Landmark-Level Security</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Your financial data is encrypted and securely stored. We use Plaid to connect to your bank accounts safely.
                      </p>
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