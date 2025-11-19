'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Filter } from 'lucide-react';
import { ContentFeedItem } from '@/types';

type PlatformFilter = 'All' | 'Substack' | 'Gumroad';

export default function ContentFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PlatformFilter>('All');
  const [items, setItems] = useState<ContentFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentFeedItem | null>(null);

  useEffect(() => {
    // Fetch content from API
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch from Substack and Gumroad
      const [substackRes, gumroadRes] = await Promise.all([
        fetch('/api/feeds/substack'),
        fetch('/api/feeds/gumroad'),
      ]);

      const substackData = await substackRes.json();
      const gumroadData = await gumroadRes.json();

      // Combine and sort by date
      const allContent: ContentFeedItem[] = [
        ...(substackData.posts || []),
        ...(gumroadData.products || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          platform: p.platform,
          preview: p.preview,
          url: p.url,
          date: p.date,
          imageUrl: p.imageUrl,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setItems(allContent);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      String(item.title || '').toLowerCase().includes(String(searchQuery || '').toLowerCase()) ||
      String(item.preview || '').toLowerCase().includes(String(searchQuery || '').toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.platform === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters: PlatformFilter[] = ['All', 'Substack', 'Gumroad'];

  const platformColors: Record<string, string> = {
    Substack: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
    Gumroad: 'bg-pink-600/20 text-pink-400 border-pink-600/30',
  };

  if (selectedItem) {
    return (
      <div className="h-full flex flex-col bg-black/60 text-gray-100">
        {/* Article Header */}
        <div className="p-6 border-b border-red-900/30">
          <button
            onClick={() => setSelectedItem(null)}
            className="mb-4 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-sm text-red-200 transition-colors"
          >
            ← Back to Feed
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-red-100 mb-2">{selectedItem.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    platformColors[selectedItem.platform]
                  }`}
                >
                  {selectedItem.platform}
                </span>
                <span>{new Date(selectedItem.date).toLocaleDateString()}</span>
              </div>
            </div>
            <a
              href={selectedItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-sm text-red-200 transition-colors flex items-center gap-2"
            >
              Open Original <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Article Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {selectedItem.content || selectedItem.preview}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black/60 text-gray-100">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-red-900/30 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-red-900/30 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-600/50 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-500" />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-red-600/40 text-red-200 border border-red-600/50'
                  : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading content...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No content found</div>
        ) : (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => window.open(item.url, '_blank')}
              className="p-4 bg-gradient-to-r from-red-950/20 to-black/40 border border-red-900/20 rounded-lg hover:border-red-600/40 cursor-pointer transition-all group"
            >
              {/* Image if available */}
              {item.imageUrl && (
                <div className="mb-3 -mx-4 -mt-4 rounded-t-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-red-100 group-hover:text-red-300 transition-colors flex-1">
                  {item.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${
                    platformColors[item.platform]
                  }`}
                >
                  {item.platform}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.preview}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  {item.author && (
                    <>
                      <span>•</span>
                      <span className="text-gray-400">{item.author}</span>
                    </>
                  )}
                </div>
                <span className="text-red-400 group-hover:text-red-300 flex items-center gap-1">
                  Open <ExternalLink size={12} />
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// Mock data for testing (not used - using live feeds)
const mockData: ContentFeedItem[] = [
  {
    id: '1',
    title: 'Why Most Christian Men Are Spiritually Soft',
    platform: 'Substack',
    preview:
      "The modern church has created a generation of men who mistake niceness for godliness. Real Biblical masculinity isn't about being agreeable—it's about being dangerous for the Kingdom.",
    url: '#',
    date: new Date().toISOString(),
    content:
      "The modern church has created a generation of men who mistake niceness for godliness. Real Biblical masculinity isn't about being agreeable—it's about being dangerous for the Kingdom.\n\nJesus wasn't a soft, passive figure. He overturned tables. He called out hypocrisy. He challenged authority when it conflicted with truth.",
  },
  {
    id: '2',
    title: 'The Marriage Framework - Now Available',
    platform: 'Gumroad',
    preview:
      'A complete system for building a marriage that glorifies God and creates generational wealth. Based on Biblical principles, not modern compromise.',
    url: '#',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
];
