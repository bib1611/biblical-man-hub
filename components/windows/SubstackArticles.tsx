'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Clock, TrendingUp, Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  preview: string;
  url: string;
  date: string;
  imageUrl?: string | null;
  author?: string;
  platform?: string;
}

export default function SubstackArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real Substack posts from API
    fetch('/api/feeds/substack')
      .then(res => res.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          // Take only the 4 most recent posts
          setArticles(data.posts.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load Substack posts:', error);
        setLoading(false);
      });
  }, []);

  // Generate slug from URL for in-app reading
  const getSlugFromUrl = (url: string) => {
    const match = url.match(/\/p\/([^/?]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 p-6 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="text-red-500" size={32} />
              Recent Articles
            </h1>
            <p className="text-gray-400">
              Daily biblical truth for men who refuse to compromise
            </p>
          </div>
          <a
            href="https://biblicalman.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold text-sm transition-all shadow-lg flex items-center gap-2 hover:shadow-xl"
          >
            <Flame size={18} />
            Subscribe for Free
          </a>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BookOpen size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">No articles available</p>
            <p className="text-gray-500 text-sm">Check back soon for new content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {articles.map((article, index) => {
              const slug = getSlugFromUrl(article.url);
              const linkHref = slug ? `/articles/${slug}` : article.url;
              const isExternal = !slug;

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link href={linkHref} target={isExternal ? "_blank" : undefined}>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20">

                      {/* Image */}
                      {article.imageUrl && (
                        <div className="relative h-48 md:h-56 overflow-hidden">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <Clock size={14} />
                          <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                          {article.title}
                        </h3>

                        {/* Preview Text */}
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                          {article.preview}
                        </p>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-red-400 font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>Read {isExternal ? 'on Substack' : 'Article'}</span>
                          {isExternal ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Link */}
        {!loading && articles.length > 0 && (
          <div className="flex justify-center mt-12">
            <a
              href="https://biblicalman.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white font-semibold transition-all hover:shadow-lg"
            >
              <span>View All Articles</span>
              <ExternalLink size={18} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
