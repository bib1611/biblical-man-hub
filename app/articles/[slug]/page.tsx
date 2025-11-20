'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2, Loader2, ExternalLink } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Article {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl?: string | null;
  contentHtml: string;
  preview: string;
  url: string;
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackWindowOpen } = useAnalytics();

  useEffect(() => {
    // Fetch real article content from API
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${slug}`);

        if (!response.ok) {
          throw new Error('Article not found');
        }

        const data = await response.json();
        setArticle(data.article);
        setError(null);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-500" />
          <p className="text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Hub</span>
            </Link>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <ExternalLink className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Article Not Found</h1>
          <p className="text-gray-400 mb-6 max-w-md">
            This article could not be loaded. It may have been moved or deleted.
          </p>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all"
            >
              Back to Hub
            </Link>
            <a
              href={`https://biblicalman.substack.com/p/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <span>View on Substack</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-zinc-900 text-white pb-20">
      {/* Navigation Bar */}
      <nav className="sticky top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Hub</span>
          </Link>
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Share article"
          >
            <Share2 size={20} />
          </button>
        </div>
      </nav>

      {/* Article Content */}
      <main className="pt-12 px-6">
        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {article.imageUrl && (
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          )}

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-red-900/20 text-red-400 border border-red-900/30 font-semibold">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {article.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
          </header>

          {/* Article Body */}
          <div
            className="prose prose-invert prose-lg md:prose-xl max-w-none
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:leading-tight
              prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
              prose-p:text-gray-200 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
              prose-a:text-red-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all
              prose-strong:text-white prose-strong:font-bold
              prose-em:text-gray-300 prose-em:italic
              prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:pl-8 prose-blockquote:pr-6 prose-blockquote:py-6 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:text-gray-100 prose-blockquote:bg-gradient-to-r prose-blockquote:from-red-900/20 prose-blockquote:to-transparent prose-blockquote:rounded-r-xl prose-blockquote:shadow-lg
              prose-ul:text-gray-200 prose-ul:my-6 prose-ul:space-y-2
              prose-ol:text-gray-200 prose-ol:my-6 prose-ol:space-y-2
              prose-li:my-3 prose-li:leading-relaxed
              prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-12 prose-img:w-full prose-img:border prose-img:border-white/10
              prose-hr:border-white/10 prose-hr:my-16"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* Article Footer */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-br from-red-950/30 to-transparent rounded-2xl border border-red-900/20">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Want more Biblical truth?
                </h3>
                <p className="text-gray-400 text-sm">
                  Subscribe to get new articles delivered straight to your inbox.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://biblicalman.substack.com/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
                >
                  Subscribe Free
                </a>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>View on Substack</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
