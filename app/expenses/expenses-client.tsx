"use client";

import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Search, Filter } from "lucide-react";
import { formatCurrency, formatCompactCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";

interface ExpensesClientProps {
  monthlyBurn: number;
  currency: string;
}

const expenseCategories = [
  { name: "Engineering", value: 18500, color: "#10b981" },
  { name: "Sales & Marketing", value: 12400, color: "#3b82f6" },
  { name: "Operations", value: 8900, color: "#8b5cf6" },
  { name: "Infrastructure", value: 7200, color: "#f59e0b" },
  { name: "Office & Admin", value: 4200, color: "#6366f1" },
  { name: "Travel", value: 2150, color: "#ec4899" },
];

const recentExpenses = [
  { id: 1, name: "AWS Services", category: "Infrastructure", amount: 12450, date: "Today", trend: "up" },
  { id: 2, name: "Salesforce", category: "Software", amount: 2400, date: "Yesterday", trend: "stable" },
  { id: 3, name: "Datadog", category: "Infrastructure", amount: 1850, date: "Yesterday", trend: "up" },
  { id: 4, name: "Google Ads", category: "Marketing", amount: 5200, date: "2 days ago", trend: "up" },
  { id: 5, name: "WeWork", category: "Office", amount: 4200, date: "3 days ago", trend: "stable" },
];

export default function ExpensesClient({ monthlyBurn, currency }: ExpensesClientProps) {
  const currencyCode = currency as CurrencyCode;
  const totalSpend = expenseCategories.reduce((acc, cat) => acc + cat.value, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Expenses</h1>
            <p className="text-sm text-zinc-400 mt-1">Track and categorize all business expenses</p>
          </div>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to Overview</Link>
        </header>

        {/* Monthly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06] mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Total Monthly Spend</p>
              <div className="flex items-baseline gap-3 mt-1">
                <p className="text-4xl font-bold text-white">{formatCurrency(totalSpend, currencyCode)}</p>
                <div className="flex items-center gap-1 text-red-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">12.4%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">Biggest Category</p>
              <p className="text-lg font-medium text-white mt-1">Engineering</p>
              <p className="text-sm text-emerald-400">38% of total</p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expense Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]"
          >
            <h2 className="text-lg font-semibold text-white mb-6">Expense Breakdown</h2>
            
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    formatter={(v: number) => formatCurrency(v, currencyCode)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {expenseCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-zinc-300">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-white">{formatCompactCurrency(cat.value, currencyCode)}</span>
                    <span className="text-xs text-zinc-500 ml-2">{((cat.value / totalSpend) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{expense.name}</p>
                      <p className="text-xs text-zinc-500">{expense.category} • {expense.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white">{formatCurrency(expense.amount, currencyCode)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}