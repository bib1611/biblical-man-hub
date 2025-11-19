'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Send, Lock, ExternalLink, TrendingUp, Clock, X } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CommunityMessage {
  id: string;
  personaName: string;
  personaAvatar: string;
  content: string;
  timestamp: string;
  reactions: Array<{ emoji: string; count: number }>;
  isUserMessage: boolean;
}

interface ChatThread {
  id: string;
  topic: string;
  substackPostUrl?: string;
  messageCount: number;
  participantCount: number;
  recentMessages: CommunityMessage[];
  lastActivity: string;
}

export default function CommunityChat() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showAccessForm, setShowAccessForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { visitorId, trackEvent } = useAnalytics();

  // Fetch chat threads
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/community/chat');
        const data = await response.json();

        if (data.success) {
          setThreads(data.threads);
          setOnlineCount(data.onlineCount);

          // Auto-select first thread
          if (!selectedThread && data.threads.length > 0) {
            setSelectedThread(data.threads[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch community chat:', error);
      }
    };

    fetchThreads();

    // Refresh every 30 seconds to get new AI messages
    const interval = setInterval(fetchThreads, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.recentMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    // Track attempt to join conversation
    trackEvent('custom', {
      event: 'community_chat_attempt',
      thread: selectedThread?.topic,
    });

    // Trigger paywall
    setShowPaywall(true);
  };

  const handleAccessRequest = async () => {
    if (!userEmail) return;

    // Track email capture for community access
    trackEvent('email_capture', {
      email: userEmail,
      source: 'community_chat_access',
    });

    // TODO: Send to backend to request access
    setShowAccessForm(false);
    setShowPaywall(false);

    // Show success message
    alert('Access request submitted! We\'ll review and email you within 24 hours.');
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diff = Math.floor((now - then) / 1000 / 60); // minutes

    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-blue-900/30 bg-black/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-blue-400" size={24} />
            <div>
              <h2 className="text-lg font-bold text-white">Biblical Man Community</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users size={14} />
                <span>{onlineCount} members online</span>
              </div>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full text-xs text-green-300 font-semibold">
            <span className="animate-pulse">● LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Thread List Sidebar */}
        <div className="w-80 border-r border-blue-900/30 bg-black/20 overflow-y-auto">
          <div className="p-3 border-b border-blue-900/20 bg-blue-950/20">
            <h3 className="text-sm font-bold text-blue-300">Active Discussions</h3>
          </div>
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-4 border-b border-gray-800/50 cursor-pointer transition-all hover:bg-blue-950/30 ${
                selectedThread?.id === thread.id ? 'bg-blue-950/40 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-white leading-tight">{thread.topic}</h4>
                {thread.substackPostUrl && (
                  <ExternalLink className="text-blue-400 flex-shrink-0 ml-2" size={14} />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  <span>{thread.messageCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{thread.participantCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatTimeAgo(thread.lastActivity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-blue-900/30 bg-black/40">
                <h3 className="text-lg font-bold text-white mb-2">{selectedThread.topic}</h3>
                {selectedThread.substackPostUrl && (
                  <a
                    href={selectedThread.substackPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink size={14} />
                    Read the full article
                  </a>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.recentMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="text-2xl flex-shrink-0">{message.personaAvatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{message.personaName}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(message.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed mb-2">{message.content}</p>
                      <div className="flex gap-2">
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="px-2 py-1 bg-gray-800/50 hover:bg-gray-800 rounded-full text-xs flex items-center gap-1 transition-all"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-gray-400">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />

                {/* Fake "typing" indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 opacity-50"
                >
                  <div className="text-2xl">💭</div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <span>Someone is typing</span>
                    <span className="animate-pulse">...</span>
                  </div>
                </motion.div>
              </div>

              {/* Input Area (Locked) */}
              <div className="p-4 border-t border-blue-900/30 bg-black/60">
                <div className="relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Join the conversation... (Click to unlock)"
                    onClick={() => setShowPaywall(true)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 pr-12 cursor-pointer"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all"
                  >
                    <Lock size={18} className="text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  🔒 Request access to join this discussion
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a discussion to view</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Access Request Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaywall(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-blue-950 to-black border-2 border-blue-600/50 rounded-xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Lock className="mx-auto mb-4 text-blue-400" size={48} />
                <h2 className="text-3xl font-bold text-white mb-2">Join the Brotherhood</h2>
                <p className="text-gray-300">
                  You're seeing real conversations from real men in the Biblical Man community.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-5 mb-6">
                <h3 className="text-lg font-bold text-white mb-3">What You Get:</h3>
                <ul className="space-y-2 text-gray-200 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Access to private community discussions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Connect with men serious about biblical masculinity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Weekly exclusive content & resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Direct line to Adam for guidance</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-black/60 border border-blue-900/50 rounded-lg text-white placeholder-gray-500"
                />
                <button
                  onClick={handleAccessRequest}
                  disabled={!userEmail}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
                >
                  Request Access
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full px-6 py-2 text-gray-400 hover:text-white transition-all"
                >
                  Not now
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                We review all requests within 24 hours. Community is curated.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
