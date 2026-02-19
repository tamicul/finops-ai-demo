"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Sparkles, TrendingUp, TrendingDown, AlertCircle, Zap, Search, Filter, Eye, Check, X, ArrowRight, Lightbulb, DollarSign, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/currency/converter";
import { CurrencyCode } from "@/lib/currency/config";
import Link from "next/link";

interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  category: string;
  amount?: number;
  currency?: string;
  potentialSavings?: number;
  aiConfidence?: number;
  aiRecommendation?: string;
  detectedAt: Date;
  resolvedAt?: Date;
}

interface AnomaliesClientProps {
  anomalies: Anomaly[];
  currency: string;
}

export default function AnomaliesClient({ anomalies, currency }: AnomaliesClientProps) {
  const currencyCode = currency as CurrencyCode;
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  const filteredAnomalies = anomalies.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
    return matchesStatus && matchesSeverity;
  });
  
  const stats = {
    open: anomalies.filter(a => a.status === 'open').length,
    investigating: anomalies.filter(a => a.status === 'investigating').length,
    resolved: anomalies.filter(a => a.status === 'resolved').length,
    potentialSavings: anomalies.reduce((sum, a) => sum + (a.potentialSavings || 0), 0),
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/anomalies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to update anomaly');
      }
    } catch (error) {
      console.error('Error updating anomaly:', error);
      alert('Failed to update anomaly');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/10 text-red-400';
      case 'investigating': return 'bg-yellow-500/10 text-yellow-400';
      case 'resolved': return 'bg-emerald-500/10 text-emerald-400';
      case 'dismissed': return 'bg-zinc-500/10 text-zinc-400';
      default: return 'bg-zinc-500/10 text-zinc-400';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      spending_spike: 'Spending Spike',
      duplicate: 'Duplicate',
      unusual_pattern: 'Unusual Pattern',
      subscription: 'Subscription',
      anomaly: 'Anomaly',
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">AI Anomaly Detection</h1>
            <p className="text-sm text-zinc-400 mt-1">Intelligent monitoring of your financial health</p>
          </div>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to Overview</Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Open Issues</p>
                <p className="text-2xl font-semibold text-white">{stats.open}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Investigating</p>
                <p className="text-2xl font-semibold text-white">{stats.investigating}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Resolved</p>
                <p className="text-2xl font-semibold text-white">{stats.resolved}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Potential Savings</p>
                <p className="text-2xl font-semibold text-emerald-400">{formatCurrency(stats.potentialSavings, currencyCode)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="space-y-4">
          {filteredAnomalies.map((anomaly) => (
            <div 
              key={anomaly.id} 
              onClick={() => setSelectedAnomaly(anomaly)}
              className="bg-zinc-900/50 rounded-2xl p-6 border border-white/[0.06] hover:border-white/[0.1] cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSeverityColor(anomaly.severity)}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{anomaly.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(anomaly.status)}`}>
                        {anomaly.status}
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                        {getCategoryLabel(anomaly.category)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{anomaly.description}</p>
                    
                    {anomaly.aiConfidence && (
                      <div className="flex items-center gap-2 mt-3">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-xs text-violet-400">AI Confidence: {(anomaly.aiConfidence * 100).toFixed(0)}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-6 mt-4 text-sm">
                      {anomaly.amount && (
                        <span className="text-red-400 font-medium">
                          Amount: {formatCurrency(anomaly.amount, currencyCode)}
                        </span>
                      )}
                      {anomaly.potentialSavings && (
                        <span className="text-emerald-400 font-medium">
                          Potential Savings: {formatCurrency(anomaly.potentialSavings, currencyCode)}
                        </span>
                      )}
                      <span className="text-zinc-500">
                        Detected: {new Date(anomaly.detectedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedAnomaly(anomaly); }}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredAnomalies.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-white/[0.06]">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">No anomalies found</h3>
              <p className="text-sm text-zinc-400 mt-1">Your finances look healthy!</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedAnomaly && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-2xl border border-white/[0.06] max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSeverityColor(selectedAnomaly.severity)}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedAnomaly.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedAnomaly.status)}`}>
                        {selectedAnomaly.status}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(selectedAnomaly.detectedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedAnomaly(null)} className="p-2 hover:bg-zinc-800 rounded-lg">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">Description</h3>
                  <p className="text-white">{selectedAnomaly.description}</p>
                </div>

                {selectedAnomaly.aiRecommendation && (
                  <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-violet-400" />
                      <h3 className="text-sm font-semibold text-violet-400">AI Recommendation</h3>
                    </div>
                    <p className="text-white">{selectedAnomaly.aiRecommendation}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {selectedAnomaly.amount && (
                    <div className="bg-zinc-800/50 rounded-xl p-4">
                      <p className="text-xs text-zinc-500">Amount</p>
                      <p className="text-lg font-semibold text-red-400">{formatCurrency(selectedAnomaly.amount, currencyCode)}</p>
                    </div>
                  )}
                  {selectedAnomaly.potentialSavings && (
                    <div className="bg-zinc-800/50 rounded-xl p-4">
                      <p className="text-xs text-zinc-500">Potential Savings</p>
                      <p className="text-lg font-semibold text-emerald-400">{formatCurrency(selectedAnomaly.potentialSavings, currencyCode)}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/[0.06] pt-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-4">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedAnomaly.status !== 'resolved' && (
                      <button 
                        onClick={() => handleStatusChange(selectedAnomaly.id, 'resolved')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Mark as Resolved
                      </button>
                    )}
                    {selectedAnomaly.status !== 'investigating' && selectedAnomaly.status !== 'resolved' && (
                      <button 
                        onClick={() => handleStatusChange(selectedAnomaly.id, 'investigating')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        Start Investigation
                      </button>
                    )}
                    {selectedAnomaly.status !== 'dismissed' && (
                      <button 
                        onClick={() => handleStatusChange(selectedAnomaly.id, 'dismissed')}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Dismiss
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
                      <ArrowRight className="w-4 h-4" />
                      View Related Transactions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}