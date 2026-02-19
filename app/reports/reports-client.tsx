"use client";

import { useState } from "react";
import { FileText, Download, Calendar, TrendingUp, PieChart, CreditCard, DollarSign, FileSpreadsheet, FileBarChart, Lightbulb, AlertTriangle, CheckCircle, TrendingDown, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import Link from "next/link";

interface ReportsClientProps {
  currency: string;
  transactions: any[];
  financialData: any;
}

export default function ReportsClient({ currency, transactions, financialData }: ReportsClientProps) {
  const currencyCode = currency as CurrencyCode;
  const [generating, setGenerating] = useState<string | null>(null);

  // Calculate financial insights
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;
  const burnRate = financialData?.monthlyBurn || 0;
  const runway = financialData?.runway || 0;
  const cashBalance = financialData?.cashBalance || 0;
  
  // Calculate expense breakdown by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });
  
  const topExpenseCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  // AI Analysis
  const generateAIAnalysis = () => {
    const insights = [];
    
    // Runway analysis
    if (runway < 6) {
      insights.push({
        type: 'critical',
        title: 'Critical Runway Alert',
        message: `You only have ${runway} months of runway remaining. Consider immediate cost-cutting measures or fundraising.`,
        action: 'Review expenses immediately'
      });
    } else if (runway < 12) {
      insights.push({
        type: 'warning',
        title: 'Runway Warning',
        message: `With ${runway} months of runway, you should start planning your next funding round or revenue growth strategy.`,
        action: 'Create fundraising plan'
      });
    }
    
    // Cash flow analysis
    if (netCashFlow < 0) {
      const monthlyLoss = Math.abs(netCashFlow);
      insights.push({
        type: 'warning',
        title: 'Negative Cash Flow',
        message: `You're losing ${formatCurrency(monthlyLoss, currencyCode)} per month. At this rate, you'll exhaust your funding in ${runway} months.`,
        action: 'Reduce burn rate'
      });
    } else {
      insights.push({
        type: 'positive',
        title: 'Positive Cash Flow',
        message: `Great job! You're generating ${formatCurrency(netCashFlow, currencyCode)} in positive cash flow monthly.`,
        action: 'Reinvest in growth'
      });
    }
    
    // Expense analysis
    const totalExpensesAmount = Object.values(expensesByCategory).reduce((a, b) => (a as number) + (b as number), 0) as number;
    if (topExpenseCategories.length > 0) {
      const [topCategory, topAmount] = topExpenseCategories[0];
      const percentage = ((topAmount as number) / totalExpensesAmount * 100).toFixed(1);
      insights.push({
        type: 'info',
        title: 'Top Expense Category',
        message: `${topCategory} represents ${percentage}% of your total expenses (${formatCurrency(topAmount as number, currencyCode)}).`,
        action: 'Review spending'
      });
    }
    
    // Revenue recommendations
    if (financialData?.monthlyRevenue < burnRate) {
      insights.push({
        type: 'critical',
        title: 'Revenue vs Burn Gap',
        message: `Your monthly revenue (${formatCurrency(financialData?.monthlyRevenue || 0, currencyCode)}) is below your burn rate (${formatCurrency(burnRate, currencyCode)}).`,
        action: 'Increase revenue or cut costs'
      });
    }
    
    return insights;
  };

  const aiInsights = generateAIAnalysis();

  const generateCSV = (type: string) => {
    setGenerating(type);
    
    let csvContent = "";
    let filename = "";
    
    switch (type) {
      case "transactions":
        csvContent = [
          ["Date", "Description", "Category", "Type", "Amount", "Vendor", "Payment Method"].join(","),
          ...transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            `"${t.name}"`,
            t.category,
            t.type,
            t.amount,
            t.vendor || '',
            t.paymentMethod || ''
          ].join(","))
        ].join("\n");
        filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case "pnl":
        csvContent = [
          ["Item", "Amount"].join(","),
          ["Total Income", totalIncome].join(","),
          ["Total Expenses", totalExpenses].join(","),
          ["Net Profit/Loss", netCashFlow].join(",")
        ].join("\n");
        filename = `pnl_statement_${new Date().toISOString().split('T')[0]}.csv`;
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setTimeout(() => setGenerating(null), 1000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'positive': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'positive': return 'bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Financial Reports & Analysis</h1>
            <p className="text-sm text-zinc-400 mt-1">AI-powered insights and downloadable reports</p>
          </div>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to Overview</Link>
        </header>

        {/* AI Financial Health Dashboard */}
        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-6 border border-violet-500/20 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Financial Health Analysis</h2>
              <p className="text-sm text-zinc-400">Personalized insights based on your data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase">Cash Balance</p>
              <p className="text-xl font-semibold text-white mt-1">{formatCurrency(cashBalance, currencyCode)}</p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase">Monthly Burn</p>
              <p className="text-xl font-semibold text-red-400 mt-1">{formatCurrency(burnRate, currencyCode)}</p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase">Monthly Revenue</p>
              <p className="text-xl font-semibold text-emerald-400 mt-1">{formatCurrency(financialData?.monthlyRevenue || 0, currencyCode)}</p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase">Runway</p>
              <p className={`text-xl font-semibold mt-1 ${runway < 6 ? 'text-red-400' : runway < 12 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {runway} months
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                    <p className="text-sm text-zinc-300 mt-1">{insight.message}</p>
                    <button className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                      {insight.action} <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Expense Categories */}
        {topExpenseCategories.length > 0 && (
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06] mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Top Expense Categories
            </h2>
            <div className="space-y-3">
              {topExpenseCategories.map(([category, amount], index) => {
                const total = Object.values(expensesByCategory).reduce((a, b) => (a as number) + (b as number), 0) as number;
                const percentage = ((amount as number) / total * 100).toFixed(1);
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500">#{index + 1}</span>
                      <span className="text-white">{category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(amount as number, currencyCode)}</p>
                      <p className="text-xs text-zinc-500">{percentage}% of expenses</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Download Reports */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white mb-4">Download Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => generateCSV("transactions")}
              disabled={generating === "transactions"}
              className="p-4 bg-zinc-800/50 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all text-left"
            >
              <FileSpreadsheet className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-sm font-medium text-white">Transaction Report</h3>
              <p className="text-xs text-zinc-500 mt-1">Complete transaction history</p>
            </button>
            
            <button
              onClick={() => generateCSV("pnl")}
              disabled={generating === "pnl"}
              className="p-4 bg-zinc-800/50 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all text-left"
            >
              <DollarSign className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-sm font-medium text-white">P&L Statement</h3>
              <p className="text-xs text-zinc-500 mt-1">Profit and loss summary</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}