'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Bookmark, Highlighter, StickyNote, Volume2, HelpCircle, FileText, Library, Copy, Home, Menu, X } from 'lucide-react';
import { bibleBooks, scourbyAudioMap } from '@/lib/data/bible-books';
import { BibleVerse } from '@/types';
import BibleTutorial from './BibleTutorial';
import BibleNotepad from './BibleNotepad';
import ScourbyAudioLibrary from './ScourbyAudioLibrary';
import BibleHome from './BibleHome';

export default function BibleStudy() {
  const [currentView, setCurrentView] = useState<'home' | 'read'>('home');
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showAudio, setShowAudio] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showAudioLibrary, setShowAudioLibrary] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const highlightColors = [
    { name: 'yellow', class: 'bg-yellow-500/20 border-yellow-700/30', button: 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400' },
    { name: 'green', class: 'bg-green-500/20 border-green-700/30', button: 'bg-green-600/20 hover:bg-green-600/40 text-green-400' },
    { name: 'blue', class: 'bg-blue-500/20 border-blue-700/30', button: 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-400' },
    { name: 'red', class: 'bg-red-500/20 border-red-700/30', button: 'bg-red-600/20 hover:bg-red-600/40 text-red-400' },
    { name: 'purple', class: 'bg-purple-500/20 border-purple-700/30', button: 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-400' },
  ];

  useEffect(() => {
    // Load saved data from localStorage
    const savedBookmarks = localStorage.getItem('bible-bookmarks');
    const savedHighlights = localStorage.getItem('bible-highlights');
    const savedNotes = localStorage.getItem('bible-notes');

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    // Check if this is first time using Bible Study
    const hasSeenTutorial = localStorage.getItem('bible-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('bible-tutorial-seen', 'true');
    }
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMode(false);
      return;
    }

    setIsSearching(true);
    setSearchMode(true);

    try {
      const response = await fetch(`/api/bible/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.verses || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchMode(false);
    setSearchResults([]);
  };

  const navigateToVerse = (verse: BibleVerse) => {
    setSelectedBook(verse.book);
    setSelectedChapter(verse.chapter);
    clearSearch();
  };

  const copyVerse = async (verse: BibleVerse, format: 'plain' | 'formatted' | 'reference') => {
    let textToCopy = '';

    switch (format) {
      case 'plain':
        textToCopy = `${verse.text} (${verse.book} ${verse.chapter}:${verse.verse})`;
        break;
      case 'formatted':
        textToCopy = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse} (KJV)`;
        break;
      case 'reference':
        textToCopy = `${verse.book} ${verse.chapter}:${verse.verse}`;
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      const verseKey = `${verse.book}-${verse.chapter}-${verse.verse}`;
      setCopySuccess(verseKey);
      setShowCopyMenu(null);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFeatureSelect = (feature: 'read' | 'search' | 'notepad' | 'audio' | 'tutorial' | 'bookmarks') => {
    switch (feature) {
      case 'read':
        setCurrentView('read');
        break;
      case 'search':
        setCurrentView('read');
        setSearchMode(false);
        // Focus search input after a brief delay
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder="Search verses..."]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }, 100);
        break;
      case 'notepad':
        setShowNotepad(true);
        break;
      case 'audio':
        setShowAudioLibrary(true);
        break;
      case 'tutorial':
        setShowTutorial(true);
        break;
      case 'bookmarks':
        setCurrentView('read');
        // TODO: Show bookmarks panel
        break;
    }
  };

  const audioVideoId = scourbyAudioMap[selectedBook];

  // Show home screen
  if (currentView === 'home') {
    return (
      <>
        <BibleHome onSelectFeature={handleFeatureSelect} />
        {showTutorial && <BibleTutorial onClose={() => setShowTutorial(false)} />}
        {showNotepad && <BibleNotepad onClose={() => setShowNotepad(false)} />}
        {showAudioLibrary && <ScourbyAudioLibrary onClose={() => setShowAudioLibrary(false)} />}
      </>
    );
  }

  return (
    <div className="h-full flex bg-black/60 text-gray-100 relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-30 w-12 h-12 flex items-center justify-center bg-red-600/40 hover:bg-red-600/60 border border-red-700/50 rounded-lg text-red-100 transition-all"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-20"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar - Navigation */}
      <motion.div
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="w-64 border-r border-red-900/30 flex flex-col md:translate-x-0 fixed md:relative inset-y-0 left-0 z-30 bg-black/95 md:bg-transparent"
      >
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-red-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-600/50"
            />
          </div>
          {searchMode && (
            <button
              onClick={clearSearch}
              className="mt-2 w-full px-3 py-1 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-xs text-red-200 transition-colors"
            >
              Clear Search
            </button>
          )}
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
                  setIsSidebarOpen(false); // Close sidebar on mobile after selection
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
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Chapter Navigation */}
        <div className="p-4 pl-16 md:pl-4 border-b border-red-900/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-xl text-base font-bold text-red-100">
              {searchMode ? `Search Results: "${searchQuery}"` : `${selectedBook} ${selectedChapter}`}
            </h2>
            {!searchMode && <div className="flex items-center gap-1 overflow-x-auto scroll-smooth snap-x snap-mandatory md:snap-none scrollbar-hide">
              {chapters.slice(0, 20).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className={`w-10 h-10 md:w-8 md:h-8 rounded text-xs flex-shrink-0 snap-start transition-colors ${
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
            </div>}
          </div>

          {/* Toolbar Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 px-3 py-3 md:py-2 min-h-[48px] md:min-h-0 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-sm text-red-300 transition-colors"
              title="Return to home"
            >
              <Home size={16} />
              <span className="hidden xl:inline">Home</span>
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-2 px-3 py-3 md:py-2 min-h-[48px] md:min-h-0 bg-gray-700/20 hover:bg-gray-700/40 rounded-lg text-sm text-gray-300 transition-colors"
              title="Show tutorial"
            >
              <HelpCircle size={16} />
            </button>
            <button
              onClick={() => setShowNotepad(true)}
              className="flex items-center gap-2 px-3 py-3 md:py-2 min-h-[48px] md:min-h-0 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-sm text-blue-300 transition-colors"
              title="Open notepad"
            >
              <FileText size={16} />
              <span className="hidden lg:inline">Notepad</span>
            </button>
            <button
              onClick={() => setShowAudioLibrary(true)}
              className="flex items-center gap-2 px-3 py-3 md:py-2 min-h-[48px] md:min-h-0 bg-amber-600/20 hover:bg-amber-600/40 rounded-lg text-sm text-amber-300 transition-colors"
              title="Audio library"
            >
              <Library size={16} />
              <span className="hidden lg:inline">Audio Library</span>
            </button>
            {audioVideoId && !searchMode && (
              <button
                onClick={() => setShowAudio(!showAudio)}
                className="flex items-center gap-2 px-3 py-3 md:py-2 min-h-[48px] md:min-h-0 bg-amber-600/20 hover:bg-amber-600/40 rounded-lg text-sm text-amber-200 transition-colors"
              >
                <Volume2 size={16} />
                <span className="hidden xl:inline">{showAudio ? 'Hide' : 'Play'} Audio</span>
              </button>
            )}
          </div>
        </div>

        {/* Audio Player */}
        {showAudio && audioVideoId && (
          <div className="p-3 md:p-4 bg-black/40 border-b border-red-900/30">
            <iframe
              width="100%"
              height="150"
              src={`https://www.youtube.com/embed/${audioVideoId}?start=${(selectedChapter - 1) * 180}`}
              title="Alexander Scourby KJV Audio"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg md:h-[200px]"
            />
          </div>
        )}

        {/* Verses */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            {isSearching && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-400">Searching the Scriptures...</p>
              </div>
            )}
            {searchMode && !isSearching && searchResults.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No verses found for "{searchQuery}"</p>
              </div>
            )}
            {searchMode && !isSearching && searchResults.length > 0 && (
              <div className="mb-4 text-sm text-gray-400">
                Found {searchResults.length} verse{searchResults.length !== 1 ? 's' : ''}
              </div>
            )}
            {(searchMode ? searchResults : verses).map((verse) => {
              const verseKey = `${verse.book}-${verse.chapter}-${verse.verse}`;
              const highlightColor = highlights[verseKey];
              const highlightStyle = highlightColor
                ? highlightColors.find(c => c.name === highlightColor)?.class
                : '';

              return (
                <motion.div
                  key={verseKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: verse.verse * 0.02 }}
                  className={`group p-3 md:p-4 rounded-lg transition-all ${
                    highlightStyle
                      ? `${highlightStyle} border`
                      : 'hover:bg-red-950/10'
                  }`}
                >
                  <div className="flex gap-3 md:gap-4">
                    <span className="text-red-400 font-bold text-xs md:text-sm flex-shrink-0 pt-0.5">
                      {searchMode ? `${verse.book} ${verse.chapter}:${verse.verse}` : verse.verse}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-200 text-sm md:text-base leading-relaxed md:leading-relaxed">{verse.text}</p>

                      {/* Verse Actions */}
                      <div className="mt-2 flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button
                            onClick={() => setShowHighlightMenu(showHighlightMenu === verseKey ? null : verseKey)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              highlightColor
                                ? highlightColors.find(c => c.name === highlightColor)?.button
                                : 'bg-gray-600/20 hover:bg-gray-600/40 text-gray-400'
                            }`}
                          >
                            {highlightColor ? 'Change Color' : 'Highlight'}
                          </button>
                          {showHighlightMenu === verseKey && (
                            <div className="absolute z-10 mt-1 p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex gap-2">
                              {highlightColors.map((color) => (
                                <button
                                  key={color.name}
                                  onClick={() => {
                                    toggleHighlight(verseKey, color.name);
                                    setShowHighlightMenu(null);
                                  }}
                                  className={`w-6 h-6 rounded ${color.button} transition-transform hover:scale-110`}
                                  title={color.name}
                                />
                              ))}
                              {highlightColor && (
                                <button
                                  onClick={() => {
                                    toggleHighlight(verseKey, highlightColor);
                                    setShowHighlightMenu(null);
                                  }}
                                  className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs flex items-center justify-center"
                                  title="Remove highlight"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          )}
                        </div>
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
                        <div className="relative">
                          <button
                            onClick={() => setShowCopyMenu(showCopyMenu === verseKey ? null : verseKey)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              copySuccess === verseKey
                                ? 'bg-green-600/20 text-green-400'
                                : 'bg-gray-600/20 hover:bg-gray-600/40 text-gray-400'
                            }`}
                          >
                            {copySuccess === verseKey ? '✓ Copied' : 'Copy'}
                          </button>
                          {showCopyMenu === verseKey && (
                            <div className="absolute z-10 mt-1 p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl min-w-[140px]">
                              <button
                                onClick={() => copyVerse(verse, 'plain')}
                                className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-xs text-gray-300 transition-colors"
                              >
                                📋 Plain Text
                              </button>
                              <button
                                onClick={() => copyVerse(verse, 'formatted')}
                                className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-xs text-gray-300 transition-colors"
                              >
                                📖 Formatted
                              </button>
                              <button
                                onClick={() => copyVerse(verse, 'reference')}
                                className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-xs text-gray-300 transition-colors"
                              >
                                🔗 Reference Only
                              </button>
                            </div>
                          )}
                        </div>
                        {searchMode && (
                          <button
                            onClick={() => navigateToVerse(verse)}
                            className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 rounded text-xs text-red-400 transition-colors"
                          >
                            Go to Chapter
                          </button>
                        )}
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

      {/* Modals */}
      {showTutorial && <BibleTutorial onClose={() => setShowTutorial(false)} />}
      {showNotepad && <BibleNotepad onClose={() => setShowNotepad(false)} />}
      {showAudioLibrary && <ScourbyAudioLibrary onClose={() => setShowAudioLibrary(false)} />}
    </div>
  );
}
