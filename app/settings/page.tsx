"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Database,
  Mail,
  Slack,
  Github,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const integrations = [
  { id: 1, name: "Stripe", category: "Payments", status: "connected", icon: "💳" },
  { id: 2, name: "Plaid", category: "Banking", status: "connected", icon: "🏦" },
  { id: 3, name: "QuickBooks", category: "Accounting", status: "disconnected", icon: "📊" },
  { id: 4, name: "Slack", category: "Notifications", status: "connected", icon: "💬" },
  { id: 5, name: "GitHub", category: "Development", status: "disconnected", icon: "🐙" },
];

const notifications = [
  { id: 1, name: "Spending Alerts", email: true, slack: true, push: false },
  { id: 2, name: "Anomaly Detection", email: true, slack: true, push: true },
  { id: 3, name: "Weekly Summary", email: true, slack: false, push: false },
  { id: 4, name: "Monthly Reports", email: true, slack: true, push: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "integrations", name: "Integrations", icon: Database },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <div className="p-8 max-w-[1600px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-neutral-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#151822] rounded-2xl p-2 border border-white/[0.06]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white/[0.08] text-white"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-emerald-400" : "text-neutral-500")} />
                <span>{tab.name}</span>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile */}
              <div className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white mb-6">Profile</h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                    TB
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">Tambo Boss</p>
                    <p className="text-sm text-neutral-400">admin@company.com</p>
                    <p className="text-xs text-emerald-400 mt-1">Pro Plan</p>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm rounded-lg transition-colors">
                    Change Avatar
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Company Name</label>
                    <input
                      type="text"
                      defaultValue="Acme Inc"
                      className="w-full px-4 py-2 bg-[#0B0E14] border border-white/[0.06] rounded-lg text-white text-sm focus:outline-none focus:border-white/[0.15]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Timezone</label>
                    <select className="w-full px-4 py-2 bg-[#0B0E14] border border-white/[0.06] rounded-lg text-white text-sm focus:outline-none focus:border-white/[0.15]">
                      <option>America/New_York (EST)</option>
                      <option>America/Los_Angeles (PST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white mb-6">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                    <div>
                      <p className="text-sm text-white">Currency</p>
                      <p className="text-xs text-neutral-500">Display all amounts in USD</p>
                    </div>
                    <select className="px-3 py-1.5 bg-[#0B0E14] border border-white/[0.06] rounded-lg text-white text-sm">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                    <div>
                      <p className="text-sm text-white">Fiscal Year Start</p>
                      <p className="text-xs text-neutral-500">January 1st</p>
                    </div>
                    <button className="text-sm text-emerald-400">Change</button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-white">Data Export</p>
                      <p className="text-xs text-neutral-500">Export all your data</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm rounded-lg transition-colors">
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between py-4 border-b border-white/[0.06] last:border-0">
                    <div>
                      <p className="text-sm text-white">{notif.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.email} className="rounded bg-[#0B0E14] border-white/[0.06] text-emerald-500 focus:ring-emerald-500" />
                        <Mail className="w-4 h-4 text-neutral-500" />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.slack} className="rounded bg-[#0B0E14] border-white/[0.06] text-emerald-500 focus:ring-emerald-500" />
                        <Slack className="w-4 h-4 text-neutral-500" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "integrations" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-2xl">
                      {integration.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{integration.name}</p>
                      <p className="text-xs text-neutral-500">{integration.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                        integration.status === "connected"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-neutral-500/10 text-neutral-400"
                      )}
                    >
                      {integration.status === "connected" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {integration.status === "connected" ? "Connected" : "Disconnected"}
                    </span>
                    <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-[#151822] rounded-2xl p-6 border border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white mb-6">Security</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                    <div>
                      <p className="text-sm text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-neutral-500">Add an extra layer of security</p>
                    </div>
                    <button className="w-10 h-5 bg-emerald-500 rounded-full relative">
                      <span className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                    <div>
                      <p className="text-sm text-white">Change Password</p>
                      <p className="text-xs text-neutral-500">Last changed 2 weeks ago</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm rounded-lg transition-colors">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-white">API Keys</p>
                      <p className="text-xs text-neutral-500">Manage API access tokens</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm rounded-lg transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}