'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

interface RelatedContentProps {
    currentSlug: string;
}

export default function RelatedContent({ currentSlug }: RelatedContentProps) {
    const articles = [
        {
            slug: 'the-real-jesus',
            title: 'The Real Jesus',
            category: 'Faith',
            readTime: '7 min',
        },
        {
            slug: 'your-son-is-being-softened',
            title: 'Your Son Is Being Softened While You Sleep',
            category: 'Parenting',
            readTime: '6 min',
        },
        {
            slug: 'every-father-has-a-line',
            title: "Every Father Has a Line He Won't Cross",
            category: 'Parenting',
            readTime: '6 min',
        }
    ].filter(a => a.slug !== currentSlug).slice(0, 2);

    return (
        <div className="mt-12 pt-12 border-t border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-6">Read This Next</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                    <Link
                        key={article.slug}
                        href="#" // Placeholder until we have more local pages
                        className="group p-5 bg-gray-900/30 border border-gray-800 hover:border-red-900/50 rounded-xl transition-all hover:bg-gray-900/50"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded-full">
                                {article.category}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <BookOpen size={12} />
                                {article.readTime}
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-200 group-hover:text-red-400 transition-colors mb-2">
                            {article.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 font-medium group-hover:text-gray-300">
                            Read Article <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
