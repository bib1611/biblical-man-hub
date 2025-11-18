'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Bookmark, Highlighter, StickyNote, Volume2 } from 'lucide-react';
import { bibleBooks, scourbyAudioMap } from '@/lib/data/bible-books';
import { BibleVerse } from '@/types';

export default function BibleStudy() {
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showAudio, setShowAudio] = useState(false);

  useEffect(() => {
    // Load saved data from localStorage
    const savedBookmarks = localStorage.getItem('bible-bookmarks');
    const savedHighlights = localStorage.getItem('bible-highlights');
    const savedNotes = localStorage.getItem('bible-notes');

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    // Fetch verses for selected book and chapter
    fetchVerses();
  }, [selectedBook, selectedChapter]);

  const fetchVerses = async () => {
    try {
      const response = await fetch(
        `/api/bible?book=${selectedBook}&chapter=${selectedChapter}`
      );
      const data = await response.json();
      setVerses(data);
    } catch (error) {
      console.error('Failed to fetch verses:', error);
      // Use mock data
      setVerses(generateMockVerses());
    }
  };

  const generateMockVerses = (): BibleVerse[] => {
    // Sample verses for demonstration
    return [
      {
        book: selectedBook,
        chapter: selectedChapter,
        verse: 1,
        text: 'In the beginning God created the heaven and the earth.',
      },
      {
        book: selectedBook,
        chapter: selectedChapter,
        verse: 2,
        text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
      },
      {
        book: selectedBook,
        chapter: selectedChapter,
        verse: 3,
        text: 'And God said, Let there be light: and there was light.',
      },
    ];
  };

  const book = bibleBooks.find((b) => b.name === selectedBook);
  const chapters = book ? Array.from({ length: book.chapters }, (_, i) => i + 1) : [];

  const toggleHighlight = (verseKey: string, color: string) => {
    const newHighlights = { ...highlights };
    if (newHighlights[verseKey] === color) {
      delete newHighlights[verseKey];
    } else {
      newHighlights[verseKey] = color;
    }
    setHighlights(newHighlights);
    localStorage.setItem('bible-highlights', JSON.stringify(newHighlights));
  };

  const addBookmark = () => {
    const bookmark = {
      book: selectedBook,
      chapter: selectedChapter,
      timestamp: new Date().toISOString(),
    };
    const newBookmarks = [...bookmarks, bookmark];
    setBookmarks(newBookmarks);
    localStorage.setItem('bible-bookmarks', JSON.stringify(newBookmarks));
  };

  const audioVideoId = scourbyAudioMap[selectedBook];

  return (
    <div className="h-full flex bg-black/60 text-gray-100">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 border-r border-red-900/30 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-red-900/30">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search verses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-red-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-600/50"
            />
          </div>
        </div>

        {/* Books List */}
        <div className="flex-1 overflow-auto">
          <div className="p-2 space-y-1">
            {bibleBooks.map((book) => (
              <button
                key={book.name}
                onClick={() => {
                  setSelectedBook(book.name);
                  setSelectedChapter(1);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedBook === book.name
                    ? 'bg-red-600/30 text-red-200 font-semibold'
                    : 'text-gray-400 hover:bg-red-950/20 hover:text-gray-300'
                }`}
              >
                {book.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks */}
        <div className="border-t border-red-900/30 p-4">
          <button
            onClick={addBookmark}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-sm text-red-200 transition-colors"
          >
            <Bookmark size={16} />
            Bookmark Chapter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chapter Navigation */}
        <div className="p-4 border-b border-red-900/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-red-100">
              {selectedBook} {selectedChapter}
            </h2>
            <div className="flex items-center gap-1">
              {chapters.slice(0, 20).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className={`w-8 h-8 rounded text-xs transition-colors ${
                    selectedChapter === ch
                      ? 'bg-red-600/40 text-red-100 font-bold'
                      : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800/60'
                  }`}
                >
                  {ch}
                </button>
              ))}
              {chapters.length > 20 && (
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(Number(e.target.value))}
                  className="ml-2 px-2 py-1 bg-gray-800/40 border border-gray-700/30 rounded text-xs text-gray-300"
                >
                  {chapters.slice(20).map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Audio Button */}
          {audioVideoId && (
            <button
              onClick={() => setShowAudio(!showAudio)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/40 rounded-lg text-sm text-amber-200 transition-colors"
            >
              <Volume2 size={16} />
              {showAudio ? 'Hide' : 'Play'} Scourby Audio
            </button>
          )}
        </div>

        {/* Audio Player */}
        {showAudio && audioVideoId && (
          <div className="p-4 bg-black/40 border-b border-red-900/30">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${audioVideoId}?start=${(selectedChapter - 1) * 180}`}
              title="Alexander Scourby KJV Audio"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        )}

        {/* Verses */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {verses.map((verse) => {
              const verseKey = `${verse.book}-${verse.chapter}-${verse.verse}`;
              const highlightColor = highlights[verseKey];

              return (
                <motion.div
                  key={verseKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: verse.verse * 0.02 }}
                  className={`group p-4 rounded-lg transition-all ${
                    highlightColor
                      ? `bg-${highlightColor}-900/20 border border-${highlightColor}-700/30`
                      : 'hover:bg-red-950/10'
                  }`}
                >
                  <div className="flex gap-4">
                    <span className="text-red-400 font-bold text-sm flex-shrink-0">
                      {verse.verse}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-200 leading-relaxed">{verse.text}</p>

                      {/* Verse Actions */}
                      <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleHighlight(verseKey, 'yellow')}
                          className="px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/40 rounded text-xs text-yellow-400 transition-colors"
                        >
                          Highlight
                        </button>
                        <button
                          onClick={() => {
                            const note = prompt('Add note:');
                            if (note) {
                              const newNotes = { ...notes, [verseKey]: note };
                              setNotes(newNotes);
                              localStorage.setItem('bible-notes', JSON.stringify(newNotes));
                            }
                          }}
                          className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/40 rounded text-xs text-blue-400 transition-colors"
                        >
                          Note
                        </button>
                      </div>

                      {/* Show note if exists */}
                      {notes[verseKey] && (
                        <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700/30 rounded text-sm text-blue-200">
                          <div className="flex items-start gap-2">
                            <StickyNote size={14} className="mt-0.5 flex-shrink-0" />
                            <p>{notes[verseKey]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
