"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  FileText,
  Download,
  Share2,
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reports = [
  {
    id: 1,
    name: "Monthly Financial Summary",
    description: "Complete overview of income, expenses, and runway",
    lastGenerated: "2 days ago",
    schedule: "Monthly",
    status: "ready",
    recipients: ["finance@company.com"],
  },
  {
    id: 2,
    name: "Burn Rate Analysis",
    description: "Detailed burn rate trends and projections",
    lastGenerated: "1 week ago",
    schedule: "Weekly",
    status: "ready",
    recipients: ["ceo@company.com", "cfo@company.com"],
  },
  {
    id: 3,
    name: "Expense Categories Report",
    description: "Breakdown by department and category",
    lastGenerated: "3 days ago",
    schedule: "Monthly",
    status: "generating",
    recipients: ["ops@company.com"],
  },
  {
    id: 4,
    name: "SaaS Spend Audit",
    description: "Subscription costs and optimization opportunities",
    lastGenerated: "2 weeks ago",
    schedule: "Quarterly",
    status: "ready",
    recipients: ["finance@company.com"],
  },
  {
    id: 5,
    name: "Investor Update",
    description: "Key metrics and runway for investor reporting",
    lastGenerated: "1 month ago",
    schedule: "Monthly",
    status: "scheduled",
    recipients: ["investors@company.com"],
  },
];

const templates = [
  { id: 1, name: "P&L Statement", icon: FileText, description: "Profit and loss summary" },
  { id: 2, name: "Cash Flow Statement", icon: TrendingUp, description: "Inflows and outflows" },
  { id: 3, name: "Department Breakdown", icon: Building2, description: "Spend by team" },
  { id: 4, name: "Runway Analysis", icon: Clock, description: "Cash projections" },
];

export default function ReportsPage() {
  return (
    <div className="p-8 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reports</h1>
          <p className="text-neutral-400 mt-1">Generate and schedule financial reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
          <FileText className="w-4 h-4" />
          <span className="text-sm">Create Report</span>
        </button>
      </div>

      {/* Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              className="p-5 bg-[#151822] rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <template.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium text-white">{template.name}</h3>
              <p className="text-xs text-neutral-500 mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Scheduled Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#151822] rounded-2xl border border-white/[0.06]"
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
                    <FileText className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{report.name}</h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-medium rounded-full",
                          report.status === "ready" && "bg-emerald-500/10 text-emerald-400",
                          report.status === "generating" && "bg-yellow-500/10 text-yellow-400",
                          report.status === "scheduled" && "bg-blue-500/10 text-blue-400"
                        )}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{report.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.schedule}
                      </span>
                      <span className="text-neutral-500">Last: {report.lastGenerated}</span>
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {report.recipients.length} recipients
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors" title="Download">
                    <Download className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors" title="Share">
                    <Share2 className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-6 border border-violet-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Automate Your Reporting</h3>
            <p className="text-sm text-neutral-400 mt-1">
              Set up scheduled reports to automatically generate and send to stakeholders.
            </p>
          </div>
          <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors">
            Set Up Automation
          </button>
        </div>
      </motion.div>
    </div>
  );
}