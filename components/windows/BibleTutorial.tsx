'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen, Search, Highlighter, StickyNote, Bookmark, Volume2, FileText, Copy } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome to KJV Bible Study',
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 text-lg">
          Your complete King James Bible study tool with powerful features for deep Scripture engagement.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-red-900/20 rounded-lg border border-red-700/30">
            <h4 className="font-bold text-red-300 mb-2">📖 Complete KJV</h4>
            <p className="text-sm text-gray-400">All 66 books, every verse</p>
          </div>
          <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
            <h4 className="font-bold text-yellow-300 mb-2">🎨 Highlights</h4>
            <p className="text-sm text-gray-400">5 color options</p>
          </div>
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <h4 className="font-bold text-blue-300 mb-2">📝 Notes</h4>
            <p className="text-sm text-gray-400">Personal & verse notes</p>
          </div>
          <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/30">
            <h4 className="font-bold text-green-300 mb-2">🎧 Audio</h4>
            <p className="text-sm text-gray-400">Scourby narration</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Navigation Basics',
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">Navigate through the Bible with ease:</p>
        <div className="space-y-3">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h4 className="font-bold text-red-200">Book List (Left Sidebar)</h4>
              <p className="text-sm text-gray-400">Click any book name to jump to that book. Starts at chapter 1.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔢</span>
            </div>
            <div>
              <h4 className="font-bold text-red-200">Chapter Buttons (Top Bar)</h4>
              <p className="text-sm text-gray-400">First 20 chapters shown as buttons. Use dropdown for chapter 21+.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bookmark className="text-red-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-red-200">Bookmarks</h4>
              <p className="text-sm text-gray-400">Save your place with the "Bookmark Chapter" button at bottom of sidebar.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Search the Scriptures',
    icon: Search,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">Find any word or phrase across the entire Bible:</p>
        <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Search className="text-gray-400" size={16} />
            <span className="text-sm text-gray-400">Example: Type "faith" and press Enter</span>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <div className="flex gap-3 items-start">
            <div className="text-2xl">✨</div>
            <div>
              <h4 className="font-bold text-blue-200">Full-Bible Search</h4>
              <p className="text-sm text-gray-400">Results show book, chapter, and verse reference</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="text-2xl">🎯</div>
            <div>
              <h4 className="font-bold text-blue-200">Navigate to Context</h4>
              <p className="text-sm text-gray-400">Click "Go to Chapter" on any result to read full chapter</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="text-2xl">🔍</div>
            <div>
              <h4 className="font-bold text-blue-200">Clear Search</h4>
              <p className="text-sm text-gray-400">Use "Clear Search" button to return to normal reading</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Highlight Verses',
    icon: Highlighter,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">Mark important verses with 5 color-coded highlights:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-yellow-500/20 border border-yellow-700/30 rounded-lg">
            <div className="w-6 h-6 bg-yellow-600/40 rounded"></div>
            <div>
              <span className="font-bold text-yellow-300">Yellow</span>
              <span className="text-sm text-gray-400 ml-2">- General highlights</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-500/20 border border-green-700/30 rounded-lg">
            <div className="w-6 h-6 bg-green-600/40 rounded"></div>
            <div>
              <span className="font-bold text-green-300">Green</span>
              <span className="text-sm text-gray-400 ml-2">- Promises & encouragement</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-500/20 border border-blue-700/30 rounded-lg">
            <div className="w-6 h-6 bg-blue-600/40 rounded"></div>
            <div>
              <span className="font-bold text-blue-300">Blue</span>
              <span className="text-sm text-gray-400 ml-2">- Doctrine & teaching</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-500/20 border border-red-700/30 rounded-lg">
            <div className="w-6 h-6 bg-red-600/40 rounded"></div>
            <div>
              <span className="font-bold text-red-300">Red</span>
              <span className="text-sm text-gray-400 ml-2">- Warnings & commands</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-500/20 border border-purple-700/30 rounded-lg">
            <div className="w-6 h-6 bg-purple-600/40 rounded"></div>
            <div>
              <span className="font-bold text-purple-300">Purple</span>
              <span className="text-sm text-gray-400 ml-2">- Prayer verses</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 italic mt-4">
          💡 Hover over any verse → Click "Highlight" → Choose color
        </p>
      </div>
    ),
  },
  {
    title: 'Notes & Notepad',
    icon: StickyNote,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">Two types of notes for your study:</p>
        <div className="space-y-3">
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <div className="flex items-start gap-3">
              <StickyNote className="text-blue-400 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-blue-200 mb-2">Verse Notes</h4>
                <p className="text-sm text-gray-400">
                  Click "Note" button on any verse to add personal commentary. Notes appear below the verse.
                </p>
                <p className="text-xs text-gray-500 mt-2">Perfect for: insights, cross-references, sermon notes</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/30">
            <div className="flex items-start gap-3">
              <FileText className="text-green-400 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-green-200 mb-2">Study Notepad</h4>
                <p className="text-sm text-gray-400">
                  Click "Notepad" button (top right) for a general notepad. Great for study outlines, prayers, and summaries.
                </p>
                <p className="text-xs text-gray-500 mt-2">Perfect for: topical studies, sermon prep, journaling</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 italic">
          ✅ All notes are saved automatically to your browser
        </p>
      </div>
    ),
  },
  {
    title: 'Copy & Share Verses',
    icon: Copy,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">Copy verses in multiple formats:</p>
        <div className="space-y-3">
          <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
            <h4 className="font-bold text-gray-200 mb-1">📋 Plain Text</h4>
            <p className="text-xs text-gray-400 font-mono">
              For God so loved the world... (John 3:16)
            </p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
            <h4 className="font-bold text-gray-200 mb-1">📖 Formatted</h4>
            <p className="text-xs text-gray-400 font-mono">
              "For God so loved the world..." - John 3:16 (KJV)
            </p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
            <h4 className="font-bold text-gray-200 mb-1">🔗 Reference Only</h4>
            <p className="text-xs text-gray-400 font-mono">
              John 3:16
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          💡 Hover over verse → Click "Copy" → Choose format
        </p>
        <p className="text-xs text-gray-500 italic">
          Select multiple verses by highlighting them, then use "Copy Selection" button
        </p>
      </div>
    ),
  },
  {
    title: 'Alexander Scourby Audio',
    icon: Volume2,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">Listen to the KJV Bible read by Alexander Scourby:</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Volume2 className="text-amber-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-amber-200">Embedded Player</h4>
              <p className="text-sm text-gray-400">
                Click "Play Scourby Audio" when reading select books (Genesis, Psalms, Matthew, etc.)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h4 className="font-bold text-amber-200">Full Audio Library</h4>
              <p className="text-sm text-gray-400">
                Click "Audio Library" button for direct links to all 66 books on YouTube
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-700/30 mt-4">
          <p className="text-sm text-amber-200">
            <strong>Pro Tip:</strong> Open Audio Library in a new tab and listen while reading in the app
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'You\'re Ready!',
    icon: BookOpen,
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-2xl font-bold text-red-200">Start Your Bible Study Journey</h3>
        <p className="text-gray-300 text-lg">
          Everything you need to dive deep into God's Word is at your fingertips.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6 text-left">
          <div className="p-3 bg-gray-800/40 rounded-lg">
            <h4 className="font-bold text-red-300 text-sm mb-1">✅ Search</h4>
            <p className="text-xs text-gray-400">Find any verse instantly</p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg">
            <h4 className="font-bold text-yellow-300 text-sm mb-1">✅ Highlight</h4>
            <p className="text-xs text-gray-400">5 color options</p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg">
            <h4 className="font-bold text-blue-300 text-sm mb-1">✅ Notes</h4>
            <p className="text-xs text-gray-400">Verse & general notes</p>
          </div>
          <div className="p-3 bg-gray-800/40 rounded-lg">
            <h4 className="font-bold text-green-300 text-sm mb-1">✅ Copy</h4>
            <p className="text-xs text-gray-400">Multiple formats</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-6 italic">
          💡 Click "?" button anytime to replay this tutorial
        </p>
      </div>
    ),
  },
];

export default function BibleTutorial({ onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/40 to-red-950/40 px-6 py-4 border-b border-red-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600/30 rounded-lg flex items-center justify-center">
              <Icon className="text-red-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-100">{step.title}</h2>
              <p className="text-xs text-gray-400">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-600/20 transition-colors"
          >
            <X className="text-gray-400 hover:text-red-400" size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-red-700"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-red-600' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold transition-colors"
          >
            <span>{currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
