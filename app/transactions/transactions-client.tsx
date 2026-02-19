"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit2, Trash2, Download, Link2, CreditCard, Building2, Wallet, Calendar, Receipt, Tag, FileText, MoreHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import Link from "next/link";

interface Transaction {
  id: string;
  name: string;
  description?: string;
  category: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
  vendor?: string;
  vendorType?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  status: string;
  tags: string[];
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
  { name: "Professional Services", icon: "⚖️" },
  { name: "Revenue", icon: "💰" },
  { name: "Investment", icon: "📈" },
  { name: "Other", icon: "📋" },
];

const vendorTypes = [
  { value: "supplier", label: "Supplier/Vendor" },
  { value: "customer", label: "Customer" },
  { value: "service_provider", label: "Service Provider" },
  { value: "employee", label: "Employee" },
  { value: "contractor", label: "Contractor" },
  { value: "investor", label: "Investor" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

const paymentMethods = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "wire_transfer", label: "Wire Transfer" },
  { value: "check", label: "Check" },
  { value: "cash", label: "Cash" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
  { value: "other", label: "Other" },
];

export default function TransactionsClient({ transactions, currency }: TransactionsClientProps) {
  const currencyCode = currency as CurrencyCode;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    amount: "",
    type: "expense" as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    vendor: "",
    vendorType: "",
    paymentMethod: "",
    referenceNumber: "",
    status: "completed",
    tags: [] as string[],
    tagInput: "",
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vendor && t.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesDate = (!dateRange.start || new Date(t.date) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(t.date) <= new Date(dateRange.end));
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date(formData.date),
      vendor: formData.vendor,
      vendorType: formData.vendorType,
      paymentMethod: formData.paymentMethod,
      referenceNumber: formData.referenceNumber,
      status: formData.status,
      tags: formData.tags,
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
      ['Date', 'Type', 'Name', 'Description', 'Vendor', 'Category', 'Payment Method', 'Reference', 'Amount', 'Status', 'Tags'].join(','),
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        `"${t.name}"`,
        `"${t.description || ''}"`,
        `"${t.vendor || ''}"`,
        t.category,
        t.paymentMethod || '',
        t.referenceNumber || '',
        t.amount,
        t.status,
        `"${(t.tags || []).join(', ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, formData.tagInput.trim()], tagInput: '' });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      name: transaction.name,
      description: transaction.description || '',
      category: transaction.category,
      amount: transaction.amount.toString(),
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split('T')[0],
      vendor: transaction.vendor || '',
      vendorType: transaction.vendorType || '',
      paymentMethod: transaction.paymentMethod || '',
      referenceNumber: transaction.referenceNumber || '',
      status: transaction.status,
      tags: transaction.tags || [],
      tagInput: '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Transactions</h1>
            <p className="text-sm text-zinc-400 mt-1">Track income and expenses with detailed records</p>
          </div>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to Overview</Link>
        </header>

        {/* Add Transaction Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-5 border border-emerald-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Add Transaction Manually</h3>
                <p className="text-sm text-zinc-400 mt-1">Enter income or expenses one by one with full details</p>
                <button
                  onClick={() => {
                    setEditingTransaction(null);
                    setFormData({
                      name: "", description: "", category: "", amount: "", type: "expense",
                      date: new Date().toISOString().split('T')[0], vendor: "", vendorType: "",
                      paymentMethod: "", referenceNumber: "", status: "completed", tags: [], tagInput: ""
                    });
                    setIsModalOpen(true);
                  }}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Manually
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl p-5 border border-blue-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Connect Bank Account</h3>
                <p className="text-sm text-zinc-400 mt-1">Automatically import transactions from your bank</p>
                <button
                  onClick={() => alert('Bank integration via Plaid coming soon!')}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  Connect Bank
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Accounts Status */}
        <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/[0.06] mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Connected Accounts
            </h3>
            <span className="text-xs text-zinc-500">Auto-sync enabled</span>
          </div>
          
          {/* Banking */}
          <div className="mb-4">
            <p className="text-xs text-zinc-500 uppercase mb-2">Banking</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-xl">🏦</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Chase</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-xl">🏦</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Bank of America</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-xl">🏦</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Wells Fargo</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl">🏦</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Other Banks</p>
                  <p className="text-xs text-zinc-500">10,000+ supported</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
            </div>
          </div>
          
          {/* Payment Platforms */}
          <div className="mb-4">
            <p className="text-xs text-zinc-500 uppercase mb-2">Payment Platforms</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-xl">💳</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Stripe</p>
                  <p className="text-xs text-zinc-500">Payments</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl">💰</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">PayPal</p>
                  <p className="text-xs text-zinc-500">Business</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-xl">💚</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Opay</p>
                  <p className="text-xs text-zinc-500">Mobile Money</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-xl">💳</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Flutterwave</p>
                  <p className="text-xs text-zinc-500">Africa Payments</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
            </div>
          </div>
          
          {/* Crypto & Other */}
          <div>
            <p className="text-xs text-zinc-500 uppercase mb-2">Crypto & Digital Wallets</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-xl">₿</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Coinbase</p>
                  <p className="text-xs text-zinc-500">Crypto</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xl">💎</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Wise</p>
                  <p className="text-xs text-zinc-500">Transfers</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-xl">📱</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Payoneer</p>
                  <p className="text-xs text-zinc-500">Global</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg opacity-50">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xl">⇄</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Remitly</p>
                  <p className="text-xs text-zinc-500">Remittances</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300">Connect</button>
              </div>
            </div>
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
            onClick={() => {
              setEditingTransaction(null);
              setFormData({
                name: "", description: "", category: "", amount: "", type: "expense",
                date: new Date().toISOString().split('T')[0], vendor: "", vendorType: "",
                paymentMethod: "", referenceNumber: "", status: "completed", tags: [], tagInput: ""
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
          
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2 flex-wrap">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm">
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>

            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm">
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
            </select>

            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions, vendors..."
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
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Vendor/Customer</th>
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
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{transaction.name}</p>
                    {transaction.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{transaction.description}</p>
                    )}
                    {transaction.referenceNumber && (
                      <p className="text-xs text-zinc-600 mt-0.5">Ref: {transaction.referenceNumber}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-300">
                    {transaction.vendor || '-'}
                    {transaction.vendorType && (
                      <p className="text-xs text-zinc-500 capitalize">{transaction.vendorType.replace('_', ' ')}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
                      {transaction.category}
                    </span>
                  </td>
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
                      <button onClick={() => openEditModal(transaction)} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-zinc-400" />
                      </button>
                      <button onClick={() => handleDelete(transaction.id)} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No transactions found. Add your first transaction to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-2xl border border-white/[0.06] my-8">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Transaction Type *</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}>
                      Income
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}>
                      Expense
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Description *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g., AWS Invoice" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Amount *</label>
                    <input type="number" required min="0" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="0.00" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Additional Details</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Additional notes about this transaction..." rows={2} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Vendor/Customer Name</label>
                    <input type="text" value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g., Amazon Web Services" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Vendor Type</label>
                    <select value={formData.vendorType} onChange={(e) => setFormData({ ...formData, vendorType: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select type</option>
                      {vendorTypes.map(vt => <option key={vt.value} value={vt.value}>{vt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Category *</label>
                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select category</option>
                      {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Date *</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Payment Method</label>
                    <select value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                      <option value="">Select method</option>
                      {paymentMethods.map(pm => <option key={pm.value} value={pm.value}>{pm.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Reference # (Invoice/Receipt)</label>
                    <input type="text" value={formData.referenceNumber} onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g., INV-2024-001" />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={formData.tagInput} onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Add a tag and press Enter" />
                    <button type="button" onClick={addTag} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-emerald-300">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
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