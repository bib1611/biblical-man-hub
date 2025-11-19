'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Send, Lock, ExternalLink, Clock, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { visitorId, trackEvent } = useAnalytics();

  // Fetch chat threads
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setError(null);
        const response = await fetch('/api/community/chat');
        const data = await response.json();

        if (data.success && data.threads) {
          console.log('📥 Fetched threads:', data.threads.length);
          setThreads(data.threads);
          setOnlineCount(data.onlineCount);

          // Auto-select first thread if none selected
          if (!selectedThread && data.threads.length > 0) {
            console.log('📌 Auto-selecting first thread:', data.threads[0].topic);
            setSelectedThread(data.threads[0]);
          } else if (selectedThread) {
            // Update selected thread with new messages
            const updatedThread = data.threads.find((t: ChatThread) => t.id === selectedThread.id);
            if (updatedThread) {
              setSelectedThread(updatedThread);
            }
          }
        } else {
          setError('No discussions available');
        }
      } catch (err) {
        console.error('❌ Failed to fetch community chat:', err);
        setError('Failed to load discussions');
      } finally {
        setIsLoading(false);
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

    setShowPaywall(false);

    // Show success message
    alert("Access request submitted! We'll review and email you within 24 hours.");
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 items-center justify-center">
        <Loader2 className="animate-spin text-blue-400 mb-4" size={48} />
        <p className="text-gray-400">Loading community discussions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 items-center justify-center p-4">
        <MessageCircle className="text-red-400 mb-4" size={48} />
        <p className="text-red-400 mb-2">{error}</p>
        <p className="text-gray-500 text-sm">Check console for details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-blue-900/30 bg-black/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <MessageCircle className="text-blue-400" size={20} />
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">Biblical Man Community</h2>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                <Users size={12} />
                <span>{onlineCount} members online</span>
              </div>
            </div>
          </div>
          <div className="px-2 md:px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full text-xs text-green-300 font-semibold">
            <span className="animate-pulse">● LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Thread List Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-blue-900/30 bg-black/20 overflow-y-auto max-h-32 md:max-h-full">
          <div className="p-2 border-b border-blue-900/20 bg-blue-950/20">
            <h3 className="text-xs font-bold text-blue-300">Discussions ({threads.length})</h3>
          </div>
          {threads.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No discussions yet
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => {
                  console.log('📌 Selected thread:', thread.topic);
                  setSelectedThread(thread);
                }}
                className={`p-2 md:p-3 border-b border-gray-800/50 cursor-pointer transition-all active:bg-blue-950/50 hover:bg-blue-950/30 ${
                  selectedThread?.id === thread.id ? 'bg-blue-950/40 border-l-2 md:border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-xs font-semibold text-white leading-tight line-clamp-1 md:line-clamp-2">
                    {thread.topic}
                  </h4>
                  {thread.substackPostUrl && (
                    <ExternalLink className="text-blue-400 flex-shrink-0 ml-1" size={10} />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400">
                  <div className="flex items-center gap-0.5">
                    <MessageCircle size={9} />
                    <span>{thread.messageCount}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Users size={9} />
                    <span>{thread.participantCount}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Clock size={9} />
                    <span className="hidden sm:inline">{formatTimeAgo(thread.lastActivity)}</span>
                    <span className="sm:hidden">{formatTimeAgo(thread.lastActivity).replace(' ago', '')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-2 md:p-3 border-b border-blue-900/30 bg-black/40">
                <h3 className="text-xs md:text-sm font-bold text-white mb-1 line-clamp-2">
                  {selectedThread.topic}
                </h3>
                {selectedThread.substackPostUrl && (
                  <a
                    href={selectedThread.substackPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] md:text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink size={10} />
                    <span className="hidden sm:inline">Read full article</span>
                    <span className="sm:hidden">Article</span>
                  </a>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 md:space-y-3">
                {selectedThread.recentMessages && selectedThread.recentMessages.length > 0 ? (
                  selectedThread.recentMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-1.5 md:gap-2"
                    >
                      <div className="text-base md:text-xl flex-shrink-0">{message.personaAvatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                          <span className="font-bold text-white text-[11px] md:text-xs truncate">
                            {message.personaName}
                          </span>
                          <span className="text-[9px] md:text-[10px] text-gray-500 flex-shrink-0">
                            {formatTimeAgo(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-[11px] md:text-xs text-gray-200 leading-snug mb-1 break-words">
                          {message.content}
                        </p>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {message.reactions.map((reaction, idx) => (
                              <button
                                key={idx}
                                className="px-1 md:px-1.5 py-0.5 bg-gray-800/50 active:bg-gray-800 rounded-full text-[10px] flex items-center gap-0.5 transition-all"
                              >
                                <span className="text-xs">{reaction.emoji}</span>
                                <span className="text-gray-400">{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-sm py-8">
                    No messages yet in this discussion
                  </div>
                )}
                <div ref={messagesEndRef} />

                {/* Fake "typing" indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 md:gap-3 opacity-50"
                >
                  <div className="text-xl md:text-2xl">💭</div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs md:text-sm">
                    <span>Someone is typing</span>
                    <span className="animate-pulse">...</span>
                  </div>
                </motion.div>
              </div>

              {/* Input Area (Locked) */}
              <div className="p-3 md:p-4 border-t border-blue-900/30 bg-black/60">
                <div className="relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Join the conversation... (Click to unlock)"
                    onClick={() => setShowPaywall(true)}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-900/50 border border-blue-900/30 rounded-lg text-white placeholder-gray-500 pr-12 cursor-pointer text-sm md:text-base"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all"
                  >
                    <Lock size={16} className="text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  🔒 Request access to join this discussion
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
              <div className="text-center">
                <MessageCircle size={40} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a discussion to view</p>
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
              className="bg-gradient-to-br from-blue-950 to-black border-2 border-blue-600/50 rounded-xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Lock className="mx-auto mb-4 text-blue-400" size={40} />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Join the Brotherhood</h2>
                <p className="text-sm md:text-base text-gray-300">
                  You're seeing real conversations from real men in the Biblical Man community.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 md:p-5 mb-6">
                <h3 className="text-base md:text-lg font-bold text-white mb-3">What You Get:</h3>
                <ul className="space-y-2 text-gray-200 text-xs md:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>Access to private community discussions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>Connect with men serious about biblical masculinity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span>Weekly exclusive content & resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
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
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-black/60 border border-blue-900/50 rounded-lg text-white placeholder-gray-500 text-sm md:text-base"
                />
                <button
                  onClick={handleAccessRequest}
                  disabled={!userEmail}
                  className="w-full px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all text-sm md:text-base"
                >
                  Request Access
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full px-4 md:px-6 py-2 text-gray-400 hover:text-white transition-all text-sm md:text-base"
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
