"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  ChevronDown,
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
} from "recharts";

const anomalies = [
  {
    id: 1,
    title: "AWS Bill Spike",
    description: "Monthly spend increased 340% compared to average",
    vendor: "Amazon Web Services",
    currentAmount: 12450,
    expectedAmount: 2800,
    severity: "high",
    status: "open",
    detectedAt: "2 hours ago",
    category: "Infrastructure",
    impact: "Reduces runway by 2 months",
  },
  {
    id: 2,
    title: "Duplicate Zoom Licenses",
    description: "12 unused seats detected across organization",
    vendor: "Zoom",
    currentAmount: 840,
    expectedAmount: 360,
    severity: "medium",
    status: "open",
    detectedAt: "4 hours ago",
    category: "Software",
    impact: "Save $5,760/year",
  },
  {
    id: 3,
    title: "Marketing Spend Acceleration",
    description: "40% increase month-over-month, exceeding budget",
    vendor: "Google Ads",
    currentAmount: 8500,
    expectedAmount: 6000,
    severity: "medium",
    status: "investigating",
    detectedAt: "1 day ago",
    category: "Marketing",
    impact: "ROI declining",
  },
  {
    id: 4,
    title: "Unusual Travel Expense",
    description: "Individual expense $4,200 exceeds policy limit",
    vendor: "United Airlines",
    currentAmount: 4200,
    expectedAmount: 1500,
    severity: "low",
    status: "resolved",
    detectedAt: "2 days ago",
    category: "Travel",
    impact: "Policy violation",
  },
];

const stats = [
  { label: "Active Anomalies", value: 3, change: "+1", color: "red" },
  { label: "Potential Savings", value: "$18,210", change: "Monthly", color: "emerald" },
  { label: "AI Detections", value: 47, change: "This month", color: "blue" },
  { label: "Avg Response Time", value: "4.2 hrs", change: "-12%", color: "emerald" },
];

const severityTrendData = [
  { month: "Jan", high: 2, medium: 5, low: 8 },
  { month: "Feb", high: 3, medium: 4, low: 6 },
  { month: "Mar", high: 1, medium: 6, low: 10 },
  { month: "Apr", high: 4, medium: 3, low: 7 },
  { month: "May", high: 2, medium: 5, low: 9 },
  { month: "Jun", high: 3, medium: 4, low: 8 },
];

export default function AnomaliesPage() {
  return (
    <div className="p-8 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">Anomalies</h1>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
              3 Active
            </span>
          </div>
          <p className="text-neutral-400 mt-1">AI-detected spending irregularities and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#151822] text-neutral-300 rounded-lg hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <Brain className="w-4 h-4" />
            <span className="text-sm">Run Detection</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
          >
            <p className="text-sm text-neutral-400">{stat.label}</p>
            <p className="text-2xl font-semibold text-white mt-2">{stat.value}</p>
            <p className={cn("text-sm mt-1", 
              stat.color === "emerald" ? "text-emerald-400" :
              stat.color === "red" ? "text-red-400" : "text-blue-400"
            )}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomalies List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Detected Anomalies</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Auto-resolve:</span>
              <button className="w-10 h-5 bg-emerald-500 rounded-full relative">
                <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        anomaly.severity === "high" ? "bg-red-500/10" :
                        anomaly.severity === "medium" ? "bg-yellow-500/10" : "bg-blue-500/10"
                      )}
                    >
                      <AlertTriangle
                        className={cn(
                          "w-5 h-5",
                          anomaly.severity === "high" ? "text-red-400" :
                          anomaly.severity === "medium" ? "text-yellow-400" : "text-blue-400"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{anomaly.title}</h3>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full",
                            anomaly.severity === "high" ? "bg-red-500/20 text-red-400" :
                            anomaly.severity === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"
                          )}
                        >
                          {anomaly.severity}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full",
                            anomaly.status === "open" ? "bg-red-500/10 text-red-400" :
                            anomaly.status === "investigating" ? "bg-yellow-500/10 text-yellow-400" : "bg-emerald-500/10 text-emerald-400"
                          )}
                        >
                          {anomaly.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400 mb-2">{anomaly.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-neutral-500">{anomaly.vendor}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-neutral-500">{anomaly.category}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {anomaly.detectedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-400">
                      +${(anomaly.currentAmount - anomaly.expectedAmount).toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Expected: ${anomaly.expectedAmount.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors" title="Resolve">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors" title="Dismiss">
                        <XCircle className="w-4 h-4 text-neutral-500" />
                      </button>
                      <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                      </button>
                    </div>
                  </div>
                </div>
                {anomaly.impact && (
                  <div className="mt-4 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                    <p className="text-xs text-red-400">
                      <span className="font-medium">Impact:</span> {anomaly.impact}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Detection Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">AI Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Auto-detect</p>
                  <p className="text-xs text-neutral-500">Run hourly scans</p>
                </div>
                <button className="w-10 h-5 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Email alerts</p>
                  <p className="text-xs text-neutral-500">Notify on high severity</p>
                </div>
                <button className="w-10 h-5 bg-emerald-500 rounded-full relative">
                  <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Slack integration</p>
                  <p className="text-xs text-neutral-500">Post to #finance</p>
                </div>
                <button className="w-10 h-5 bg-neutral-600 rounded-full relative">
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Severity Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Detection Trend</h2>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#151822",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  />
                  <Bar dataKey="high" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="medium" stackId="a" fill="#eab308" />
                  <Bar dataKey="low" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-neutral-400">High</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-neutral-400">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-neutral-400">Low</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}