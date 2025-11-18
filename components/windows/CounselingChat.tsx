'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Lock, CheckCircle, Upload, Mic, Shield } from 'lucide-react';
import { ChatMessage } from '@/types';

export default function CounselingChat() {
  const [isPaid, setIsPaid] = useState(false); // In production, check actual payment status
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch('/api/counseling/verify');
        const data = await response.json();
        setIsPaid(data.isPaid);

        if (data.isPaid) {
          // Load existing messages
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Failed to verify payment:', error);
      }
    };

    checkPaymentStatus();
  }, []);

  const handlePayment = async () => {
    // In production, integrate with Stripe/Gumroad
    window.open('https://gumroad.com/biblical-man/private-counseling', '_blank');
    // For demo purposes:
    // setIsPaid(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    try {
      await fetch('/api/counseling/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log('File selected:', file.name);
      // In production, upload to server and add to messages
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In production, implement actual voice recording
  };

  if (!isPaid) {
    return (
      <div className="h-full overflow-auto flex flex-col items-center justify-center bg-gradient-to-br from-cyan-950/20 via-black/60 to-blue-950/20 text-gray-100 p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full my-8"
        >
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-900/50">
              <Lock size={48} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-cyan-100 mb-4">
            Private Counseling with Adam
          </h1>

          {/* Description */}
          <div className="bg-black/40 border border-cyan-900/30 rounded-xl p-6 mb-6 space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Get direct, one-on-one counsel on your toughest challenges. Marriage, parenting,
              spiritual warfare, finances—no topic is off limits.
            </p>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-cyan-900/30">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  Direct message access to Adam
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  Unlimited messages for 30 days
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  Voice notes and file sharing
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  Response within 24 hours
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  100% confidential and private
                </span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-600/50 rounded-xl p-6 mb-6 text-center">
            <div className="text-sm text-gray-400 mb-1">One-Time Payment</div>
            <div className="text-5xl font-bold text-cyan-100 mb-1">$297</div>
            <div className="text-sm text-gray-400">30 Days of Direct Access</div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-white text-lg transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2"
          >
            <Lock size={20} />
            Get Access Now
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Secure payment via Gumroad • 7-day money-back guarantee
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-cyan-950/20 via-black/60 to-blue-950/20 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-cyan-900/30 bg-black/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-cyan-100">Private Counseling</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Active Session</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Access Expires</div>
            <div className="text-sm font-semibold text-cyan-300">23 days remaining</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Shield size={48} className="mx-auto mb-4 text-cyan-600" />
            <p className="text-lg font-semibold text-cyan-300 mb-2">
              Your private counseling session
            </p>
            <p className="text-sm text-gray-400">
              This conversation is completely confidential. Send your first message to begin.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-600/50'
                  : 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/50'
              }`}
            >
              {message.sender === 'adam' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <span className="text-xs font-bold text-cyan-400">Adam</span>
                </div>
              )}
              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-900/30 bg-black/40 space-y-3">
        {/* File Upload & Voice Note Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2 px-4 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/30 rounded-lg text-xs font-semibold text-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <Upload size={14} />
            Upload File
          </button>
          <button
            onClick={toggleRecording}
            className={`flex-1 py-2 px-4 border rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              isRecording
                ? 'bg-red-600/40 border-red-600/50 text-red-200 animate-pulse'
                : 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/30 text-gray-300'
            }`}
          >
            <Mic size={14} />
            {isRecording ? 'Recording...' : 'Voice Note'}
          </button>
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-black/60 border border-cyan-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-600/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
