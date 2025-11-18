'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Mail,
  MessageSquare,
  DollarSign,
  Clock,
  Activity,
  Star,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { AnalyticsSnapshot, Lead } from '@/types';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchLeads();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchLeads();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedLeadStatus]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const url =
        selectedLeadStatus === 'all'
          ? '/api/admin/leads'
          : `/api/admin/leads?status=${selectedLeadStatus}`;
      const response = await fetch(url);
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, updates: { status } }),
      });
      fetchLeads();
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-950 text-gray-100">
        <div className="text-center">
          <Activity className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-950 via-black to-gray-950 text-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-black/40 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400 mb-1">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Real-time analytics and lead management</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users />}
            title="Online Now"
            value={analytics?.visitorsOnline || 0}
            subtitle={`${analytics?.visitorsToday || 0} today`}
            color="green"
          />
          <StatCard
            icon={<Mail />}
            title="Email Capture"
            value={`${analytics?.emailCaptureRate.toFixed(1) || 0}%`}
            subtitle={`${analytics?.leadsToday || 0} leads today`}
            color="blue"
          />
          <StatCard
            icon={<MessageSquare />}
            title="Chat Quality"
            value={`${analytics?.conversationQuality || 0}/10`}
            subtitle="Average score"
            color="purple"
          />
          <StatCard
            icon={<Clock />}
            title="Avg Time"
            value={formatTime(analytics?.averageTimeOnSite || 0)}
            subtitle="per visitor"
            color="amber"
          />
        </div>

        {/* Top Products */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-500" />
            Top Products (Clicks)
          </h2>
          <div className="space-y-2">
            {analytics?.topProducts.slice(0, 5).map((product, i) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500 w-6">#{i + 1}</span>
                  <span className="text-sm text-gray-200">{product.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-green-400 font-semibold">
                    {product.clicks} clicks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
            <ExternalLink size={20} className="text-blue-500" />
            Traffic Sources
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {analytics?.trafficSources.slice(0, 6).map((source) => (
              <div
                key={source.source}
                className="p-3 bg-black/40 rounded-lg border border-gray-800/50"
              >
                <div className="text-xs text-gray-500 uppercase mb-1">{source.source}</div>
                <div className="text-lg font-bold text-gray-200">{source.visitors}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Management */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Star size={20} className="text-amber-500" />
              Leads ({leads.length})
            </h2>
            <div className="flex gap-2">
              {['all', 'new', 'contacted', 'converted', 'lost'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedLeadStatus(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedLeadStatus === status
                      ? 'bg-green-600/40 text-green-200 border border-green-600/50'
                      : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-auto">
            {leads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                <p>No leads yet</p>
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 bg-black/40 rounded-lg border border-gray-800/50 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-200">{lead.email}</span>
                        {lead.name && (
                          <span className="text-sm text-gray-400">({lead.name})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Score: {lead.score}/100</span>
                        <span>•</span>
                        <span>{lead.source.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{new Date(lead.firstContact).toLocaleString()}</span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.status)}`}
                    >
                      {lead.status}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                    {['new', 'contacted', 'converted', 'lost'].map((status) =>
                      status !== lead.status ? (
                        <button
                          key={status}
                          onClick={() => updateLeadStatus(lead.id, status as Lead['status'])}
                          className="px-3 py-1 bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/30 rounded text-xs font-semibold transition-all"
                        >
                          Mark as {status}
                        </button>
                      ) : null
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  const colors = {
    green: 'from-green-600 to-emerald-600',
    blue: 'from-blue-600 to-cyan-600',
    purple: 'from-purple-600 to-pink-600',
    amber: 'from-amber-600 to-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-800 rounded-xl"
    >
      <div className={`w-10 h-10 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-100 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </motion.div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-blue-600/20 text-blue-300 border border-blue-600/30';
    case 'contacted':
      return 'bg-purple-600/20 text-purple-300 border border-purple-600/30';
    case 'converted':
      return 'bg-green-600/20 text-green-300 border border-green-600/30';
    case 'lost':
      return 'bg-red-600/20 text-red-300 border border-red-600/30';
    default:
      return 'bg-gray-600/20 text-gray-300 border border-gray-600/30';
  }
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}
