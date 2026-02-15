"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Zap,
  Building2,
  Cloud,
  Users,
  ShoppingBag,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const expenseCategories = [
  { name: "Engineering", value: 18500, color: "#10b981", icon: Zap, change: "+23%" },
  { name: "Sales & Marketing", value: 12400, color: "#3b82f6", icon: Users, change: "+8%" },
  { name: "Operations", value: 8900, color: "#8b5cf6", icon: Building2, change: "+5%" },
  { name: "Infrastructure", value: 7200, color: "#f59e0b", icon: Cloud, change: "+340%" },
  { name: "Office & Admin", value: 4200, color: "#6366f1", icon: ShoppingBag, change: "-2%" },
  { name: "Travel", value: 2150, color: "#ec4899", icon: Plane, change: "+12%" },
];

const subscriptions = [
  { id: 1, name: "AWS", category: "Infrastructure", cost: 12450, seats: null, trend: "up", alert: true },
  { id: 2, name: "Salesforce", category: "Sales", cost: 2400, seats: 12, trend: "stable", alert: false },
  { id: 3, name: "Datadog", category: "Infrastructure", cost: 1850, seats: null, trend: "up", alert: false },
  { id: 4, name: "GitHub", category: "Engineering", cost: 1200, seats: 25, trend: "stable", alert: false },
  { id: 5, name: "Slack", category: "Operations", cost: 800, seats: 45, trend: "stable", alert: false },
  { id: 6, name: "Notion", category: "Operations", cost: 400, seats: 30, trend: "stable", alert: true },
];

const recentExpenses = [
  { id: 1, merchant: "Amazon Web Services", category: "Infrastructure", amount: 12450, date: "Today", status: "pending" },
  { id: 2, merchant: "Salesforce", category: "Software", amount: 2400, date: "Yesterday", status: "completed" },
  { id: 3, merchant: "Datadog", category: "Infrastructure", amount: 1850, date: "Yesterday", status: "completed" },
  { id: 4, merchant: "Google Ads", category: "Marketing", amount: 5200, date: "2 days ago", status: "completed" },
  { id: 5, merchant: "WeWork", category: "Office", amount: 4200, date: "3 days ago", status: "completed" },
];

const totalMonthlySpend = expenseCategories.reduce((acc, cat) => acc + cat.value, 0);

export default function ExpensesPage() {
  return (
    <div className="p-8 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Expenses</h1>
          <p className="text-neutral-400 mt-1">Track spending by category and manage subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="pl-10 pr-4 py-2 bg-[#151822] border border-white/[0.06] rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/[0.15] w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#151822] text-neutral-300 rounded-lg hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06] mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400">Total Monthly Spend</p>
            <div className="flex items-baseline gap-3 mt-1">
              <p className="text-4xl font-bold text-white">${totalMonthlySpend.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-red-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-medium">12.4%</span>
              </div>
              <span className="text-sm text-neutral-500">vs last month</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-400">Biggest Category</p>
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
          className="lg:col-span-1 bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
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
                  contentStyle={{
                    backgroundColor: "#151822",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`$${value?.toLocaleString()}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {expenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-neutral-500">{((cat.value / totalMonthlySpend) * 100).toFixed(0)}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">${cat.value.toLocaleString()}</p>
                  <p className={cn("text-xs", cat.change.startsWith("+") ? "text-red-400" : "text-emerald-400")}>
                    {cat.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">SaaS Subscriptions</h2>
              <p className="text-sm text-neutral-400 mt-0.5">${subscriptions.reduce((acc, s) => acc + s.cost, 0).toLocaleString()}/month total</p>
            </div>
            <button className="text-sm text-emerald-400 hover:text-emerald-300">+ Add Subscription</button>
          </div>

          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    {sub.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{sub.name}</p>
                      {sub.alert && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-400 rounded-full">
                          Alert
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">{sub.category}{sub.seats && ` • ${sub.seats} seats`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">${sub.cost.toLocaleString()}/mo</p>
                    <p className="text-xs text-neutral-500">${(sub.cost * 12).toLocaleString()}/yr</p>
                  </div>
                  <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
          <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Merchant</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-white">{expense.merchant}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-xs bg-white/[0.06] text-neutral-400 rounded-md">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-400">{expense.date}</td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      expense.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                    )}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-medium text-white">${expense.amount.toLocaleString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}