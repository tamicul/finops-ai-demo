"use client";

import { useState } from "react";
import { ArrowLeft, Save, Shield, Bell, Lock, User, Landmark, CreditCard, Smartphone, Key, Building2, MapPin, Globe, Users, Calendar, Briefcase } from "lucide-react";
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
  userSettings: {
    currency: string;
    businessName?: string;
    businessType?: string;
    industry?: string;
    location?: string;
    foundedYear?: number;
    employeeCount?: number;
    website?: string;
  };
}

const businessTypes = [
  "LLC",
  "Corporation (C-Corp)",
  "Corporation (S-Corp)",
  "Partnership",
  "Sole Proprietorship",
  "Nonprofit",
  "Other"
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Manufacturing",
  "Consulting",
  "Education",
  "Real Estate",
  "Entertainment",
  "Food & Beverage",
  "Transportation",
  "Agriculture",
  "Energy",
  "Other"
];

export default function SettingsClient({ user, financialData, userSettings }: SettingsClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [businessProfile, setBusinessProfile] = useState({
    businessName: userSettings.businessName || '',
    businessType: userSettings.businessType || '',
    industry: userSettings.industry || '',
    location: userSettings.location || '',
    foundedYear: userSettings.foundedYear || '',
    employeeCount: userSettings.employeeCount || '',
    website: userSettings.website || '',
  });
  
  const [formData, setFormData] = useState({
    cashBalance: financialData?.cashBalance || 0,
    monthlyBurn: financialData?.monthlyBurn || 0,
    monthlyRevenue: financialData?.monthlyRevenue || 0,
    runway: financialData?.runway || 0,
    currency: userSettings.currency as CurrencyCode,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...businessProfile }),
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
              <p className="text-sm text-zinc-400">Manage your account and business preferences</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "profile" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                <Building2 className="w-5 h-5" /> Business Profile
              </button>
              <button onClick={() => setActiveTab("financial")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "financial" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                <CreditCard className="w-5 h-5" /> Financial Data
              </button>
              <button onClick={() => setActiveTab("integrations")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "integrations" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                <Landmark className="w-5 h-5" /> Integrations
              </button>
              <button onClick={() => setActiveTab("security")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "security" ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}>
                <Shield className="w-5 h-5" /> Security
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* User Account Info */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" />
                    Account Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Name</label>
                      <input type="text" value={user.firstName} disabled className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white opacity-50" />
                      <p className="text-xs text-zinc-500 mt-1">Managed by Clerk authentication</p>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Email</label>
                      <input type="email" value={user.email} disabled className="w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white opacity-50" />
                      <p className="text-xs text-zinc-500 mt-1">Managed by Clerk authentication</p>
                    </div>
                  </div>
                </div>

                {/* Business Profile */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    Business Profile
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Business Name *</label>
                      <input 
                        type="text" 
                        value={businessProfile.businessName} 
                        onChange={(e) => setBusinessProfile({ ...businessProfile, businessName: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., Acme Inc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Business Type</label>
                      <select 
                        value={businessProfile.businessType} 
                        onChange={(e) => setBusinessProfile({ ...businessProfile, businessType: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Industry</label>
                      <select 
                        value={businessProfile.industry} 
                        onChange={(e) => setBusinessProfile({ ...businessProfile, industry: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Select industry</option>
                        {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Location (City, Country)</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={businessProfile.location} 
                          onChange={(e) => setBusinessProfile({ ...businessProfile, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                          placeholder="e.g., San Francisco, USA"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Founded Year</label>
                      <input 
                        type="number" 
                        value={businessProfile.foundedYear} 
                        onChange={(e) => setBusinessProfile({ ...businessProfile, foundedYear: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Employee Count</label>
                      <input 
                        type="number" 
                        value={businessProfile.employeeCount} 
                        onChange={(e) => setBusinessProfile({ ...businessProfile, employeeCount: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., 25"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-zinc-400 mb-2">Website</label>
                      <div className="relative">
                        <Globe className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="url" 
                          value={businessProfile.website} 
                          onChange={(e) => setBusinessProfile({ ...businessProfile, website: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                          placeholder="https://www.yourcompany.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSaving} 
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Business Profile'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    Currency
                  </h2>
                  <CurrencySelector value={formData.currency} onChange={(c) => setFormData({ ...formData, currency: c })} />
                </div>

                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    Financial Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Cash Balance</label>
                      <input type="number" value={formData.cashBalance} onChange={(e) => setFormData({ ...formData, cashBalance: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Monthly Burn</label>
                      <input type="number" value={formData.monthlyBurn} onChange={(e) => setFormData({ ...formData, monthlyBurn: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Monthly Revenue</label>
                      <input type="number" value={formData.monthlyRevenue} onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Runway (months)</label>
                      <input type="number" value={formData.runway} onChange={(e) => setFormData({ ...formData, runway: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl transition-colors">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Financial Data'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-6">
                {/* Banking */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Banking</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Chase', icon: '🏦', color: 'bg-green-500/10' },
                      { name: 'Bank of America', icon: '🏦', color: 'bg-red-500/10' },
                      { name: 'Wells Fargo', icon: '🏦', color: 'bg-yellow-500/10' },
                      { name: 'Other Banks', sub: '10,000+ supported', icon: '🏦', color: 'bg-blue-500/10' },
                    ].map((bank) => (
                      <div key={bank.name} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${bank.color} rounded-lg flex items-center justify-center text-xl`}>{bank.icon}</div>
                          <div>
                            <p className="text-sm font-medium text-white">{bank.name}</p>
                            {bank.sub && <p className="text-xs text-zinc-500">{bank.sub}</p>}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Platforms */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Payment Platforms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Stripe', sub: 'Card Payments', icon: '💳', color: 'bg-violet-500/10' },
                      { name: 'PayPal', sub: 'Business', icon: '💰', color: 'bg-blue-500/10' },
                      { name: 'Opay', sub: 'Mobile Money', icon: '💚', color: 'bg-green-500/10' },
                      { name: 'Flutterwave', sub: 'Africa Payments', icon: '💳', color: 'bg-orange-500/10' },
                    ].map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-xl`}>{platform.icon}</div>
                          <div>
                            <p className="text-sm font-medium text-white">{platform.name}</p>
                            <p className="text-xs text-zinc-500">{platform.sub}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crypto & Digital Wallets */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white mb-4">Crypto & Digital Wallets</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Coinbase', sub: 'Crypto', icon: '₿', color: 'bg-orange-500/10' },
                      { name: 'Wise', sub: 'Transfers', icon: '💎', color: 'bg-cyan-500/10' },
                      { name: 'Payoneer', sub: 'Global', icon: '📱', color: 'bg-red-500/10' },
                      { name: 'Remitly', sub: 'Remittances', icon: '⇄', color: 'bg-emerald-500/10' },
                    ].map((wallet) => (
                      <div key={wallet.name} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${wallet.color} rounded-lg flex items-center justify-center text-xl`}>{wallet.icon}</div>
                          <div>
                            <p className="text-sm font-medium text-white">{wallet.name}</p>
                            <p className="text-xs text-zinc-500">{wallet.sub}</p>
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
                      <h3 className="text-lg font-semibold text-white">Bank-Level Security</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Your financial data is encrypted and securely stored. We use Plaid for banking and OAuth for payment platforms. You control what data is shared.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
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
                          <p className="text-xs text-zinc-500">Use Google Authenticator or similar app</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Enable 2FA
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
                        <p className="text-xs text-zinc-500">Get email alerts for new sign-ins</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-emerald-500">
                        <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Session Timeout</p>
                        <p className="text-xs text-zinc-500">Auto-logout after inactivity</p>
                      </div>
                      <select className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm">
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                      </select>
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