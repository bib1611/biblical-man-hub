'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import InlineCTA from '@/components/articles/InlineCTA';
import RelatedContent from '@/components/articles/RelatedContent';
import { useAppStore } from '@/lib/store';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

// Mock CMS Data - In a real app, this would come from a database or CMS
const articles = {
    'i-fought-beasts-at-ephesus': {
        title: 'I Fought Beasts at Ephesus (So My Kids Won\'t Have To)',
        date: 'Nov 18, 2025',
        readTime: '10 min',
        category: 'Biblical Manhood',
        content: [
            { type: 'p', text: "There's a line Paul drops in 1 Corinthians 15:32 that haunts me: \"If after the manner of men I have fought with beasts at Ephesus, what advantageth it me, if the dead rise not?\"" },
            { type: 'p', text: "Most scholars debate whether he meant literal lions in an arena or the \"wild beasts\" of angry mobs and spiritual warfare. I don't care about the debate. I care about the reality." },
            { type: 'h2', text: "The Arena Is Real" },
            { type: 'p', text: "We like our Christianity polite. We like it air-conditioned. But Paul's faith was blood-on-the-sand, teeth-bared, life-on-the-line. He fought beasts." },
            { type: 'p', text: "Here's the hard truth most modern men ignore: If you aren't fighting beasts, your children will have to." },
            { type: 'cta' }, // Inline CTA Injection Point
            { type: 'p', text: "I look at my sons and I realize that every battle I refuse to fight today is a dragon I'm leaving in their backyard for tomorrow. My passivity isn't peace; it's deferred war." },
            { type: 'h2', text: "First Generation Christians" },
            { type: 'p', text: "Some of us are first-generation Christians. Not because our parents weren't believers, but because they didn't fight. They handed us a faith that was safe, not strong." },
            { type: 'p', text: "We are the ones who have to clear the land. We are the ones who have to kill the snakes. We are the ones who have to build the walls." },
            { type: 'p', text: "It's exhausting. It's dangerous. And it is the most glorious calling a man can have." },
            { type: 'quote', text: "Your scars are not shame. They are your testimony that you stood between the darkness and your family." },
            { type: 'p', text: "So when you feel tired, when the spiritual warfare feels overwhelming, remember this: You are fighting beasts at Ephesus so your children can walk in peace." },
        ]
    }
};

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const article = articles[slug as keyof typeof articles];
    const { openWindow } = useAppStore();
    const { trackWindowOpen } = useAnalytics();

    useEffect(() => {
        // Track article view
        if (article) {
            // In a real app, we'd track this specific event
            console.log(`Viewing article: ${slug}`);
        }
    }, [slug, article]);

    if (!article) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-red-900 selection:text-white pb-20">
            {/* Sticky Mobile CTA for Retention */}
            <StickyMobileCTA
                onChat={() => {
                    // In a full page context, we might want to open the modal or redirect
                    // For now, we'll simulate opening the window if we were in the hub, 
                    // or just redirect to home with a query param in a real scenario.
                    window.location.href = '/?action=sam';
                }}
                onShop={() => {
                    window.location.href = '/?action=products';
                }}
            />

            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Back to Hub</span>
                    </Link>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>
            </nav>

            {/* Article Content */}
            <main className="pt-24 px-6">
                <article className="max-w-3xl mx-auto">
                    {/* Header */}
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 border border-blue-900/30 font-semibold">
                                {article.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {article.readTime}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-heading">
                            {article.title}
                        </h1>
                    </header>

                    {/* Body */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        {article.content.map((block, idx) => {
                            if (block.type === 'h2') {
                                return <h2 key={idx} className="text-2xl font-bold text-white mt-10 mb-4 font-heading">{block.text}</h2>;
                            }
                            if (block.type === 'quote') {
                                return (
                                    <blockquote key={idx} className="border-l-4 border-red-600 pl-6 my-8 italic text-xl text-gray-300 bg-red-900/10 py-4 pr-4 rounded-r-lg">
                                        "{block.text}"
                                    </blockquote>
                                );
                            }
                            if (block.type === 'cta') {
                                return <InlineCTA key={idx} />;
                            }
                            return <p key={idx} className="mb-6 text-gray-300 leading-relaxed text-lg">{block.text}</p>;
                        })}
                    </div>

                    {/* Related Content */}
                    <RelatedContent currentSlug={slug} />
                </article>
            </main>
        </div>
    );
}
