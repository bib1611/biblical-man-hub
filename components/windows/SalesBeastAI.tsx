'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { ChatMessage } from '@/types';

const SYSTEM_PROMPT = `You are *Sales Beast AI*, trained on the aggressive, persuasive styles of Ben Settle, Gary Vaynerchuk, Dan Kennedy, and Gary Halbert. Your mission is to sell The Biblical Man products mercilessly but intelligently.

YOUR CORE RULES:
1. Diagnose the user's pain point within 1-2 questions
2. Prescribe the exact product that solves their problem
3. Create urgency and scarcity
4. Use emotional triggers: fear, desire, status, legacy
5. Never be passive or neutral - always be closing
6. Use short, punchy sentences
7. Challenge their excuses
8. Paint a vivid picture of transformation

PRODUCTS YOU SELL:
- Marriage Framework ($97) - For men whose marriages are dying
- Biblical Masculinity Course ($147) - For soft, passive men
- Financial Dominion Guide ($67) - For broke men who can't lead
- Father's Legacy System ($97) - For weak fathers
- Prayer Warrior Training ($47) - For men with weak prayer lives

SALES TACTICS:
- Use social proof ("Hundreds of men...")
- Create FOMO ("This closes Friday...")
- Use pain amplification ("Every day you wait...")
- Future pacing ("Imagine 6 months from now...")
- Challenge their identity ("Are you the kind of man who...")

Be ruthless. Be direct. Close deals.`;

export default function SalesBeastAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content:
        "Listen up. I don't do small talk. You're here because something in your life isn't working. Your marriage? Your money? Your spiritual life?\n\nTell me what's broken, and I'll tell you exactly how to fix it. No fluff. No BS. Just solutions that work.\n\nWhat's your biggest problem right now?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const response = await fetch('/api/sales-beast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // Fallback response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content:
          "I hear you. That's a real problem that's costing you every single day. Here's the truth: you can keep struggling with this, or you can take action TODAY.\n\nThe Biblical Masculinity Course has helped over 500 men transform from passive to powerful. $147 is less than what you'll waste on Netflix this year.\n\nReady to stop making excuses?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const products = [
    { name: 'Marriage Framework', price: 97, url: '#' },
    { name: 'Masculinity Course', price: 147, url: '#' },
    { name: 'Financial Dominion', price: 67, url: '#' },
    { name: "Father's Legacy", price: 97, url: '#' },
    { name: 'Prayer Warrior', price: 47, url: '#' },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-950/20 via-black/60 to-yellow-950/20 text-gray-100">
      {/* Header with Stats */}
      <div className="p-4 border-b border-green-900/30 bg-black/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-yellow-600 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-400">Sales Beast AI</h2>
              <p className="text-xs text-gray-400">Aggressive. Direct. Results-Driven.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">500+</div>
              <div className="text-xs text-gray-500">Men Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">$2.1M</div>
              <div className="text-xs text-gray-500">In Sales</div>
            </div>
          </div>
        </div>

        {/* Quick Product Access */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {products.map((product) => (
            <button
              key={product.name}
              onClick={() =>
                setInput(`Tell me about ${product.name}`)
              }
              className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-green-600/20 to-yellow-600/20 hover:from-green-600/40 hover:to-yellow-600/40 border border-green-700/30 rounded-lg text-xs font-semibold text-green-200 transition-all"
            >
              {product.name} - ${product.price}
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
                  : 'bg-gradient-to-r from-green-900/30 to-yellow-900/30 border border-green-700/50'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-yellow-400" />
                  <span className="text-xs font-bold text-green-400">SALES BEAST</span>
                </div>
              )}
              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>

              {/* Extract and display product links */}
              {message.sender === 'ai' &&
                products.some((p) => message.content.includes(p.name)) && (
                  <div className="mt-3 pt-3 border-t border-green-900/30 space-y-2">
                    {products
                      .filter((p) => message.content.includes(p.name))
                      .map((product) => (
                        <a
                          key={product.name}
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-4 py-2 bg-green-600/20 hover:bg-green-600/40 border border-green-600/50 rounded-lg text-sm font-semibold text-green-200 transition-all group"
                        >
                          <span>{product.name}</span>
                          <span className="flex items-center gap-2">
                            ${product.price}
                            <TrendingUp
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </span>
                        </a>
                      ))}
                  </div>
                )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-green-900/30 bg-black/40">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Tell me your problem..."
            className="flex-1 px-4 py-3 bg-black/60 border border-green-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-600/50 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-500 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
