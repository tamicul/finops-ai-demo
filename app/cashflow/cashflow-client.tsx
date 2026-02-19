"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight, TrendingDown, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CashFlowClientProps {
  financialData: {
    cashBalance: number;
    monthlyBurn: number;
    monthlyRevenue: number;
    runway: number;
  } | null;
  currency: string;
}

const monthlyData = [
  { month: "Jan", income: 45000, expenses: 38000, net: 7000 },
  { month: "Feb", income: 52000, expenses: 41000, net: 11000 },
  { month: "Mar", income: 48000, expenses: 39500, net: 8500 },
  { month: "Apr", income: 61000, expenses: 42000, net: 19000 },
  { month: "May", income: 67800, expenses: 42350, net: 25450 },
  { month: "Jun", income: 72000, expenses: 45000, net: 27000 },
];

export default function CashFlowClient({ financialData, currency }: CashFlowClientProps) {
  const currencyCode = currency as CurrencyCode;
  const burnRate = financialData?.monthlyBurn || 42350;
  const revenue = financialData?.monthlyRevenue || 67800;
  const runway = financialData?.runway || 20;
  
  const stats = [
    { label: "Avg Monthly Income", value: revenue, change: "+15.2%", positive: true },
    { label: "Avg Monthly Expenses", value: burnRate, change: "+8.4%", positive: false },
    { label: "Net Cash Flow", value: revenue - burnRate, change: "+42.1%", positive: true },
    { label: "Cash Runway", value: `${runway} months`, change: "Stable", positive: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Cash Flow</h1>
            <p className="text-sm text-zinc-400 mt-1">Track income, expenses, and runway projections</p>
          </div>
          <Link 
            href="/"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            ← Back to Overview
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-900/50 rounded-2xl p-5 border border-white/[0.06]"
            >
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-semibold text-white mt-1">
                {typeof stat.value === 'number' ? formatCurrency(stat.value, currencyCode) : stat.value}
              </p>
              <p className={cn("text-sm mt-1", stat.positive ? "text-emerald-400" : "text-red-400")}>
                {stat.change}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Income vs Expenses</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    formatter={(v: number) => [formatCurrency(v, currencyCode), '']}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Net Cash Flow</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    formatter={(v: number) => [formatCurrency(v, currencyCode), '']}
                  />
                  <Area type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Runway Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cash Runway: {runway} months</h3>
              <p className="text-sm text-zinc-400 mt-1">
                At current burn rate, you have {runway} months of runway remaining.
                {runway < 12 && " Consider reducing expenses or increasing revenue."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}