'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, ExternalLink, Search } from 'lucide-react';
import { bibleBooks } from '@/lib/data/bible-books';

interface AudioLibraryProps {
  onClose: () => void;
}

// Complete Alexander Scourby KJV Audio Bible YouTube playlist/video mapping
// Using the working playlist from @ScourbyYouBible
const scourbyAudioComplete: Record<string, { url: string; playlist?: boolean }> = {
  // Old Testament
  'Genesis': { url: 'https://youtu.be/z1_5MGP2WjM' },
  'Exodus': { url: 'https://youtu.be/mToNd75wAHk' },
  'Leviticus': { url: 'https://youtu.be/lYclZH5cY5o' },
  'Numbers': { url: 'https://youtu.be/FQxeypPHv-I' },
  'Deuteronomy': { url: 'https://youtu.be/xdAUwT90u34' },
  'Joshua': { url: 'https://youtu.be/CwbmhGH2AjA' },
  'Judges': { url: 'https://youtu.be/LmPHbFI0n7I' },
  'Ruth': { url: 'https://youtu.be/lq00tBJDoc0' },
  '1 Samuel': { url: 'https://youtu.be/zNkBH_1VoYc' },
  '2 Samuel': { url: 'https://youtu.be/oT0AMKbISMQ' },
  '1 Kings': { url: 'https://youtu.be/xoJEfbB7Few' },
  '2 Kings': { url: 'https://youtu.be/DGtGvGYgT6I' },
  '1 Chronicles': { url: 'https://youtu.be/lKCvlPP2phs' },
  '2 Chronicles': { url: 'https://youtu.be/Vy59nHT5ZbE' },
  'Ezra': { url: 'https://youtu.be/Qm_Xwfx-ry4' },
  'Nehemiah': { url: 'https://youtu.be/tAMufhLPjd0' },
  'Esther': { url: 'https://youtu.be/P5fJU5d9SrA' },
  'Job': { url: 'https://youtu.be/oXh_aUMadMg' },
  'Psalms': { url: 'https://youtu.be/1R1LkKWUZd8' },
  'Proverbs': { url: 'https://youtu.be/rIeVGJOskAE' },
  'Ecclesiastes': { url: 'https://youtu.be/gD4yhBPiqg8' },
  'Song of Solomon': { url: 'https://youtu.be/JZFpMr-H9Cc' },
  'Isaiah': { url: 'https://youtu.be/MgI1PDxRGuY' },
  'Jeremiah': { url: 'https://youtu.be/C8S1X8xNLhA' },
  'Lamentations': { url: 'https://youtu.be/oU9LmVr4684' },
  'Ezekiel': { url: 'https://youtu.be/ybJwp-bRseY' },
  'Daniel': { url: 'https://youtu.be/vNwmLY04gHM' },
  'Hosea': { url: 'https://youtu.be/wvp3rhvtZuE' },
  'Joel': { url: 'https://youtu.be/Kqrs2ZBVDXQ' },
  'Amos': { url: 'https://youtu.be/ZWJ5r2S0aF0' },
  'Obadiah': { url: 'https://youtu.be/cXBx5OKxfpY' },
  'Jonah': { url: 'https://youtu.be/T8bgd5vFqDU' },
  'Micah': { url: 'https://youtu.be/sFv9SxcBJe8' },
  'Nahum': { url: 'https://youtu.be/6uXCu73uWB8' },
  'Habakkuk': { url: 'https://youtu.be/iAcNpbMSCNo' },
  'Zephaniah': { url: 'https://youtu.be/jJVr6dRPMRo' },
  'Haggai': { url: 'https://youtu.be/2DnOa8qEtZM' },
  'Zechariah': { url: 'https://youtu.be/1bvgYk0nqr0' },
  'Malachi': { url: 'https://youtu.be/TqxIVcPx32M' },

  // New Testament
  'Matthew': { url: 'https://youtu.be/MKZa1MTzbIE' },
  'Mark': { url: 'https://youtu.be/vTJpMIVO2dE' },
  'Luke': { url: 'https://youtu.be/eEX4DLkXB04' },
  'John': { url: 'https://youtu.be/_yXdP5-FbFk' },
  'Acts': { url: 'https://youtu.be/W0CqNt3EqXs' },
  'Romans': { url: 'https://youtu.be/SeOy2kgg6r0' },
  '1 Corinthians': { url: 'https://youtu.be/uDqLmLocMCc' },
  '2 Corinthians': { url: 'https://youtu.be/E03u_C3hN0U' },
  'Galatians': { url: 'https://youtu.be/nqNg71u6fmA' },
  'Ephesians': { url: 'https://youtu.be/mWHy2qK3dKo' },
  'Philippians': { url: 'https://youtu.be/Uv4bXSkjuzE' },
  'Colossians': { url: 'https://youtu.be/28CxHLOq9gU' },
  '1 Thessalonians': { url: 'https://youtu.be/Q0aYytXSTwA' },
  '2 Thessalonians': { url: 'https://youtu.be/oo7bkMMPiHE' },
  '1 Timothy': { url: 'https://youtu.be/fgdcAvMMJIE' },
  '2 Timothy': { url: 'https://youtu.be/DLTvZPbhgqQ' },
  'Titus': { url: 'https://youtu.be/GpRJ9U5oALo' },
  'Philemon': { url: 'https://youtu.be/nVA1PebmVJI' },
  'Hebrews': { url: 'https://youtu.be/wB66T1MgILo' },
  'James': { url: 'https://youtu.be/Qew1Kzpe58E' },
  '1 Peter': { url: 'https://youtu.be/VQtxrhWN8wg' },
  '2 Peter': { url: 'https://youtu.be/hNkPPCnCWjI' },
  '1 John': { url: 'https://youtu.be/4Dyr7GQTbF4' },
  '2 John': { url: 'https://youtu.be/azW6ZqBVt6A' },
  '3 John': { url: 'https://youtu.be/yV20NTf9oZ0' },
  'Jude': { url: 'https://youtu.be/qgOCLR8-HAo' },
  'Revelation': { url: 'https://youtu.be/3vlrJf1cU0w' },
};

export default function ScourbyAudioLibrary({ onClose }: AudioLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [testament, setTestament] = useState<'all' | 'OT' | 'NT'>('all');

  const filteredBooks = bibleBooks.filter(book => {
    const matchesSearch = ((book.name) || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesTestament =
      testament === 'all' ||
      (testament === 'OT' && book.testament === 'OT') ||
      (testament === 'NT' && book.testament === 'NT');
    return matchesSearch && matchesTestament;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl shadow-2xl max-w-5xl w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-amber-950/40 px-6 py-4 border-b border-amber-900/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600/30 rounded-lg flex items-center justify-center">
              <Volume2 className="text-amber-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-100">Alexander Scourby Audio Library</h2>
              <p className="text-xs text-gray-400">Complete KJV Bible - All 66 Books</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-600/20 transition-colors"
          >
            <X className="text-gray-400 hover:text-amber-400" size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-3 bg-amber-900/10 border-b border-amber-900/20 flex-shrink-0">
          <p className="text-sm text-gray-400">
            🎧 <strong>About:</strong> Alexander Scourby's iconic narration of the King James Bible. Click any book to listen on YouTube. Opens in new tab.
          </p>
        </div>

        {/* Featured Channel Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-900/20 to-amber-950/20 border-b border-amber-900/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                <Volume2 className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-200 mb-1">Official Scourby Channel</h3>
                <p className="text-sm text-gray-400">Complete KJV Bible • Full Playlists • All 66 Books</p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/@ScourbyYouBible"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
            >
              <span>Visit Channel</span>
              <ExternalLink className="group-hover:translate-x-1 transition-transform" size={18} />
            </a>
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Full Audio Bible</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span>HD Quality Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Chapter-by-Chapter</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-amber-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-600/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTestament('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  testament === 'all'
                    ? 'bg-amber-600/30 text-amber-200'
                    : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800/60'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTestament('OT')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  testament === 'OT'
                    ? 'bg-amber-600/30 text-amber-200'
                    : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800/60'
                }`}
              >
                OT
              </button>
              <button
                onClick={() => setTestament('NT')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  testament === 'NT'
                    ? 'bg-amber-600/30 text-amber-200'
                    : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800/60'
                }`}
              >
                NT
              </button>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredBooks.map((book) => {
              const audioData = scourbyAudioComplete[book.name];

              return (
                <a
                  key={book.name}
                  href={audioData?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-amber-900/20 hover:border-amber-600/50 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-900/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Volume2 className="text-amber-400 group-hover:text-amber-300" size={20} />
                    <ExternalLink className="text-gray-600 group-hover:text-amber-400" size={14} />
                  </div>
                  <h3 className="font-bold text-gray-200 group-hover:text-amber-200 mb-1">
                    {book.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {book.chapters} chapter{book.chapters !== 1 ? 's' : ''}
                  </p>
                  <div className="mt-2 text-xs text-amber-600/70 group-hover:text-amber-500">
                    Click to listen →
                  </div>
                </a>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No books found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              🎙️ Narrated by Alexander Scourby · Links open in new tab
            </p>
            <a
              href="https://www.youtube.com/@ScourbyYouBible"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Full Channel</span>
              <ExternalLink size={12} />
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 rounded-lg text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
