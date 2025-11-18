'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-950/20 via-black/60 to-red-950/20 text-gray-100 p-8 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full mb-4 shadow-lg shadow-orange-900/50">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-orange-100 mb-2">Message Adam</h1>
          <p className="text-sm text-gray-400">
            Have a question? Want to share your story? Send a message below.
          </p>
        </div>

        {/* Success Message */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-900/20 border border-green-600/50 rounded-lg flex items-start gap-3"
          >
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-300">Message sent successfully!</p>
              <p className="text-xs text-gray-400 mt-1">
                I'll get back to you as soon as possible.
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-600/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">Failed to send message</p>
              <p className="text-xs text-gray-400 mt-1">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/60 border border-orange-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-600/50 transition-colors"
              placeholder="John Smith"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/60 border border-orange-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-600/50 transition-colors"
              placeholder="john@example.com"
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/60 border border-orange-900/30 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-orange-600/50 transition-colors"
            >
              <option value="">Select a subject...</option>
              <option value="general">General Question</option>
              <option value="marriage">Marriage Question</option>
              <option value="parenting">Parenting Question</option>
              <option value="spiritual">Spiritual Question</option>
              <option value="product">Product Support</option>
              <option value="speaking">Speaking Request</option>
              <option value="collaboration">Collaboration</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-black/60 border border-orange-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-600/50 transition-colors resize-none"
              placeholder="Your message..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-bold text-white transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Message
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-black/40 border border-orange-900/30 rounded-lg">
          <h3 className="text-sm font-bold text-orange-200 mb-2">Response Time</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            I personally read every message. Due to volume, I may not be able to respond to
            everyone, but I appreciate you taking the time to reach out.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
