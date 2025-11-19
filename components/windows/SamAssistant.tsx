'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Sparkles, Phone, RotateCcw } from 'lucide-react';
import { ChatMessage } from '@/types';

export default function SamAssistant() {
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

      // Fetch the AI response
      const response = await fetch('/api/sam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-400">Chat with Sam</h2>
              <p className="text-xs text-gray-400">Your Personal Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
    </div>
  );
}
