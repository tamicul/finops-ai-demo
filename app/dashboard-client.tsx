"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Settings,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CurrencySelector } from "@/components/currency-selector";
import { CurrencyCode } from "@/lib/currency/config";
import { formatCurrency } from "@/lib/currency/converter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cashFlowData = [
  { month: "Jan", actual: 920000, projected: null },
  { month: "Feb", actual: 895000, projected: null },
  { month: "Mar", actual: 870000, projected: null },
  { month: "Apr", actual: 854000, projected: null },
  { month: "May", actual: 847290, projected: null },
  { month: "Jun", actual: null, projected: 780000 },
  { month: "Jul", actual: null, projected: 720000 },
  { month: "Aug", actual: null, projected: 660000 },
];

interface DashboardClientProps {
  user: {
    firstName: string;
    email?: string;
  };
  currency: CurrencyCode;
  financialData: {
    cashBalance: number;
    monthlyBurn: number;
    monthlyRevenue: number;
    runway: number;
    exchangeRate: number;
  };
}

export default function DashboardClient({ user, currency, financialData }: DashboardClientProps) {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(currency);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-report.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export report');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleCurrencyChange = async (newCurrency: CurrencyCode) => {
    if (newCurrency === currentCurrency) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCurrency }),
      });
      
      if (response.ok) {
        setCurrentCurrency(newCurrency);
        window.location.reload(); // Reload to get converted amounts
      } else {
        alert('Failed to save currency preference');
      }
    } catch (error) {
      console.error('Error saving currency:', error);
      alert('Failed to save currency preference');
    } finally {
      setIsSaving(false);
    }
  };
  
  const stats = [
    {
      title: "Total Balance",
      value: financialData.cashBalance,
      change: "+8.2%",
      changeType: "positive",
      icon: Wallet,
    },
    {
      title: "Monthly Burn",
      value: financialData.monthlyBurn,
      change: "+12.4%",
      changeType: "negative",
      icon: TrendingDown,
    },
    {
      title: "Cash Runway",
      value: `${financialData.runway} months`,
      change: "-2 months",
      changeType: "neutral",
      icon: Calendar,
    },
    {
      title: "Monthly Revenue",
      value: financialData.monthlyRevenue,
      change: "+12.5%",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Welcome back, {user.firstName}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Here&apos;s your financial summary</p>
          </div>
          
          <div className="flex items-center gap-4">
            <CurrencySelector 
              value={currentCurrency} 
              onChange={handleCurrencyChange}
              disabled={isSaving}
            />
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 bg-zinc-900/80 text-zinc-300 rounded-xl border border-white/[0.06]",
                isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800/80 transition-all"
              )}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
            <Link 
              href="/settings"
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/80 text-zinc-300 rounded-xl border border-white/[0.06] hover:bg-zinc-800/80 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-zinc-900/50 rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-white tracking-tight">
                    {typeof stat.value === 'number' 
                      ? formatCurrency(stat.value, currentCurrency)
                      : stat.value
                    }
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : stat.changeType === "negative" ? (
                      <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-yellow-400" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        stat.changeType === "positive" && "text-emerald-400",
                        stat.changeType === "negative" && "text-red-400",
                        stat.changeType === "neutral" && "text-yellow-400"
                      )}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    stat.changeType === "positive" && "bg-emerald-500/10",
                    stat.changeType === "negative" && "bg-red-500/10",
                    stat.changeType === "neutral" && "bg-yellow-500/10"
                  )}
                >
                  <stat.icon
                    className={cn(
                      "w-5 h-5",
                      stat.changeType === "positive" && "text-emerald-400",
                      stat.changeType === "negative" && "text-red-400",
                      stat.changeType === "neutral" && "text-yellow-400"
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cash Flow Chart */}
        <div
          className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Cash Flow Forecast</h2>
              <p className="text-sm text-zinc-400 mt-0.5">Projected runway based on current burn</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-zinc-400">Projected</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value ? `$${value / 1000}k` : ''} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => value ? [formatCurrency(value, currentCurrency), ''] : ['—', '']}
                />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="projected" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4" fillOpacity={1} fill="url(#colorProjected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}