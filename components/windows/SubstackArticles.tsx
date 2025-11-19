'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Clock, TrendingUp, Flame } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  readTime: string;
  category: string;
  isFeatured?: boolean;
  imageUrl?: string;
}

// Recent articles from The Biblical Man Substack
const articles: Article[] = [
  {
    id: '1',
    title: 'The Real Jesus',
    excerpt: 'Jesus wasn\'t the kind of man you could turn into a refrigerator magnet. The real Jesus challenges everything about your comfortable Christianity.',
    url: 'https://biblicalman.substack.com',
    date: 'Nov 16',
    readTime: '7 min',
    category: 'Faith',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'I Almost Shut Down Biblical Man Last Night',
    excerpt: '12,000 Followers vs. One Brother\'s Question - When God Uses Family to Expose Our Digital Idols.',
    url: 'https://biblicalman.substack.com',
    date: 'Feb 16',
    readTime: '8 min',
    category: 'Leadership',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Your Son Is Being Softened While You Sleep',
    excerpt: 'You think your son is safe because the house is quiet. But while you\'re sleeping, culture is at work reprogramming his mind.',
    url: 'https://biblicalman.substack.com',
    date: 'Nov 17',
    readTime: '6 min',
    category: 'Parenting',
    isFeatured: true,
  },
  {
    id: '4',
    title: 'When Jesus Splits Your House',
    excerpt: 'Most churches sell you a Jesus who "fixes your family." But what happens when following Christ divides your household?',
    url: 'https://biblicalman.substack.com',
    date: 'Nov 18',
    readTime: '9 min',
    category: 'Faith',
  },
  {
    id: '5',
    title: 'Your Boy Is a Truck, Not a Trophy',
    excerpt: 'Stop treating your son like a showpiece. He\'s built for hard work, not display cases.',
    url: 'https://biblicalman.substack.com',
    date: 'Nov 17',
    readTime: '5 min',
    category: 'Parenting',
  },
  {
    id: '6',
    title: 'I Fought Beasts at Ephesus (So My Kids Won\'t Have To)',
    excerpt: 'There\'s a line Paul drops that haunts me. Understanding the battles we fight so our children don\'t have to.',
    url: 'https://biblicalman.substack.com',
    date: 'Nov 18',
    readTime: '10 min',
    category: 'Biblical Manhood',
  },
  {
    id: '7',
    title: 'Every Father Has a Line He Won\'t Cross',
    excerpt: 'Most fathers won\'t even let their kid fail a spelling test. But real fatherhood means letting them face real consequences.',
    url: 'https://biblicalman.substack.com',
    date: 'Nov 16',
    readTime: '6 min',
    category: 'Parenting',
  },
  {
    id: '8',
    title: 'God Doesn\'t Work for Boy\'s Wages',
    excerpt: 'My 12-year-old came home sweating like a dock worker. Here\'s what he taught me about real work and God\'s economy.',
    url: 'https://biblicalman.substack.com',
    date: 'Nov 16',
    readTime: '7 min',
    category: 'Faith',
  },
];

export default function SubstackArticles() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Faith', 'Parenting', 'Biblical Manhood', 'Leadership'];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-950/20 via-black/60 to-cyan-950/20 text-gray-100">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-blue-900/30 bg-black/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-blue-100 mb-1 flex items-center gap-2">
              <BookOpen className="text-blue-400" size={28} />
              Recent Substack Articles
            </h1>
            <p className="text-sm text-gray-400">
              Daily biblical truth for men who refuse to compromise
            </p>
          </div>
          <a
            href="https://biblicalman.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
          >
            <Flame size={16} />
            Subscribe for Free
          </a>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600/40 text-blue-200 border border-blue-600/50'
                  : 'bg-gray-800/40 text-gray-400 border border-gray-700/30 hover:bg-gray-800/60'
              }`}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex flex-col p-5 md:p-6 rounded-xl border transition-all hover:scale-[1.02] ${
                article.isFeatured
                  ? 'bg-gradient-to-br from-blue-950/40 to-cyan-950/30 border-blue-600/50 hover:border-blue-500/70'
                  : 'bg-gradient-to-br from-gray-950/30 to-black/40 border-gray-700/30 hover:border-blue-600/50'
              }`}
            >
              {/* Featured Badge */}
              {article.isFeatured && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                  <TrendingUp size={12} />
                  FEATURED
                </div>
              )}

              {/* Article Image (if available) */}
              {article.imageUrl && (
                <div className="mb-4 -mx-5 -mt-5 md:-mx-6 md:-mt-6">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </div>
              )}

              {/* Category */}
              <div className="mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-600/30">
                  {article.category}
                </span>
              </div>

              {/* Title & Excerpt */}
              <h3 className="text-lg md:text-xl font-bold text-blue-100 mb-2 line-clamp-2 hover:text-blue-300 transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                {article.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-3">
                  <span>{article.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Read Button */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 group bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500 hover:to-cyan-500"
              >
                Read Article
                <ExternalLink
                  size={14}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </a>
            </motion.article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No articles found in this category
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-blue-900/30 bg-gradient-to-r from-blue-900/40 to-cyan-900/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-blue-200">
              Get daily biblical truth in your inbox
            </p>
            <p className="text-xs text-gray-400">Join 20,000+ men who refuse to compromise</p>
          </div>
          <a
            href="https://biblicalman.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-bold text-sm transition-all shadow-lg"
          >
            Subscribe Now (Free)
          </a>
        </div>
      </div>
    </div>
  );
}
