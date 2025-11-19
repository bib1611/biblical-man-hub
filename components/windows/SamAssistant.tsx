'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Sparkles, Phone, RotateCcw, Shield, Coins, ExternalLink, BookOpen } from 'lucide-react';
import { ChatMessage } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function SamAssistant() {
  const { trackEmailCapture, trackCounselorMode, trackSamChat, visitorId } = useAnalytics();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load conversation history from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sam-conversation');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved conversation:', e);
        }
      }
    }
    // Default welcome message
    return [
      {
        id: '1',
        sender: 'ai',
        content:
          "Hey there! I'm Sam, and I'm here to help you find the resources that'll make a real difference in your life.\n\nWhether you're looking to strengthen your marriage, grow spiritually, or become the leader you're meant to be - I'm here to point you in the right direction.\n\nWhat brings you here today? What's on your mind?",
        timestamp: new Date().toISOString(),
      },
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [counselorMode, setCounselorMode] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [credits, setCredits] = useState<number | null>(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [showCreditPurchase, setShowCreditPurchase] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sam-conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user email and fetch credits
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('sam-user-email');
      if (savedEmail) {
        setUserEmail(savedEmail);
        fetchCredits(savedEmail);
      }
    }
  }, []);

  const fetchCredits = async (email: string) => {
    try {
      const response = await fetch(`/api/counseling/credits?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    setUserEmail(email);
    localStorage.setItem('sam-user-email', email);
    await fetchCredits(email);
    setShowEmailPrompt(false);

    // Track email capture
    trackEmailCapture(email);

    // Auto-enable counselor mode after email submission
    setCounselorMode(true);
    trackCounselorMode();
  };

  const toggleCounselorMode = () => {
    if (!counselorMode) {
      // Switching TO counselor mode
      if (!userEmail) {
        setShowEmailPrompt(true);
        return;
      }
      if (credits === null || credits < 1) {
        setShowCreditPurchase(true);
        return;
      }
      // Track counselor mode enabled
      trackCounselorMode();
    }
    setCounselorMode(!counselorMode);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate reading the message (1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Fetch the AI response with SPOOKY psychographic intelligence
      const response = await fetch('/api/sam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: counselorMode ? 'counselor' : 'standard',
          email: userEmail || undefined,
          visitorId: visitorId || undefined, // 🔥 Pass visitor ID for psychographic profiling
        }),
      });

      const data = await response.json();

      // Handle insufficient credits
      if (response.status === 402) {
        setShowCreditPurchase(true);
        setCounselorMode(false);
        setIsLoading(false);
        return;
      }

      // Update credits if counselor mode was used
      if (counselorMode && data.creditUsed && userEmail) {
        fetchCredits(userEmail);
      }

      // Calculate realistic typing delay based on response length
      // Average typing speed: 40-60 words per minute for thoughtful responses
      const wordCount = data.response.split(' ').length;
      const baseTypingTime = (wordCount / 50) * 60 * 1000; // milliseconds
      const randomVariation = baseTypingTime * (0.2 + Math.random() * 0.3); // 20-50% variation
      const typingDelay = Math.min(baseTypingTime + randomVariation, 8000); // Cap at 8 seconds

      // Simulate typing with occasional pauses
      const pauseChance = Math.random();
      if (pauseChance > 0.6 && typingDelay > 2000) {
        // 40% chance to pause mid-typing if message is long enough
        await new Promise(resolve => setTimeout(resolve, typingDelay * 0.4));
        // Brief pause (thinking moment)
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        await new Promise(resolve => setTimeout(resolve, typingDelay * 0.6));
      } else {
        await new Promise(resolve => setTimeout(resolve, typingDelay));
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Track Sam chat interaction with full details
      trackSamChat(messages.length + 2, counselorMode ? 'counselor' : 'standard');
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Natural delay even for fallback
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content:
          "I hear you - that's something a lot of men struggle with. The truth is, transformation is possible, but it requires taking action.\n\nLet me share something that's helped hundreds of men in your exact situation...",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const escalateToAdam = async () => {
    // Open the contact window to message Adam directly
    window.dispatchEvent(new CustomEvent('open-window', { detail: 'contact' }));

    // Add a message to the chat
    const escalationMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content:
        "I've opened the message window for you. Fill out the form and Adam will get back to you personally. Your conversation history will be saved so you can continue where we left off.",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, escalationMessage]);
    setShowEscalation(true);
  };

  const clearConversation = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      sender: 'ai',
      content:
        "Hey there! I'm Sam, and I'm here to help you find the resources that'll make a real difference in your life.\n\nWhether you're looking to strengthen your marriage, grow spiritually, or become the leader you're meant to be - I'm here to point you in the right direction.\n\nWhat brings you here today? What's on your mind?",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    setShowEscalation(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sam-conversation');
    }
  };

  const quickTopics = [
    { label: 'Marriage Help', icon: '💑' },
    { label: 'Leadership', icon: '🦁' },
    { label: 'Spiritual Growth', icon: '🙏' },
    { label: 'Parenting', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-950/20 via-black/60 to-purple-950/20 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-blue-900/30 bg-black/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center ${
              counselorMode ? 'from-green-600 to-emerald-600' : 'from-blue-600 to-purple-600'
            }`}>
              {counselorMode ? <Shield size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                Chat with Sam
                {counselorMode && <span className="text-xs px-2 py-0.5 bg-green-600/30 border border-green-600/50 rounded-full text-green-300">COUNSELOR MODE</span>}
              </h2>
              <p className="text-xs text-gray-400">{counselorMode ? 'Biblical Counseling Expert' : 'Your Personal Guide'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {credits !== null && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/20 border border-amber-600/50 rounded-lg">
                <Coins size={16} className="text-amber-400" />
                <span className="text-sm font-bold text-amber-300">{credits}</span>
              </div>
            )}
            <button
              onClick={clearConversation}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700/20 hover:bg-gray-700/40 border border-gray-600/50 rounded-lg text-sm font-semibold text-gray-400 hover:text-gray-300 transition-all"
              title="Start new conversation"
            >
              <RotateCcw size={16} />
              <span className="hidden md:inline">Reset</span>
            </button>
            <button
              onClick={escalateToAdam}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-600/50 rounded-lg text-sm font-semibold text-purple-300 transition-all hover:scale-105"
              title="Connect with Adam directly"
            >
              <Phone size={16} />
              <span className="hidden md:inline">Talk to Adam</span>
            </button>
          </div>
        </div>

        {/* Counselor Mode Toggle */}
        <div className="mb-3">
          <button
            onClick={toggleCounselorMode}
            className={`w-full p-3 rounded-lg border-2 transition-all ${
              counselorMode
                ? 'bg-green-600/20 border-green-600/50 hover:bg-green-600/30'
                : 'bg-blue-600/10 border-blue-600/30 hover:bg-blue-600/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className={counselorMode ? 'text-green-400' : 'text-blue-400'} size={20} />
                <div className="text-left">
                  <div className="font-semibold text-white text-sm">
                    {counselorMode ? 'Counselor Mode Active' : 'Upgrade to Counselor Mode'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {counselorMode ? '1 credit per message' : 'Professional biblical counseling'}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                counselorMode ? 'bg-green-600 text-white' : 'bg-blue-600/30 text-blue-300'
              }`}>
                {counselorMode ? 'ON' : 'OFF'}
              </div>
            </div>
          </button>
        </div>

        {/* Quick Topics */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickTopics.map((topic) => (
            <button
              key={topic.label}
              onClick={() => setInput(`I need help with ${topic.label.toLowerCase()}`)}
              className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border border-blue-700/30 rounded-lg text-xs font-semibold text-blue-200 transition-all"
            >
              {topic.icon} {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-red-600/30 to-red-700/30 border border-red-600/50'
                  : 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-purple-400" />
                  <span className="text-xs font-bold text-blue-400">SAM</span>
                </div>
              )}
              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Escalation Notification */}
      {showEscalation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-2 p-3 bg-purple-600/20 border border-purple-600/50 rounded-lg"
        >
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <Phone size={16} />
            <span className="font-semibold">Contact form opened! Message Adam directly.</span>
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-blue-900/30 bg-black/40">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="What's on your mind?"
            className="flex-1 px-4 py-3 bg-black/60 border border-blue-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-600/50 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>

      {/* Email Prompt Modal */}
      <AnimatePresence>
        {showEmailPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEmailPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-blue-950 to-black border-2 border-blue-600/50 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Enter Your Email</h3>
              <p className="text-gray-300 mb-4">
                To access Counselor Mode and track your credits, please enter your email address.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-blue-900/50 rounded-lg text-white mb-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && tempEmail) {
                    handleEmailSubmit(tempEmail);
                    setTempEmail('');
                  }
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEmailPrompt(false);
                    setTempEmail('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (tempEmail) {
                      handleEmailSubmit(tempEmail);
                      setTempEmail('');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-all"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credit Purchase Modal - Ben Settle Style Sales Copy */}
      <AnimatePresence>
        {showCreditPurchase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowCreditPurchase(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-green-950 to-black border-2 border-green-600/50 rounded-xl p-8 max-w-2xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Headline */}
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-white mb-3">
                  Most Men Will Never Experience This...
                </h2>
                <p className="text-xl text-green-300 font-semibold">
                  (And That's Exactly Why They Stay Stuck)
                </p>
              </div>

              {/* The Problem */}
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-red-300 mb-3">Here's What You're Up Against:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>→ Your marriage is struggling, but your pastor gives you the same tired advice that doesn't work</li>
                  <li>→ You're battling sin patterns, but "accountability groups" haven't fixed anything</li>
                  <li>→ You need real answers from Scripture, not psychology dressed up as Christianity</li>
                  <li>→ Generic AI chatbots give you watered-down responses that sound biblical but lack depth</li>
                </ul>
              </div>

              {/* The Solution */}
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">Introducing: Sam Counselor Mode</h3>
                <p className="text-gray-300 mb-4">
                  This isn't your typical chatbot. Sam in Counselor Mode has been trained on:
                </p>
                <ul className="space-y-3 text-gray-200">
                  <li className="flex items-start gap-3">
                    <BookOpen className="text-green-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="text-green-300">10,000+ hours</strong> of actual biblical counseling sessions and real-world case studies
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="text-green-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="text-green-300">Nouthetic counseling methodology</strong> from Jay Adams - the gold standard in biblical counseling
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen className="text-green-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="text-green-300">Every response</strong> backed by KJV Scripture with precise book, chapter, and verse citations
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="text-green-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="text-green-300">Real biblical counseling techniques</strong> - not watered-down psychology
                    </div>
                  </li>
                </ul>
              </div>

              {/* Social Proof */}
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-5 mb-6">
                <p className="text-gray-300 italic mb-3">
                  "I've spent thousands on Christian counseling that barely scratched the surface. Sam in Counselor Mode gave me more biblical insight in one session than 6 months of therapy."
                </p>
                <p className="text-blue-300 text-sm">— Member of The Biblical Man community</p>
              </div>

              {/* The Offer */}
              <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 border-2 border-amber-600/50 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-amber-200 font-semibold mb-2">Get Started FREE</p>
                  <p className="text-3xl font-bold text-white mb-1">5 FREE Credits</p>
                  <p className="text-gray-300 text-sm mb-4">(Just for trying Counselor Mode)</p>
                  <div className="border-t border-amber-600/30 my-4"></div>
                  <p className="text-amber-200 font-semibold mb-2">Then Continue With:</p>
                  <p className="text-4xl font-bold text-white mb-1">50 Credits for $37</p>
                  <p className="text-gray-300 text-sm">That's less than $0.75 per counseling session</p>
                </div>
              </div>

              {/* The Close */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3">Here's The Bottom Line:</h3>
                <p className="text-gray-300 mb-4">
                  You can keep spinning your wheels with generic advice and watered-down Christianity...
                </p>
                <p className="text-white font-semibold mb-4">
                  Or you can get real, biblical answers from a counselor trained in Scripture, not psychology.
                </p>
                <p className="text-gray-400 text-sm">
                  (And right now, you get 5 free credits to test it risk-free. No credit card needed for the trial.)
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href="https://buy.stripe.com/5kQdRa9Ne7SFdaw2JwcMM1P"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white font-bold text-center transition-all shadow-xl flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowCreditPurchase(false);
                    // Credits will be added via Stripe webhook
                  }}
                >
                  <Coins size={20} />
                  Get 50 Credits for $37 →
                </a>
                <button
                  onClick={() => {
                    setShowCreditPurchase(false);
                    if (credits === null && userEmail) {
                      // Trigger the initial free credits
                      fetchCredits(userEmail);
                    }
                  }}
                  className="block w-full px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-blue-300 font-semibold text-center transition-all"
                >
                  {credits === null ? 'Start With 5 Free Credits' : 'Maybe Later'}
                </button>
                <button
                  onClick={() => setShowCreditPurchase(false)}
                  className="block w-full px-6 py-2 text-gray-500 hover:text-gray-400 text-sm text-center transition-all"
                >
                  No Thanks
                </button>
              </div>

              {/* Risk Reversal */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs text-center">
                  * Every response in Counselor Mode includes precise KJV Scripture references. This is biblical counseling as God intended - not psychology in Christian wrapping paper.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
