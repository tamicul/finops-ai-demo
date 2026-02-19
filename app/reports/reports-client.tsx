"use client";

import { useState } from "react";
import { FileText, Download, Calendar, TrendingUp, PieChart, CreditCard, DollarSign, FileSpreadsheet, FileBarChart } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import Link from "next/link";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ReportsClientProps {
  currency: string;
  transactions: any[];
  financialData: any;
}

export default function ReportsClient({ currency, transactions, financialData }: ReportsClientProps) {
  const currencyCode = currency as CurrencyCode;
  const [generating, setGenerating] = useState<string | null>(null);

  const generateCSV = (type: string) => {
    setGenerating(type);
    
    let csvContent = "";
    let filename = "";
    
    switch (type) {
      case "transactions":
        csvContent = [
          ["Date", "Description", "Category", "Type", "Amount"].join(","),
          ...transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            `"${t.name}"`,
            t.category,
            t.type,
            t.amount
          ].join(","))
        ].join("\n");
        filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case "p&l":
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        csvContent = [
          ["Item", "Amount"].join(","),
          ["Total Income", income].join(","),
          ["Total Expenses", expenses].join(","),
          ["Net Profit/Loss", income - expenses].join(",")
        ].join("\n");
        filename = `pnl_statement_${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case "cashflow":
        const monthlyData = getMonthlyData(transactions);
        csvContent = [
          ["Month", "Income", "Expenses", "Net Cash Flow"].join(","),
          ...monthlyData.map(m => [m.month, m.income, m.expenses, m.net].join(","))
        ].join("\n");
        filename = `cashflow_${new Date().toISOString().split('T')[0]}.csv`;
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

  const generatePDF = async (type: string) => {
    setGenerating(type);
    
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text("FinOps AI Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Currency: ${currencyCode}`, 14, 38);
    
    switch (type) {
      case "full":
        // Financial Summary
        doc.setFontSize(16);
        doc.text("Financial Summary", 14, 50);
        doc.setFontSize(12);
        doc.text(`Cash Balance: ${formatCurrency(financialData?.cashBalance || 0, currencyCode)}`, 14, 60);
        doc.text(`Monthly Revenue: ${formatCurrency(financialData?.monthlyRevenue || 0, currencyCode)}`, 14, 68);
        doc.text(`Monthly Burn: ${formatCurrency(financialData?.monthlyBurn || 0, currencyCode)}`, 14, 76);
        doc.text(`Runway: ${financialData?.runway || 0} months`, 14, 84);
        
        // Recent Transactions
        doc.setFontSize(16);
        doc.text("Recent Transactions", 14, 100);
        (doc as any).autoTable({
          startY: 105,
          head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
          body: transactions.slice(0, 20).map(t => [
            new Date(t.date).toLocaleDateString(),
            t.name,
            t.category,
            t.type,
            formatCurrency(t.amount, currencyCode)
          ]),
        });
        break;
        
      case "expense":
        doc.setFontSize(16);
        doc.text("Expense Report", 14, 50);
        
        const expensesByCategory = getExpensesByCategory(transactions);
        (doc as any).autoTable({
          startY: 60,
          head: [['Category', 'Amount', 'Percentage']],
          body: expensesByCategory.map(cat => [
            cat.name,
            formatCurrency(cat.value, currencyCode),
            `${cat.percentage}%`
          ]),
        });
        break;
    }
    
    doc.save(`report_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
    setTimeout(() => setGenerating(null), 1000);
  };

  const getMonthlyData = (transactions: any[]) => {
    const months: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!months[month]) months[month] = { income: 0, expenses: 0 };
      if (t.type === 'income') months[month].income += t.amount;
      else months[month].expenses += t.amount;
    });
    
    return Object.entries(months).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }));
  };

  const getExpensesByCategory = (transactions: any[]) => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);
    const byCategory: { [key: string]: number } = {};
    
    expenses.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value, percentage: ((value / total) * 100).toFixed(1) }))
      .sort((a, b) => b.value - a.value);
  };

  const reportTypes = [
    { 
      id: "transactions", 
      name: "Transaction Report", 
      description: "Complete list of all transactions",
      icon: FileSpreadsheet,
      format: "CSV",
      action: () => generateCSV("transactions")
    },
    { 
      id: "pnl", 
      name: "P&L Statement", 
      description: "Profit and loss summary",
      icon: DollarSign,
      format: "CSV",
      action: () => generateCSV("p&l")
    },
    { 
      id: "cashflow", 
      name: "Cash Flow Report", 
      description: "Monthly cash flow analysis",
      icon: TrendingUp,
      format: "CSV",
      action: () => generateCSV("cashflow")
    },
    { 
      id: "full", 
      name: "Full Financial Report", 
      description: "Complete financial overview",
      icon: FileBarChart,
      format: "PDF",
      action: () => generatePDF("full")
    },
    { 
      id: "expense", 
      name: "Expense Breakdown", 
      description: "Expenses by category",
      icon: PieChart,
      format: "PDF",
      action: () => generatePDF("expense")
    },
  ];

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

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <report.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                  {report.format}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-1">{report.name}</h3>
              <p className="text-sm text-zinc-400 mb-4">{report.description}</p>
              
              <button
                onClick={report.action}
                disabled={generating === report.id}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                {generating === report.id ? 'Generating...' : 'Download'}
              </button>
            </div>
          ))}
        </div>

        {/* Scheduled Reports */}
        <div className="mt-8 bg-zinc-900/50 rounded-2xl border border-white/[0.06]">
          <div className="p-6 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white">Scheduled Reports</h2>
            <p className="text-sm text-zinc-400 mt-1">Set up automatic report generation</p>
          </div>
          
          <div className="divide-y divide-white/[0.06]">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Weekly Financial Summary</h3>
                  <p className="text-xs text-zinc-500">Every Monday at 9:00 AM</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                Active
              </span>
            </div>
            
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Monthly P&L Statement</h3>
                  <p className="text-xs text-zinc-500">1st of every month</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-lg transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}