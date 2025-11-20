'use client';

import { ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function InlineCTA() {
    return (
        <div className="my-8 p-6 bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center flex-shrink-0 border border-red-600/30">
                    <Shield className="text-red-500" size={24} />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-bold text-white mb-1">
                        Stop Reading, Start Leading
                    </h4>
                    <p className="text-sm text-gray-400">
                        Get the complete Biblical Masculinity Framework and transform your family leadership today.
                    </p>
                </div>

                <Link
                    href="/?action=products"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-red-900/20"
                >
                    Get The Framework
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
