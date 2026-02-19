"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { CurrencySelector } from "@/components/currency-selector";
import { CurrencyCode } from "@/lib/currency/config";

interface SettingsClientProps {
  user: {
    firstName: string;
    email?: string;
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
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
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
        router.push('/');
        router.refresh();
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
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[800px] mx-auto">
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
              <p className="text-sm text-zinc-400">Manage your financial data</p>
            </div>
          </div>
        </header>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Currency */}
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">Currency</h2>
            <CurrencySelector 
              value={formData.currency}
              onChange={(newCurrency) => setFormData({ ...formData, currency: newCurrency })}
            />
          </div>
          
          {/* Financial Data */}
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white mb-4">Financial Data</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Cash Balance</label>
                <input
                  type="number"
                  value={formData.cashBalance}
                  onChange={(e) => setFormData({ ...formData, cashBalance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter cash balance"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Monthly Burn</label>
                <input
                  type="number"
                  value={formData.monthlyBurn}
                  onChange={(e) => setFormData({ ...formData, monthlyBurn: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter monthly burn"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Monthly Revenue</label>
                <input
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter monthly revenue"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Runway (months)</label>
                <input
                  type="number"
                  value={formData.runway}
                  onChange={(e) => setFormData({ ...formData, runway: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter runway in months"
                />
              </div>
            </div>
          </div>
          
          {/* Save Button */}
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
      </div>
    </div>
  );
}