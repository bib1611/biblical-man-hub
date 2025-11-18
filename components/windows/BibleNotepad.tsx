'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, FileText, Trash2 } from 'lucide-react';

interface NotepadProps {
  onClose: () => void;
}

export default function BibleNotepad({ onClose }: NotepadProps) {
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // Load saved notepad content
    const saved = localStorage.getItem('bible-notepad');
    if (saved) {
      setContent(saved);
      const savedTime = localStorage.getItem('bible-notepad-time');
      if (savedTime) {
        setLastSaved(new Date(savedTime));
      }
    }
  }, []);

  useEffect(() => {
    // Auto-save after 2 seconds of no typing
    const timer = setTimeout(() => {
      if (!isSaved && content) {
        saveNotes();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, isSaved]);

  const saveNotes = () => {
    localStorage.setItem('bible-notepad', content);
    const now = new Date();
    localStorage.setItem('bible-notepad-time', now.toISOString());
    setLastSaved(now);
    setIsSaved(true);
  };

  const handleChange = (value: string) => {
    setContent(value);
    setIsSaved(false);
  };

  const clearNotes = () => {
    if (confirm('Are you sure you want to clear all notes? This cannot be undone.')) {
      setContent('');
      localStorage.removeItem('bible-notepad');
      localStorage.removeItem('bible-notepad-time');
      setLastSaved(null);
      setIsSaved(true);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;

    return lastSaved.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-blue-900/30 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/40 to-blue-950/40 px-6 py-4 border-b border-blue-900/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/30 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-100">Study Notepad</h2>
              <p className="text-xs text-gray-400">
                {isSaved ? (
                  <>
                    <span className="text-green-400">✓ Saved</span> · Last: {formatLastSaved()}
                  </>
                ) : (
                  <span className="text-yellow-400">● Unsaved changes...</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveNotes}
              disabled={isSaved}
              className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 disabled:bg-gray-700/20 disabled:text-gray-500 text-green-300 rounded-lg text-sm transition-colors"
              title="Save notes"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={clearNotes}
              className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg text-sm transition-colors"
              title="Clear all notes"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-600/20 transition-colors"
            >
              <X className="text-gray-400 hover:text-blue-400" size={20} />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-3 bg-blue-900/10 border-b border-blue-900/20 flex-shrink-0">
          <p className="text-sm text-gray-400">
            💡 <strong>Pro Tip:</strong> Use this notepad for sermon outlines, topical studies, prayer lists, or general Bible study notes. Auto-saves every 2 seconds.
          </p>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Start typing your Bible study notes here...

Examples:
• Topical study on faith
• Sermon outline
• Prayer requests
• Cross-references
• Personal reflections
• Study questions"
            className="flex-1 w-full bg-black/40 border border-blue-900/30 rounded-lg p-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-600/50 resize-none font-mono text-sm leading-relaxed"
            style={{ minHeight: '400px' }}
          />

          {/* Character Count */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div>
              {content.split('\n').length} lines · {content.split(/\s+/).filter(w => w.length > 0).length} words · {content.length} characters
            </div>
            <div>
              {isSaved ? (
                <span className="text-green-500">✓ All changes saved</span>
              ) : (
                <span className="text-yellow-500">● Saving...</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-gray-500">
            Notes are saved to your browser's local storage
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
