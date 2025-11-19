'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Eye,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Clock,
  MapPin,
  Radio,
  Book,
  MessageSquare,
  Mail,
  CreditCard,
  Search,
  Filter,
  Download,
  MousePointer,
} from 'lucide-react';

interface VisitorProfile {
  visitorId: string;
  email?: string;
  leadScore: number;
  status: string;
  bible: {
    versesRead: number;
    readingTime: number;
    audioTime: number;
    chaptersOpened: number;
    highlightCount: number;
    noteCount: number;
  };
  radio: {
    totalListeningTime: number;
    sessionsCount: number;
    averageSessionLength: number;
    skips: number;
    bingeSessions: number;
    returnListener: boolean;
  };
  sam: {
    hasInteracted: boolean;
    totalMessages: number;
    counselorMode: boolean;
    counselorMessages: number;
    standardMessages: number;
    conversationDepth: string;
  };
  conversion: {
    hasEmail: boolean;
    hasPurchased: boolean;
    exitIntentShown: boolean;
    exitIntentConverted: boolean;
  };
  engagementScore: number;
  timeOnSite: number;
  pageViews: number;
  visitCount: number;
  trafficSource?: string;
  country?: string;
  lastSeen: string;
  // Deep device intel
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  deviceType?: string;
  deviceSummary?: string;
  screenResolution?: string;
  timezone?: string;
  connectionType?: string;
  cpuCores?: string | number;
  memory?: string;
  touchSupport?: boolean;
  // Referrer intel
  referrerType?: string;
  referrerCategory?: string;
  referrerDomain?: string;
  socialPlatform?: string;
  searchQuery?: string;
  intelSummary?: string;
}

interface EngagementData {
  summary: {
    totalVisitors: number;
    avgEngagementScore: number;
    bibleUsers: number;
    radioUsers: number;
    samUsers: number;
    highEngagement: number;
    mediumEngagement: number;
    lowEngagement: number;
    avgBibleTime: number;
    avgRadioTime: number;
    exitIntentConversionRate: string;
  };
  topEngaged: VisitorProfile[];
  allProfiles: VisitorProfile[];
}

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'engagement' | 'lastSeen' | 'timeOnSite'>('engagement');

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/engagement');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load analytics data</div>
      </div>
    );
  }

  // Filter and sort profiles
  let filteredProfiles = data.allProfiles;

  // Apply engagement filter
  if (filterType === 'high') {
    filteredProfiles = filteredProfiles.filter(p => p.engagementScore >= 70);
  } else if (filterType === 'medium') {
    filteredProfiles = filteredProfiles.filter(p => p.engagementScore >= 40 && p.engagementScore < 70);
  } else if (filterType === 'low') {
    filteredProfiles = filteredProfiles.filter(p => p.engagementScore < 40);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProfiles = filteredProfiles.filter(p =>
      (p.visitorId || '').toLowerCase().includes(query) ||
      (p.email || '').toLowerCase().includes(query) ||
      (p.deviceSummary || '').toLowerCase().includes(query) ||
      (p.country || '').toLowerCase().includes(query) ||
      (p.referrerDomain || '').toLowerCase().includes(query)
    );
  }

  // Apply sort
  filteredProfiles = [...filteredProfiles].sort((a, b) => {
    if (sortBy === 'engagement') {
      return b.engagementScore - a.engagementScore;
    } else if (sortBy === 'lastSeen') {
      return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
    } else {
      return b.timeOnSite - a.timeOnSite;
    }
  });

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getEngagementColor = (score: number) => {
    if (score >= 70) return 'text-green-400 bg-green-500/20 border-green-500/50';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    return 'text-red-400 bg-red-500/20 border-red-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Eye className="text-red-500" size={36} />
          Sherlock Holmes Analytics
        </h1>
        <p className="text-gray-400 mb-4">Deep visitor intelligence & engagement tracking</p>

        <Link
          href="/admin/behavioral"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <MousePointer size={20} />
          🕵️ View Behavioral Analytics (Stalker Mode)
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-700/50 rounded-xl p-6"
        >
          <Users className="text-blue-400 mb-3" size={32} />
          <div className="text-3xl font-bold text-white">{data.summary.totalVisitors}</div>
          <div className="text-sm text-gray-300">Total Visitors</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-700/50 rounded-xl p-6"
        >
          <TrendingUp className="text-green-400 mb-3" size={32} />
          <div className="text-3xl font-bold text-white">{data.summary.avgEngagementScore}</div>
          <div className="text-sm text-gray-300">Avg Engagement</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-700/50 rounded-xl p-6"
        >
          <Book className="text-purple-400 mb-3" size={32} />
          <div className="text-3xl font-bold text-white">{data.summary.bibleUsers}</div>
          <div className="text-sm text-gray-300">Bible Users</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-700/50 rounded-xl p-6"
        >
          <Radio className="text-red-400 mb-3" size={32} />
          <div className="text-3xl font-bold text-white">{data.summary.radioUsers}</div>
          <div className="text-sm text-gray-300">Radio Listeners</div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="bg-black/40 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by visitor ID, email, device, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Filter by engagement */}
          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  filterType === type
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="engagement">Sort by Engagement</option>
            <option value="lastSeen">Sort by Last Seen</option>
            <option value="timeOnSite">Sort by Time on Site</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredProfiles.length} of {data.allProfiles.length} visitors
        </div>
      </div>

      {/* Visitor Profiles - Detailed Cards */}
      <div className="space-y-4">
        {filteredProfiles.map((profile, index) => (
          <motion.div
            key={profile.visitorId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-r from-gray-900/90 to-black/90 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Column 1: Identity & Device */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getEngagementColor(
                      profile.engagementScore
                    )}`}
                  >
                    {profile.engagementScore}% Engaged
                  </div>
                </div>

                <div className="text-xs text-gray-500 font-mono">{profile.visitorId.slice(0, 20)}...</div>

                {profile.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-green-400" />
                    <span className="text-gray-300">{profile.email}</span>
                  </div>
                )}

                {profile.deviceSummary && (
                  <div className="text-sm text-gray-400 flex items-start gap-2">
                    {profile.deviceType === 'Mobile' ? (
                      <Smartphone size={16} className="text-blue-400 mt-0.5" />
                    ) : (
                      <Monitor size={16} className="text-blue-400 mt-0.5" />
                    )}
                    <span className="text-xs leading-relaxed">{profile.deviceSummary}</span>
                  </div>
                )}

                {profile.timezone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} />
                    <span>{profile.timezone}</span>
                  </div>
                )}

                {profile.connectionType && profile.connectionType !== 'unknown' && (
                  <div className="text-xs text-gray-500">
                    Connection: {profile.connectionType}
                  </div>
                )}
              </div>

              {/* Column 2: Traffic Source & Referrer Intel */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Traffic Source
                </div>

                {profile.referrerCategory && (
                  <div className="inline-block px-3 py-1 bg-purple-600/20 border border-purple-700/50 rounded-full text-xs text-purple-300">
                    {profile.referrerCategory}
                  </div>
                )}

                {profile.intelSummary && (
                  <div className="text-sm text-gray-400 leading-relaxed">{profile.intelSummary}</div>
                )}

                {profile.searchQuery && (
                  <div className="flex items-center gap-2 text-sm">
                    <Search size={14} className="text-yellow-400" />
                    <span className="text-gray-300">"{profile.searchQuery}"</span>
                  </div>
                )}

                {profile.referrerDomain && profile.referrerDomain !== 'direct' && (
                  <div className="text-xs text-gray-500">From: {profile.referrerDomain}</div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>{formatDate(profile.lastSeen)}</span>
                </div>
              </div>

              {/* Column 3: Engagement Metrics */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Engagement
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Time on Site</div>
                    <div className="text-white font-semibold">{formatTime(profile.timeOnSite)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Page Views</div>
                    <div className="text-white font-semibold">{profile.pageViews}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Visits</div>
                    <div className="text-white font-semibold">{profile.visitCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Lead Score</div>
                    <div className="text-white font-semibold">{profile.leadScore}</div>
                  </div>
                </div>

                {profile.sam.hasInteracted && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-blue-400">
                      <MessageSquare size={14} />
                      <span>Sam: {profile.sam.totalMessages} messages</span>
                    </div>
                    {profile.sam.counselorMode && (
                      <div className="text-xs text-yellow-400 pl-5">
                        Counselor mode: {profile.sam.counselorMessages} msgs
                      </div>
                    )}
                  </div>
                )}

                {profile.conversion.hasPurchased && (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CreditCard size={14} />
                    <span>Made Purchase</span>
                  </div>
                )}
              </div>

              {/* Column 4: Bible & Radio Activity */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Activity</div>

                {/* Bible Stats */}
                {profile.bible.versesRead > 0 && (
                  <div className="bg-purple-900/30 border border-purple-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Book size={16} className="text-purple-400" />
                      <span className="text-sm font-semibold text-purple-300">Bible Study</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>{profile.bible.versesRead} verses read</div>
                      <div>{profile.bible.chaptersOpened} chapters opened</div>
                      <div>{profile.bible.highlightCount} highlights</div>
                      <div>{formatTime(profile.bible.readingTime)} reading time</div>
                    </div>
                  </div>
                )}

                {/* Radio Stats */}
                {profile.radio.sessionsCount > 0 && (
                  <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Radio size={16} className="text-red-400" />
                      <span className="text-sm font-semibold text-red-300">Radio</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>{profile.radio.sessionsCount} sessions</div>
                      <div>{formatTime(profile.radio.totalListeningTime)} total</div>
                      {profile.radio.bingeSessions > 0 && (
                        <div className="text-yellow-400">{profile.radio.bingeSessions} binge sessions</div>
                      )}
                    </div>
                  </div>
                )}

                {profile.bible.versesRead === 0 && profile.radio.sessionsCount === 0 && (
                  <div className="text-xs text-gray-500 italic">No Bible/Radio activity yet</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No visitors match your filters. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );
}
