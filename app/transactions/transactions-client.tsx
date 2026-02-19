"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Download, Link2, CreditCard, Building2, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import Link from "next/link";

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
}

interface TransactionsClientProps {
  transactions: Transaction[];
  currency: string;
}

const categories = [
  { name: "Engineering", icon: "💻" },
  { name: "Sales & Marketing", icon: "📢" },
  { name: "Operations", icon: "⚙️" },
  { name: "Infrastructure", icon: "☁️" },
  { name: "Office & Admin", icon: "🏢" },
  { name: "Travel", icon: "✈️" },
  { name: "Revenue", icon: "💰" },
  { name: "Investment", icon: "📈" },
];

export default function TransactionsClient({ transactions, currency }: TransactionsClientProps) {
  const currencyCode = currency as CurrencyCode;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    type: "expense" as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date(formData.date),
    };

    try {
      const response = await fetch('/api/transactions', {
        method: editingTransaction ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTransaction ? { ...data, id: editingTransaction.id } : data),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to save transaction');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const response = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Name', 'Category', 'Type', 'Amount'].join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        `"${t.name}"`,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Transactions</h1>
            <p className="text-sm text-zinc-400 mt-1">Manage income and expenses</p>
          </div>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to Overview</Link>
        </header>

        {/* Bank Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Bank Accounts</p>
                <p className="text-xs text-zinc-500">Connect via Plaid</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors">
              Connect
            </button>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Stripe</p>
                <p className="text-xs text-zinc-500">Payment processing</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition-colors">
              Connect
            </button>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">PayPal</p>
                <p className="text-xs text-zinc-500">PayPal Business</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
              Connect
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/[0.06]">
            <p className="text-sm text-zinc-400">Total Income</p>
            <p className="text-2xl font-semibold text-emerald-400 mt-1">{formatCurrency(totalIncome, currencyCode)}</p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/[0.06]">
            <p className="text-sm text-zinc-400">Total Expenses</p>
            <p className="text-2xl font-semibold text-red-400 mt-1">{formatCurrency(totalExpenses, currencyCode)}</p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/[0.06]">
            <p className="text-sm text-zinc-400">Net Cash Flow</p>
            <p className={`text-2xl font-semibold mt-1 ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(netCashFlow, currencyCode)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm w-64"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-zinc-900/50 rounded-2xl border border-white/[0.06] overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800/50 border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Type</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-zinc-400">Amount</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{transaction.name}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{transaction.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-medium ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currencyCode)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setFormData({
                            name: transaction.name,
                            category: transaction.category,
                            amount: transaction.amount.toString(),
                            type: transaction.type,
                            date: new Date(transaction.date).toISOString().split('T')[0],
                          });
                          setIsAddModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-zinc-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No transactions found. Add your first transaction to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-white/[0.06]">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.type === 'income'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.type === 'expense'
                          ? 'bg-red-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Description</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., AWS Invoice"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Amount</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingTransaction(null);
                      setFormData({ name: "", category: "", amount: "", type: "expense", date: new Date().toISOString().split('T')[0] });
                    }}
                    className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    {editingTransaction ? 'Save Changes' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}