'use client';

import { motion } from 'framer-motion';
import { BookOpen, Search, Highlighter, StickyNote, Volume2, FileText, Library, HelpCircle, Bookmark } from 'lucide-react';

interface BibleHomeProps {
  onSelectFeature: (feature: 'read' | 'search' | 'notepad' | 'audio' | 'tutorial' | 'bookmarks') => void;
}

const features = [
  {
    id: 'read' as const,
    title: 'Read Bible',
    description: 'Browse all 66 books of the KJV Bible',
    icon: BookOpen,
    color: 'from-red-600 to-red-700',
    hoverColor: 'hover:from-red-700 hover:to-red-800',
    bgGlow: 'bg-red-900/20',
    borderColor: 'border-red-700/30',
  },
  {
    id: 'search' as const,
    title: 'Search Scriptures',
    description: 'Find any word or phrase across the Bible',
    icon: Search,
    color: 'from-blue-600 to-blue-700',
    hoverColor: 'hover:from-blue-700 hover:to-blue-800',
    bgGlow: 'bg-blue-900/20',
    borderColor: 'border-blue-700/30',
  },
  {
    id: 'notepad' as const,
    title: 'Study Notepad',
    description: 'Write notes, outlines, and study plans',
    icon: FileText,
    color: 'from-green-600 to-green-700',
    hoverColor: 'hover:from-green-700 hover:to-green-800',
    bgGlow: 'bg-green-900/20',
    borderColor: 'border-green-700/30',
  },
  {
    id: 'audio' as const,
    title: 'Audio Library',
    description: 'Full Scourby YouTube channel + all 66 books',
    icon: Volume2,
    color: 'from-amber-600 to-amber-700',
    hoverColor: 'hover:from-amber-700 hover:to-amber-800',
    bgGlow: 'bg-amber-900/20',
    borderColor: 'border-amber-700/30',
  },
  {
    id: 'bookmarks' as const,
    title: 'My Bookmarks',
    description: 'View saved chapters and favorite verses',
    icon: Bookmark,
    color: 'from-purple-600 to-purple-700',
    hoverColor: 'hover:from-purple-700 hover:to-purple-800',
    bgGlow: 'bg-purple-900/20',
    borderColor: 'border-purple-700/30',
  },
  {
    id: 'tutorial' as const,
    title: 'Tutorial',
    description: 'Learn how to use all features',
    icon: HelpCircle,
    color: 'from-gray-600 to-gray-700',
    hoverColor: 'hover:from-gray-700 hover:to-gray-800',
    bgGlow: 'bg-gray-900/20',
    borderColor: 'border-gray-700/30',
  },
];

export default function BibleHome({ onSelectFeature }: BibleHomeProps) {
  return (
    <div className="h-full flex flex-col bg-black/60 text-gray-100 overflow-auto">
      {/* Header */}
      <div className="flex-shrink-0 p-8 text-center border-b border-red-900/30 bg-gradient-to-b from-red-950/20 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/50">
              <BookOpen className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-red-100 mb-3">
            KJV Bible Study
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your complete King James Bible study tool with powerful features for deep Scripture engagement
          </p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="flex-shrink-0 px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gradient-to-br from-red-900/20 to-black border border-red-700/30 rounded-lg text-center"
        >
          <div className="text-3xl font-bold text-red-400">66</div>
          <div className="text-sm text-gray-400">Books</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-blue-900/20 to-black border border-blue-700/30 rounded-lg text-center"
        >
          <div className="text-3xl font-bold text-blue-400">1,189</div>
          <div className="text-sm text-gray-400">Chapters</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-green-900/20 to-black border border-green-700/30 rounded-lg text-center"
        >
          <div className="text-3xl font-bold text-green-400">31,102</div>
          <div className="text-sm text-gray-400">Verses</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-gradient-to-br from-amber-900/20 to-black border border-amber-700/30 rounded-lg text-center"
        >
          <div className="text-3xl font-bold text-amber-400">5</div>
          <div className="text-sm text-gray-400">Colors</div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="flex-1 px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">Choose a Feature to Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectFeature(feature.id)}
                className={`group relative p-6 ${feature.bgGlow} border ${feature.borderColor} rounded-xl text-left transition-all hover:scale-105 hover:shadow-xl`}
              >
                {/* Icon */}
                <div className={`mb-4 inline-block p-3 bg-gradient-to-br ${feature.color} ${feature.hoverColor} rounded-lg transition-all group-hover:scale-110`}>
                  <Icon className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-gradient-to-r bg-clip-text text-transparent ${feature.color}">
                    Open →
                  </span>
                </div>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer Tips */}
      <div className="flex-shrink-0 p-6 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-bold text-gray-400 mb-3">💡 Quick Tips:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-500">
            <div className="flex items-start gap-2">
              <span className="text-red-500">✓</span>
              <span>Press Enter in search to find verses instantly</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-500">✓</span>
              <span>Hover over verses to highlight, note, and copy</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">✓</span>
              <span>All your notes and highlights are auto-saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
