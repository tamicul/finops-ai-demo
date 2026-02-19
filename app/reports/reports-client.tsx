"use client";

import { motion } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp, PieChart, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import Link from "next/link";

interface ReportsClientProps {
  currency: string;
}

const reports = [
  { id: 1, name: "Monthly Financial Summary", description: "Complete overview of income, expenses, and runway", lastGenerated: "2 days ago", schedule: "Monthly" },
  { id: 2, name: "Burn Rate Analysis", description: "Detailed burn rate trends and projections", lastGenerated: "1 week ago", schedule: "Weekly" },
  { id: 3, name: "Expense Categories Report", description: "Breakdown by department and category", lastGenerated: "3 days ago", schedule: "Monthly" },
  { id: 4, name: "Cash Flow Statement", description: "Inflows and outflows analysis", lastGenerated: "5 days ago", schedule: "Weekly" },
];

const templates = [
  { name: "P&L Statement", icon: FileText, description: "Profit and loss summary" },
  { name: "Cash Flow", icon: TrendingUp, description: "Cash movement analysis" },
  { name: "Expense Report", icon: CreditCard, description: "Spending breakdown" },
  { name: "Budget vs Actual", icon: PieChart, description: "Variance analysis" },
];

export default function ReportsClient({ currency }: ReportsClientProps) {
  const currencyCode = currency as CurrencyCode;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Reports</h1>
            <p className="text-sm text-zinc-400 mt-1">Generate and download financial reports</p>
          </div>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to Overview</Link>
        </header>

        {/* Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Quick Generate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <button
                key={template.name}
                className="p-5 bg-zinc-900/50 rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <template.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-white">{template.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 rounded-2xl border border-white/[0.06]"
        >
          <div className="p-6 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white">Scheduled Reports</h2>
          </div>
          
          <div className="divide-y divide-white/[0.06]">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{report.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{report.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {report.schedule}
                        </span>
                        <span>Last: {report.lastGenerated}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors" title="Download">
                    <Download className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-6 border border-violet-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-violet-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Automate Your Reporting</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Set up scheduled reports to automatically generate and send to stakeholders.
              </p>
            </div>
            <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors">
              Set Up
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}