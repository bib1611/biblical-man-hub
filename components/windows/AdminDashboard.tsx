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
  BookOpen,
  Radio,
  Brain,
  Target,
  Eye,
  Ear,
  Zap,
  Music,
} from 'lucide-react';
import { AnalyticsSnapshot, Lead } from '@/types';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [engagement, setEngagement] = useState<any>(null);
  const [psychographics, setPsychographics] = useState<any>(null);
  const [enhancedAnalytics, setEnhancedAnalytics] = useState<any>(null);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'psychographics' | 'enhanced'>('overview');
  const [loading, setLoading] = useState(true);
  const [recoveredLeads, setRecoveredLeads] = useState<any[]>([]);
  const [recovering, setRecovering] = useState(false);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    fetchAnalytics();
    fetchLeads();
    fetchEngagement();
    fetchPsychographics();
    fetchEnhancedAnalytics();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchLeads();
      fetchEngagement();
      fetchPsychographics();
      fetchEnhancedAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedLeadStatus, timeRange]);

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

  const fetchEngagement = async () => {
    try {
      const response = await fetch('/api/admin/engagement');
      const data = await response.json();
      setEngagement(data);
    } catch (error) {
      console.error('Failed to fetch engagement:', error);
    }
  };

  const fetchPsychographics = async () => {
    try {
      const response = await fetch('/api/admin/psychographics');
      const data = await response.json();
      setPsychographics(data);
    } catch (error) {
      console.error('Failed to fetch psychographics:', error);
    }
  };

  const fetchEnhancedAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      const data = await response.json();
      setEnhancedAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch enhanced analytics:', error);
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

  const recoverLeadsFromResend = async () => {
    setRecovering(true);
    try {
      const response = await fetch('/api/admin/recover-leads?password=Blakedylan2025');
      const data = await response.json();
      setRecoveredLeads(data.recoveredLeads || []);
      console.log('🔥 RECOVERED:', data);
    } catch (error) {
      console.error('Failed to recover leads:', error);
    } finally {
      setRecovering(false);
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-green-400 mb-1">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Real-time analytics and lead management</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview'
                ? 'bg-green-600/40 text-green-200 border border-green-600/50'
                : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
              }`}
          >
            <TrendingUp className="inline w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'engagement'
                ? 'bg-green-600/40 text-green-200 border border-green-600/50'
                : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
              }`}
          >
            <Eye className="inline w-4 h-4 mr-2" />
            Engagement (Eyes & Ears)
          </button>
          <button
            onClick={() => setActiveTab('psychographics')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'psychographics'
                ? 'bg-green-600/40 text-green-200 border border-green-600/50'
                : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
              }`}
          >
            <Brain className="inline w-4 h-4 mr-2" />
            Psychographics (Psy-Ops)
          </button>
          <button
            onClick={() => setActiveTab('enhanced')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'enhanced'
                ? 'bg-green-600/40 text-green-200 border border-green-600/50'
                : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
              }`}
          >
            <Activity className="inline w-4 h-4 mr-2" />
            Enhanced Tracking (GA4 + Clarity)
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
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
                value={`${(analytics?.emailCaptureRate || 0).toFixed(1)}%`}
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
                {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                  analytics.topProducts.slice(0, 5).map((product, i) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No product data yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                <ExternalLink size={20} className="text-blue-500" />
                Traffic Sources
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {analytics?.trafficSources && analytics.trafficSources.length > 0 ? (
                  analytics.trafficSources.slice(0, 6).map((source) => (
                    <div
                      key={source.source}
                      className="p-3 bg-black/40 rounded-lg border border-gray-800/50"
                    >
                      <div className="text-xs text-gray-500 uppercase mb-1">{source.source}</div>
                      <div className="text-lg font-bold text-gray-200">{source.visitors}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <p>No traffic data yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* 🔥 EMAIL CAPTURES - ACTUAL EMAILS CAPTURED */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Mail size={20} className="text-green-500" />
                Email Captures ({analytics?.emailCaptures || 0}) - Last 20
              </h2>
              <div className="space-y-2 max-h-96 overflow-auto">
                {analytics?.recentActiveVisitors && analytics.recentActiveVisitors.filter((v: any) => v.email && v.email !== 'Anonymous').length > 0 ? (
                  analytics.recentActiveVisitors
                    .filter((v: any) => v.email && v.email !== 'Anonymous')
                    .slice(0, 20)
                    .map((visitor: any) => (
                      <div
                        key={visitor.id}
                        className="p-3 bg-black/40 rounded-lg border border-gray-800/50 hover:border-gray-700 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-green-400">{visitor.email}</span>
                              <span className="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300">
                                Score: {visitor.leadScore}/100
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{visitor.city || visitor.country || 'Unknown location'}</span>
                              <span>•</span>
                              <span>{visitor.trafficSource}</span>
                              <span>•</span>
                              <span>{visitor.pageViews} pages</span>
                              <span>•</span>
                              <span>{formatTime(visitor.timeOnSite)}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(visitor.lastSeen).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No emails captured yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* 💰 RECOVERED LEADS FROM RESEND - DATA RECOVERY */}
            <div className="bg-gradient-to-br from-yellow-950/40 to-black border-2 border-yellow-600/50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
                  <Zap size={20} className="text-yellow-500" />
                  💰 RECOVERED LEADS FROM RESEND ({recoveredLeads.length})
                </h2>
                <button
                  onClick={recoverLeadsFromResend}
                  disabled={recovering}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  {recovering ? 'Recovering...' : 'Recover Leads'}
                </button>
              </div>
              <p className="text-sm text-yellow-200/80 mb-4">
                These emails were actually sent from Resend but lost due to database resets. Click "Recover Leads" to fetch them from Resend API.
              </p>
              {recoveredLeads.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {recoveredLeads.map((lead: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-black/60 rounded-lg border border-yellow-800/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-yellow-300">{lead.email}</span>
                            <span className="text-xs px-2 py-1 rounded bg-green-900/60 text-green-200">
                              {lead.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>Sent: {new Date(lead.sentAt).toLocaleString()}</span>
                            <span>•</span>
                            <span>ID: {lead.emailId.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-yellow-400">
                  <Zap size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Click "Recover Leads" to fetch emails from Resend</p>
                </div>
              )}
            </div>

            {/* 🔥 HOT LEADS - ACTIVE RIGHT NOW */}
            {analytics?.hotLeads && analytics.hotLeads.length > 0 && (
              <div className="bg-gradient-to-br from-red-950/40 to-black border-2 border-red-600/50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-red-500 animate-pulse" />
                  🔥 HOT LEADS - Active in Last 30 Minutes ({analytics.hotLeads.length})
                </h2>
                <div className="space-y-2">
                  {analytics.hotLeads.map((lead: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 bg-black/60 rounded-lg border border-red-800/50 hover:border-red-600/70 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-red-300">
                              {lead.email}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-red-900/60 text-red-200 font-bold">
                              🔥 {lead.leadScore}/100
                            </span>
                            <span className="text-xs text-gray-500">
                              {lead.minutesAgo} min ago
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{lead.trafficSource}</span>
                            <span>•</span>
                            <span>{lead.pageViews} pages</span>
                            <span>•</span>
                            <span>{lead.timeOnSite} min on site</span>
                            {lead.interactedWithSam && (
                              <>
                                <span>•</span>
                                <span className="text-purple-400">💬 Chatted with Sam</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🔥 RECENT ACTIVE VISITORS - WHO'S ONLINE */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Users size={20} className="text-blue-500" />
                Recent Active Visitors ({analytics?.recentActiveVisitors?.length || 0})
              </h2>
              <div className="space-y-2 max-h-96 overflow-auto">
                {analytics?.recentActiveVisitors && analytics.recentActiveVisitors.length > 0 ? (
                  analytics.recentActiveVisitors.map((visitor: any) => (
                    <div
                      key={visitor.id}
                      className="p-3 bg-black/40 rounded-lg border border-gray-800/50 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-300">
                              {visitor.email || `Anonymous (${visitor.id.slice(-8)})`}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300">
                              {visitor.leadScore}/100
                            </span>
                            {visitor.isMobile && (
                              <span className="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300">
                                📱 Mobile
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2">
                            <div>📍 {visitor.city}, {visitor.country}</div>
                            <div>🌐 {visitor.browser} / {visitor.os}</div>
                            <div>🔗 {visitor.trafficSource}</div>
                            <div>📄 {visitor.pageViews} pages • {formatTime(visitor.timeOnSite)}</div>
                          </div>
                          {(visitor.interactedWithSam || visitor.enabledCounselorMode || visitor.purchasedCredits) && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800">
                              {visitor.interactedWithSam && (
                                <span className="text-xs px-2 py-1 rounded bg-purple-900/40 text-purple-300">
                                  💬 Sam
                                </span>
                              )}
                              {visitor.enabledCounselorMode && (
                                <span className="text-xs px-2 py-1 rounded bg-blue-900/40 text-blue-300">
                                  🧠 Counselor
                                </span>
                              )}
                              {visitor.purchasedCredits && (
                                <span className="text-xs px-2 py-1 rounded bg-green-900/40 text-green-300">
                                  💰 PURCHASED
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(visitor.lastSeen).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No active visitors</p>
                  </div>
                )}
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
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedLeadStatus === status
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
          </>
        )}

        {/* ENGAGEMENT TAB (Eyes & Ears) */}
        {activeTab === 'engagement' && engagement && (
          <>
            {/* Engagement Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Zap />}
                title="Avg Engagement"
                value={`${engagement.summary?.avgEngagementScore || 0}/100`}
                subtitle="Overall score"
                color="purple"
              />
              <StatCard
                icon={<BookOpen />}
                title="Bible Users"
                value={engagement.summary?.bibleUsers || 0}
                subtitle={`${formatTime(engagement.summary?.avgBibleTime || 0)} avg`}
                color="blue"
              />
              <StatCard
                icon={<Radio />}
                title="Radio Listeners"
                value={engagement.summary?.radioUsers || 0}
                subtitle={`${formatTime(engagement.summary?.avgRadioTime || 0)} avg`}
                color="green"
              />
              <StatCard
                icon={<MessageSquare />}
                title="Sam Users"
                value={engagement.summary?.samUsers || 0}
                subtitle="AI interactions"
                color="amber"
              />
            </div>

            {/* Engagement Breakdown */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <Eye className="text-blue-500" size={20} />
                  Eyes (Visual Engagement)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">High Engagement</span>
                    <span className="text-lg font-bold text-green-400">{engagement.summary?.highEngagement || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Medium Engagement</span>
                    <span className="text-lg font-bold text-yellow-400">{engagement.summary?.mediumEngagement || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Low Engagement</span>
                    <span className="text-lg font-bold text-red-400">{engagement.summary?.lowEngagement || 0}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-800">
                    <span className="text-xs text-gray-500">Exit Intent Conversion</span>
                    <div className="text-2xl font-bold text-purple-400">{engagement.summary?.exitIntentConversionRate || 0}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <BookOpen className="text-blue-500" size={20} />
                  Bible Engagement
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400 block mb-1">Total Users</span>
                    <span className="text-2xl font-bold text-blue-400">{engagement.summary?.bibleUsers || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Avg Reading Time</span>
                    <span className="text-lg font-bold text-gray-200">{formatTime(engagement.summary?.avgBibleTime || 0)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                    Deep readers with highlights/notes indicate premium users
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <Ear className="text-green-500" size={20} />
                  Audio Engagement (Ears)
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400 block mb-1">Radio Listeners</span>
                    <span className="text-2xl font-bold text-green-400">{engagement.summary?.radioUsers || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Avg Listening Time</span>
                    <span className="text-lg font-bold text-gray-200">{formatTime(engagement.summary?.avgRadioTime || 0)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                    Binge listeners (30+ min sessions) are highly engaged
                  </div>
                </div>
              </div>
            </div>

            {/* Top Engaged Visitors */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Target size={20} className="text-purple-500" />
                Top Engaged Visitors
              </h2>
              <div className="space-y-2 max-h-96 overflow-auto">
                {engagement.topEngaged && engagement.topEngaged.length > 0 ? (
                  engagement.topEngaged.map((visitor: any, i: number) => (
                    <div
                      key={visitor.visitorId}
                      className="p-4 bg-black/40 rounded-lg border border-gray-800/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-500 w-8">#{i + 1}</span>
                          <div>
                            <div className="font-semibold text-gray-200">
                              {visitor.email || visitor.visitorId.slice(0, 20)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {visitor.trafficSource} • {visitor.country}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">{visitor.engagementScore}</div>
                          <div className="text-xs text-gray-500">engagement</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-gray-800">
                        <div>
                          <span className="text-gray-500 block">Bible</span>
                          <span className="text-blue-400 font-semibold">{visitor.bible?.versesRead || 0} verses</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Radio</span>
                          <span className="text-green-400 font-semibold">{formatTime(visitor.radio?.totalListeningTime || 0)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Time on Site</span>
                          <span className="text-amber-400 font-semibold">{formatTime(visitor.timeOnSite || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No engagement data yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* PSYCHOGRAPHICS TAB (Psy-Ops) */}
        {activeTab === 'psychographics' && psychographics && (
          <>
            {/* Psychographic Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Brain />}
                title="Avg Conversion Readiness"
                value={`${psychographics.summary?.avgConversionReadiness || 0}/100`}
                subtitle="Overall readiness"
                color="purple"
              />
              <StatCard
                icon={<Target />}
                title="High Readiness"
                value={psychographics.summary?.highReadiness || 0}
                subtitle="70+ score"
                color="green"
              />
              <StatCard
                icon={<AlertCircle />}
                title="Medium Readiness"
                value={psychographics.summary?.mediumReadiness || 0}
                subtitle="40-69 score"
                color="amber"
              />
              <StatCard
                icon={<Users />}
                title="Low Readiness"
                value={psychographics.summary?.lowReadiness || 0}
                subtitle="<40 score"
                color="blue"
              />
            </div>

            {/* Personality Types & Message Framing */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <Brain className="text-purple-500" size={20} />
                  Personality Types
                </h3>
                <div className="space-y-2">
                  {psychographics.summary?.personalityTypes && Object.entries(psychographics.summary.personalityTypes).map(([type, count]: [string, any]) => (
                    <div key={type} className="flex justify-between items-center p-2 bg-black/40 rounded">
                      <span className="text-sm text-gray-300 capitalize">{type}</span>
                      <span className="text-lg font-bold text-purple-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <MessageSquare className="text-blue-500" size={20} />
                  Message Framing Effectiveness
                </h3>
                <div className="space-y-2">
                  {psychographics.summary?.messageFramingStats && Object.entries(psychographics.summary.messageFramingStats).map(([frame, count]: [string, any]) => (
                    <div key={frame} className="flex justify-between items-center p-2 bg-black/40 rounded">
                      <span className="text-sm text-gray-300 capitalize">{frame}</span>
                      <span className="text-lg font-bold text-blue-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Pain Points & Motivators */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Top Pain Points</h3>
                <div className="space-y-2">
                  {psychographics.topPainPoints && psychographics.topPainPoints.map((item: any, i: number) => (
                    <div key={item.point} className="flex justify-between items-center p-2 bg-black/40 rounded">
                      <span className="text-sm text-gray-300">{item.point.replace(/-/g, ' ')}</span>
                      <span className="text-sm font-bold text-red-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Top Motivators</h3>
                <div className="space-y-2">
                  {psychographics.topMotivators && psychographics.topMotivators.map((item: any, i: number) => (
                    <div key={item.motivator} className="flex justify-between items-center p-2 bg-black/40 rounded">
                      <span className="text-sm text-gray-300 capitalize">{item.motivator}</span>
                      <span className="text-sm font-bold text-green-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* High-Value Targets */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Target size={20} className="text-red-500" />
                High-Value Targets (High Readiness + No Email)
              </h2>
              <p className="text-sm text-gray-400 mb-4">These visitors are ready to convert but haven't given their email yet. Priority targets for conversion.</p>
              <div className="space-y-2 max-h-96 overflow-auto">
                {psychographics.highValueTargets && psychographics.highValueTargets.length > 0 ? (
                  psychographics.highValueTargets.map((target: any) => (
                    <div
                      key={target.visitorId}
                      className="p-4 bg-black/40 rounded-lg border border-red-900/30 hover:border-red-600/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-200">{target.visitorId.slice(0, 30)}...</div>
                          <div className="text-xs text-gray-500">
                            {target.profile?.trafficSource} • {target.profile?.country}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-400">{target.psychographic?.conversionReadiness}/100</div>
                          <div className="text-xs text-gray-500">readiness</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500 block">Personality</span>
                          <span className="text-purple-400 font-semibold capitalize">{target.psychographic?.personalityType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Message Framing</span>
                          <span className="text-blue-400 font-semibold capitalize">{target.psychographic?.messageFraming}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Lead Score</span>
                          <span className="text-amber-400 font-semibold">{target.leadScore}/100</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No high-value targets yet</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ENHANCED TRACKING TAB (GA4 + Clarity + Cookie Consent) */}
        {activeTab === 'enhanced' && (
          <>
            {/* Time Range Selector */}
            <div className="flex justify-end mb-6">
              <div className="flex gap-2">
                {(['1h', '24h', '7d', '30d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${timeRange === range
                        ? 'bg-green-600/40 text-green-200 border border-green-600/50'
                        : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading or No Data State */}
            {!enhancedAnalytics ? (
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-12 text-center">
                <div className="mb-4">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-green-600"></div>
                </div>
                <p className="text-gray-400 text-lg mb-2">Loading Enhanced Analytics...</p>
                <p className="text-gray-600 text-sm">Fetching data from Supabase</p>
              </div>
            ) : (
              <>
                {/* Enhanced Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <StatCard
                    icon={<Users />}
                    title="Total Visitors"
                    value={enhancedAnalytics.metrics?.totalVisitors || 0}
                    subtitle={`${enhancedAnalytics.metrics?.newVisitors || 0} new, ${enhancedAnalytics.metrics?.returningVisitors || 0} returning`}
                    color="blue"
                  />
                  <StatCard
                    icon={<Mail />}
                    title="Email Capture"
                    value={`${enhancedAnalytics.metrics?.emailCaptureRate || 0}%`}
                    subtitle="conversion rate"
                    color="green"
                  />
                  <StatCard
                    icon={<TrendingUp />}
                    title="Avg Lead Score"
                    value={enhancedAnalytics.metrics?.avgLeadScore || 0}
                    subtitle="out of 100"
                    color="purple"
                  />
                  <StatCard
                    icon={<Activity />}
                    title="Total Events"
                    value={enhancedAnalytics.metrics?.totalEvents || 0}
                    subtitle="tracked actions"
                    color="amber"
                  />
                  <StatCard
                    icon={<Target />}
                    title="Exit Intent Conv."
                    value={`${enhancedAnalytics.conversions?.exitIntentConversionRate || 0}%`}
                    subtitle={`${enhancedAnalytics.conversions?.exitIntentConverted || 0}/${enhancedAnalytics.conversions?.exitIntentShown || 0} shown`}
                    color="green"
                  />
                </div>

                {/* Event Breakdown */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                      <Zap className="text-amber-500" size={20} />
                      Event Breakdown
                    </h3>
                    <div className="space-y-2">
                      {enhancedAnalytics.events?.byType && Object.entries(enhancedAnalytics.events.byType).length > 0 ? (
                        Object.entries(enhancedAnalytics.events.byType)
                          .sort((a: any, b: any) => b[1] - a[1])
                          .map(([type, count]: [string, any]) => (
                            <div key={type} className="flex justify-between items-center p-2 bg-black/40 rounded">
                              <span className="text-sm text-gray-300 capitalize">{type.replace(/_/g, ' ')}</span>
                              <span className="text-lg font-bold text-amber-400">{count}</span>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No events tracked yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                      <ExternalLink className="text-blue-500" size={20} />
                      Traffic Sources
                    </h3>
                    <div className="space-y-2">
                      {enhancedAnalytics.trafficSources && Object.entries(enhancedAnalytics.trafficSources).length > 0 ? (
                        Object.entries(enhancedAnalytics.trafficSources)
                          .sort((a: any, b: any) => b[1] - a[1])
                          .slice(0, 8)
                          .map(([source, count]: [string, any]) => (
                            <div key={source} className="flex justify-between items-center p-2 bg-black/40 rounded">
                              <span className="text-sm text-gray-300">{source}</span>
                              <span className="text-lg font-bold text-blue-400">{count}</span>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No traffic sources tracked yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Psychographic Distribution */}
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                    <Brain className="text-purple-500" size={20} />
                    Psychographic Distribution
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {enhancedAnalytics.psychographics && Object.entries(enhancedAnalytics.psychographics).length > 0 ? (
                      Object.entries(enhancedAnalytics.psychographics).map(([type, count]: [string, any]) => (
                        <div key={type} className="p-4 bg-black/40 rounded-lg border border-purple-900/30">
                          <div className="text-xs text-purple-400 uppercase mb-1 capitalize">{type}</div>
                          <div className="text-2xl font-bold text-gray-200">{count}</div>
                          <div className="text-xs text-gray-500">visitors</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-8 text-gray-500">
                        <p>No psychographic data yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                    <Target className="text-green-500" size={20} />
                    Conversion Funnel
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-950/40 to-black border border-blue-900/30 rounded-xl">
                      <div className="text-sm text-blue-400 mb-2">Email Submissions</div>
                      <div className="text-4xl font-bold text-blue-300 mb-1">{enhancedAnalytics.conversions?.emailSubmits || 0}</div>
                      <div className="text-xs text-gray-500">total conversions</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-950/40 to-black border border-amber-900/30 rounded-xl">
                      <div className="text-sm text-amber-400 mb-2">Exit Intent Shown</div>
                      <div className="text-4xl font-bold text-amber-300 mb-1">{enhancedAnalytics.conversions?.exitIntentShown || 0}</div>
                      <div className="text-xs text-gray-500">popups displayed</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-950/40 to-black border border-green-900/30 rounded-xl">
                      <div className="text-sm text-green-400 mb-2">Exit Intent Converted</div>
                      <div className="text-4xl font-bold text-green-300 mb-1">{enhancedAnalytics.conversions?.exitIntentConverted || 0}</div>
                      <div className="text-xs text-gray-500">{enhancedAnalytics.conversions?.exitIntentConversionRate || 0}% conversion</div>
                    </div>
                  </div>
                </div>

                {/* Recent Events */}
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                    <Activity className="text-red-500" size={20} />
                    Recent Events (Last 50)
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-auto">
                    {enhancedAnalytics.events?.recent && enhancedAnalytics.events.recent.length > 0 ? (
                      enhancedAnalytics.events.recent.map((event: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 bg-black/40 rounded-lg border border-gray-800/50 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-300 capitalize">{event.event_type?.replace(/_/g, ' ')}</span>
                            <span className="text-gray-500">{new Date(event.created_at).toLocaleString()}</span>
                          </div>
                          {event.event_data && (
                            <div className="text-gray-500 mt-1">
                              {typeof event.event_data === 'string'
                                ? event.event_data.substring(0, 100)
                                : JSON.stringify(event.event_data).substring(0, 100)}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No recent events</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analytics Links */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <a
                    href="https://analytics.google.com/analytics/web/#/p455284742/reports/intelligenthome"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-950/40 to-black border border-blue-900/30 rounded-xl hover:border-blue-600/50 transition-all"
                  >
                    <div>
                      <div className="font-bold text-blue-300 mb-1">Open Google Analytics 4</div>
                      <div className="text-xs text-gray-500">View full GA4 dashboard (ID: G-FK1SM7ZE9E)</div>
                    </div>
                    <ExternalLink className="text-blue-400" size={20} />
                  </a>
                  <a
                    href="https://clarity.microsoft.com/projects/view/u8n8nrd4x3/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-950/40 to-black border border-purple-900/30 rounded-xl hover:border-purple-600/50 transition-all"
                  >
                    <div>
                      <div className="font-bold text-purple-300 mb-1">Open Microsoft Clarity</div>
                      <div className="text-xs text-gray-500">View session recordings & heatmaps (ID: u8n8nrd4x3)</div>
                    </div>
                    <ExternalLink className="text-purple-400" size={20} />
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  const colors: Record<string, string> = {
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
      <div className={`w-10 h-10 bg-gradient-to-br ${colors[color] || colors.blue} rounded-lg flex items-center justify-center mb-3`}>
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
