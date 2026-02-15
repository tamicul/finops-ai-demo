import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Bell,
  PieChart,
  Settings,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Cash Flow", href: "/cashflow", icon: ArrowLeftRight },
  { name: "Expenses", href: "/expenses", icon: CreditCard },
  { name: "Anomalies", href: "/anomalies", icon: Bell },
  { name: "Reports", href: "/reports", icon: PieChart },
];

const secondaryNav = [
  { name: "Settings", href: "/settings", icon: Settings },
];

// FinOps AI Logo SVG
function FinOpsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 2L35.5 11V29L20 38L4.5 29V11L20 2Z" fill="url(#logo-gradient)" fillOpacity="0.15" stroke="url(#logo-gradient)" strokeWidth="2" />
      <path d="M14 14H26M14 14V26M14 20H22" stroke="url(#logo-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="26" r="3" fill="#10b981" />
      <defs>
        <linearGradient id="logo-gradient" x1="4.5" y1="2" x2="35.5" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f0f11] border-r border-white/[0.06] flex flex-col h-screen shrink-0">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10">
            <FinOpsLogo className="w-full h-full" />
          </div>
          <div>
            <h1 className="font-semibold text-white tracking-tight">FinOps AI</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Financial Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-zinc-800/80 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-zinc-500")} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <p className="px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
            System
          </p>
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-zinc-800/80 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Icon className="w-5 h-5 text-zinc-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Copyright Footer */}
      <div className="px-6 py-4 border-t border-white/[0.06]">
        <p className="text-[10px] text-zinc-600 text-center">
          © 2025 Tambo Consulting LLC
        </p>
        <p className="text-[9px] text-zinc-700 text-center mt-0.5">
          All rights reserved
        </p>
      </div>
    </aside>
  );
}