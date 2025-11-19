'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MousePointer,
  AlertTriangle,
  X,
  Activity,
  Eye,
  FileText,
  AlertCircle,
  TrendingDown,
  Crosshair,
  Brain,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface BehavioralData {
  summary: {
    totalBehavioralEvents: number;
    totalRageClicks: number;
    totalDeadClicks: number;
    totalClicks: number;
    totalFormAbandonment: number;
    totalErrors: number;
    tabSwitchRate: number;
    avgTimeBeforeTabSwitch: number;
    idleRate: number;
    avgIdleTime: number;
    totalCopyActions: number;
    totalPasteActions: number;
  };
  rageClicks: {
    total: number;
    byPage: Record<string, number>;
    hotspots: Array<{
      page: string;
      x: number;
      y: number;
      element: string;
      clickCount: number;
      visitorId: string;
      timestamp: string;
    }>;
  };
  deadClicks: {
    total: number;
    byPage: Record<string, number>;
    hotspots: Array<{
      page: string;
      x: number;
      y: number;
      element: string;
      visitorId: string;
      timestamp: string;
    }>;
  };
  scrollDepth: Record<
    string,
    {
      avg: number;
      distribution: Record<number, number>;
    }
  >;
  formAbandonment: Record<
    string,
    {
      focused: number;
      abandoned: number;
      abandonmentRate: number;
    }
  >;
  errors: {
    total: number;
    byPage: Record<string, number>;
    recentErrors: Array<{
      type: string;
      message: string;
      page: string;
      timestamp: string;
      visitorId: string;
    }>;
  };
}

export default function BehavioralAnalytics() {
  const [data, setData] = useState<BehavioralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzingAi, setAnalyzingAi] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/behavioral');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch behavioral analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestAiAnalysis = async () => {
    if (!data) return;

    setAnalyzingAi(true);
    try {
      const response = await fetch('/api/admin/behavioral/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setAiAnalysis(result.analysis);
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
      setAiAnalysis('Failed to generate AI analysis. Please try again.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading behavioral analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load behavioral data</div>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">
          🕵️ Behavioral Analytics - Stalker Mode
        </h1>
        <p className="text-gray-400">
          FullStory/Hotjar-level tracking: Rage clicks, dead clicks, form abandonment, errors, and more
        </p>
      </div>

      {/* AI Analysis Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="text-purple-400" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-white">Claude AI Analysis</h2>
                <p className="text-gray-400 text-sm">Get AI-powered insights on errors, UX issues, and optimization opportunities</p>
              </div>
            </div>
            <button
              onClick={requestAiAnalysis}
              disabled={analyzingAi}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {analyzingAi ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Analyze with AI
                </>
              )}
            </button>
          </div>

          {aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-6 mt-4"
            >
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">{aiAnalysis}</pre>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          className="bg-gray-800 border border-red-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-red-400" size={20} />
            <span className="text-gray-300 text-sm">Rage Clicks</span>
          </div>
          <div className="text-3xl font-bold text-red-400">{summary.totalRageClicks}</div>
          <div className="text-xs text-gray-500 mt-1">Frustrated users clicking repeatedly</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 border border-yellow-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <X className="text-yellow-400" size={20} />
            <span className="text-gray-300 text-sm">Dead Clicks</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{summary.totalDeadClicks}</div>
          <div className="text-xs text-gray-500 mt-1">Clicks on non-interactive elements</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 border border-orange-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-orange-400" size={20} />
            <span className="text-gray-300 text-sm">Form Abandonments</span>
          </div>
          <div className="text-3xl font-bold text-orange-400">
            {summary.totalFormAbandonment}
          </div>
          <div className="text-xs text-gray-500 mt-1">Users who started but didn't complete forms</div>
        </motion.div>

        <motion.div
          className="bg-gray-800 border border-purple-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-purple-400" size={20} />
            <span className="text-gray-300 text-sm">JavaScript Errors</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">{summary.totalErrors}</div>
          <div className="text-xs text-gray-500 mt-1">Errors encountered by users</div>
        </motion.div>
      </div>

      {/* Rage Clicks Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle size={24} />
          Rage Clicks by Page
        </h2>
        <div className="bg-gray-800 border border-red-500/20 rounded-lg p-6">
          {Object.keys(data.rageClicks.byPage).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.rageClicks.byPage)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between">
                    <span className="text-gray-300">{page}</span>
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500/20 rounded-full px-3 py-1">
                        <span className="text-red-400 font-bold">{count as number} rage clicks</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">No rage clicks detected 🎉</div>
          )}
        </div>
      </div>

      {/* Dead Clicks Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <X size={24} />
          Dead Clicks by Page
        </h2>
        <div className="bg-gray-800 border border-yellow-500/20 rounded-lg p-6">
          {Object.keys(data.deadClicks.byPage).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.deadClicks.byPage)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between">
                    <span className="text-gray-300">{page}</span>
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500/20 rounded-full px-3 py-1">
                        <span className="text-yellow-400 font-bold">{count as number} dead clicks</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">No dead clicks detected</div>
          )}
        </div>
      </div>

      {/* Scroll Depth Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <Activity size={24} />
          Scroll Depth by Page
        </h2>
        <div className="bg-gray-800 border border-blue-500/20 rounded-lg p-6">
          {Object.keys(data.scrollDepth).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(data.scrollDepth)
                .sort(([, a], [, b]) => (b as any).avg - (a as any).avg)
                .map(([page, stats]) => (
                  <div key={page} className="border-b border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">{page}</span>
                      <span className="text-blue-400 font-bold">Avg: {stats.avg}%</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-700 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">25%</div>
                        <div className="text-white font-bold">{stats.distribution[25]}</div>
                      </div>
                      <div className="flex-1 bg-gray-700 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">50%</div>
                        <div className="text-white font-bold">{stats.distribution[50]}</div>
                      </div>
                      <div className="flex-1 bg-gray-700 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">75%</div>
                        <div className="text-white font-bold">{stats.distribution[75]}</div>
                      </div>
                      <div className="flex-1 bg-gray-700 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">100%</div>
                        <div className="text-white font-bold">{stats.distribution[100]}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">No scroll data yet</div>
          )}
        </div>
      </div>

      {/* Form Abandonment Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
          <TrendingDown size={24} />
          Form Abandonment by Field
        </h2>
        <div className="bg-gray-800 border border-orange-500/20 rounded-lg p-6">
          {Object.keys(data.formAbandonment).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.formAbandonment)
                .sort(([, a], [, b]) => (b as any).abandonmentRate - (a as any).abandonmentRate)
                .map(([field, stats]) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-gray-300">{field}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm">
                        {stats.abandoned}/{stats.focused} abandoned
                      </span>
                      <div className="bg-orange-500/20 rounded-full px-3 py-1">
                        <span className="text-orange-400 font-bold">
                          {stats.abandonmentRate}% abandon rate
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">No form data yet</div>
          )}
        </div>
      </div>

      {/* Recent Errors Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          <AlertCircle size={24} />
          Recent JavaScript Errors
        </h2>
        <div className="bg-gray-800 border border-purple-500/20 rounded-lg p-6">
          {data.errors.recentErrors.length > 0 ? (
            <div className="space-y-3">
              {data.errors.recentErrors.map((error, index) => (
                <div
                  key={index}
                  className="bg-purple-500/10 border border-purple-500/30 rounded p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-purple-400 font-bold">{error.type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-300 text-sm mb-1">{error.message}</div>
                  <div className="text-xs text-gray-500">
                    Page: {error.page} • Visitor: {error.visitorId.slice(0, 20)}...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">No errors detected 🎉</div>
          )}
        </div>
      </div>

      {/* User Behavior Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-3">Tab Switching</h3>
          <div className="text-3xl font-bold text-blue-400 mb-2">{summary.tabSwitchRate}</div>
          <div className="text-sm text-gray-500">
            Avg {Math.floor(summary.avgTimeBeforeTabSwitch)}s before switching tabs
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-3">Idle Behavior</h3>
          <div className="text-3xl font-bold text-yellow-400 mb-2">{summary.idleRate}</div>
          <div className="text-sm text-gray-500">
            Avg {Math.floor(summary.avgIdleTime)}s idle time
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-3">Copy/Paste Actions</h3>
          <div className="text-3xl font-bold text-green-400 mb-2">
            {summary.totalCopyActions + summary.totalPasteActions}
          </div>
          <div className="text-sm text-gray-500">
            {summary.totalCopyActions} copies, {summary.totalPasteActions} pastes
          </div>
        </div>
      </div>
    </div>
  );
}
