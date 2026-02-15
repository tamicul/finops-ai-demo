"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

const cashFlowData = [
  { month: "Jan", income: 45000, expenses: 38000, net: 7000 },
  { month: "Feb", income: 52000, expenses: 41000, net: 11000 },
  { month: "Mar", income: 48000, expenses: 39500, net: 8500 },
  { month: "Apr", income: 61000, expenses: 42000, net: 19000 },
  { month: "May", income: 67800, expenses: 42350, net: 25450 },
  { month: "Jun", income: 72000, expenses: 45000, net: 27000 },
];

const runwayData = [
  { month: "Current", balance: 847290 },
  { month: "Month 6", balance: 720000 },
  { month: "Month 12", balance: 590000 },
  { month: "Month 18", balance: 460000 },
  { month: "Month 20", balance: 380000 },
];

const metrics = [
  { label: "Avg Monthly Income", value: "$58,400", change: "+15.2%", positive: true },
  { label: "Avg Monthly Expenses", value: "$40,600", change: "+8.4%", positive: false },
  { label: "Net Cash Flow", value: "$17,800", change: "+42.1%", positive: true },
  { label: "Burn Multiple", value: "0.73x", change: "-12.3%", positive: true },
];

export default function CashFlowPage() {
  const [view, setView] = useState("overview");

  return (
    <div className="p-8 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Cash Flow</h1>
          <p className="text-neutral-400 mt-1">Track income, expenses, and runway projections</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#151822] text-neutral-300 rounded-lg hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Report</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {["overview", "income", "expenses", "runway"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize",
              view === v
                ? "bg-white/[0.08] text-white"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
          >
            <p className="text-sm text-neutral-400">{metric.label}</p>
            <p className="text-2xl font-semibold text-white mt-2">{metric.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {metric.positive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
              <span className={cn("text-sm font-medium", metric.positive ? "text-emerald-400" : "text-red-400")}>
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Income vs Expenses</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Monthly comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-neutral-400">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-neutral-400">Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} dx={-10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151822",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`$${value?.toLocaleString()}`, ""]}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Net Cash Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Net Cash Flow</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Income minus expenses</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-emerald-400">+$17,800</p>
              <p className="text-xs text-neutral-500">Avg per month</p>
            </div>
          </div>
          
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} dx={-10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151822",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`$${value?.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Runway Projection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Runway Projection</h2>
              <p className="text-sm text-neutral-400 mt-0.5">Cash balance forecast at current burn rate</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-lg">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">20 months runway</span>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={runwayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRunway" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} dx={-10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151822",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`$${value?.toLocaleString()}`, "Balance"]}
                />
                <Area type="monotone" dataKey="balance" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorRunway)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}