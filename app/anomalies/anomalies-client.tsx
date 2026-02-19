"use client";


import { AlertTriangle, CheckCircle, Sparkles, TrendingUp, TrendingDown, AlertCircle, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import Link from "next/link";

interface AnomaliesClientProps {
  currency: string;
}

const anomalies = [
  {
    id: 1,
    title: "AWS Bill Spike",
    description: "Monthly spend increased 340% compared to average",
    severity: "high",
    status: "open",
    amount: 12450,
    impact: "Reduces runway by 2 months",
    detectedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Duplicate Zoom Licenses",
    description: "12 unused seats detected across organization",
    severity: "medium",
    status: "open",
    amount: 480,
    impact: "Save $5,760/year",
    detectedAt: "4 hours ago",
  },
  {
    id: 3,
    title: "Marketing Spend Acceleration",
    description: "40% increase month-over-month, exceeding budget",
    severity: "medium",
    status: "investigating",
    amount: 8500,
    impact: "ROI declining",
    detectedAt: "1 day ago",
  },
];

const stats = [
  { label: "Active Anomalies", value: 3, change: "+1", color: "red" },
  { label: "Potential Savings", value: "$6,240", change: "Monthly", color: "emerald" },
  { label: "AI Detections", value: 47, change: "This month", color: "blue" },
  { label: "Resolved", value: 12, change: "This week", color: "emerald" },
];

export default function AnomaliesClient({ currency }: AnomaliesClientProps) {
  const currencyCode = currency as CurrencyCode;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Anomalies</h1>
            <p className="text-sm text-zinc-400 mt-1">AI-detected spending irregularities and alerts</p>
          </div>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to Overview</Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              
              
              
              className="bg-zinc-900/50 rounded-2xl p-5 border border-white/[0.06]"
            >
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
              <p className={stat.color === "emerald" ? "text-emerald-400 text-sm mt-1" : stat.color === "red" ? "text-red-400 text-sm mt-1" : "text-blue-400 text-sm mt-1"}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Anomalies List */}
        <div
          
          
          
          className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Detected Anomalies</h2>
          </div>

          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className="p-5 rounded-xl bg-zinc-800/50 border border-white/[0.04] hover:border-white/[0.08] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      anomaly.severity === "high" ? "bg-red-500/10" : "bg-yellow-500/10"
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        anomaly.severity === "high" ? "text-red-400" : "text-yellow-400"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{anomaly.title}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                          anomaly.severity === "high" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {anomaly.severity}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                          anomaly.status === "open" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {anomaly.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{anomaly.description}</p>
                      <p className="text-xs text-zinc-500 mt-2">{anomaly.detectedAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-400">{formatCurrency(anomaly.amount, currencyCode)}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <p className="text-xs text-red-400">
                    <span className="font-medium">Impact:</span> {anomaly.impact}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">
                    Review
                  </button>
                  <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}