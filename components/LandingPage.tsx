'use client';

import { ArrowRight, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import ChallengeForm from '@/components/ChallengeForm';

interface LandingPageProps {
    onEnter: (appId?: string) => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-black text-gray-200 font-serif selection:bg-red-900 selection:text-white">
            {/* Top Bar */}
            <div className="border-b border-gray-800 bg-black/90 backdrop-blur sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="font-sans font-bold tracking-widest text-sm uppercase text-gray-500">
                        The Biblical Man Truth
                    </div>
                    <a
                        href="/member/login"
                        className="text-xs font-sans uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                    >
                        Member Login →
                    </a>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-900/20 border border-red-900/40 text-red-400 text-xs font-sans font-bold uppercase tracking-wider mb-6">
                        <AlertTriangle size={12} />
                        Warning: Uncomfortable Truth Ahead
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 font-sans">
                        "I got kicked out of Bible school for preaching what the King James Bible <span className="text-red-500 italic">actually</span> says about manhood."
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light italic border-l-4 border-red-900 pl-6 my-8">
                        They wanted me to be "nice." They wanted me to compromise. I chose to tell the truth instead.
                    </p>
                </motion.div>

                {/* Sales Letter Body */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300"
                >
                    <p>
                        <strong>Dear Christian Man,</strong>
                    </p>

                    <p>
                        If you look around your church and feel like something is missing... if you're tired of "soft" sermons that sound more like therapy than theology... if you're wondering where the <em>men</em> have gone...
                    </p>

                    <p>
                        <strong>You are not alone.</strong>
                    </p>

                    <p>
                        I'm a preacher with calluses. I learned biblical truth the hard way—through 22 years of marriage, raising children, working with my hands, and refusing to compromise when the cost was high.
                    </p>

                    <p>
                        The modern church has been feminized. It tells men to be passive. To "share their feelings" instead of leading their families. To apologize for their God-given authority.
                    </p>

                    <p>
                        The result?
                    </p>

                    <ul className="list-none pl-0 space-y-2 my-8">
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 mt-1">❌</span>
                            <span>Men who abdicate their role as spiritual leaders.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 mt-1">❌</span>
                            <span>Wives who are forced to lead because their husbands won't.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 mt-1">❌</span>
                            <span>Children who grow up without a strong example of biblical masculinity.</span>
                        </li>
                    </ul>

                    <h3>It's Time to Stop Apologizing.</h3>

                    <p>
                        The <strong>Biblical Man Hub</strong> is not for everyone. It is a command center for men who are done with games. Men who want the raw, undiluted truth of Scripture.
                    </p>

                    <p>
                        Inside, you won't find safe, comfortable devotionals. You'll find:
                    </p>

                    <ul className="grid md:grid-cols-2 gap-4 my-8 not-prose">
                        <li
                            onClick={() => onEnter('bible')}
                            className="bg-gray-900/50 p-4 rounded border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 cursor-pointer transition-all"
                        >
                            <strong className="text-white block mb-1">⚔️ The War Room</strong>
                            <span className="text-sm text-gray-400">Deep KJV Bible study tools to sharpen your sword.</span>
                        </li>
                        <li
                            onClick={() => onEnter('radio')}
                            className="bg-gray-900/50 p-4 rounded border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 cursor-pointer transition-all"
                        >
                            <strong className="text-white block mb-1">📻 King's Radio</strong>
                            <span className="text-sm text-gray-400">24/7 streaming of uncompromising biblical teaching.</span>
                        </li>
                        <li
                            onClick={() => onEnter('counseling')}
                            className="bg-gray-900/50 p-4 rounded border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 cursor-pointer transition-all"
                        >
                            <strong className="text-white block mb-1">🧠 Intel Articles</strong>
                            <span className="text-sm text-gray-400">Tactical guides on marriage, fatherhood, and leadership.</span>
                        </li>
                        <li
                            onClick={() => onEnter('products')}
                            className="bg-gray-900/50 p-4 rounded border border-gray-800 hover:border-red-700 hover:bg-gray-900/70 cursor-pointer transition-all"
                        >
                            <strong className="text-white block mb-1">🛡️ The Armory</strong>
                            <span className="text-sm text-gray-400">Resources to equip you for the spiritual battle.</span>
                        </li>
                    </ul>

                    <p>
                        I am inviting you to join <strong>20,000+ men</strong> who have decided to stop being passive and start leading.
                    </p>

                    <p>
                        But first, I want to challenge you.
                    </p>

                    <div className="my-12 p-8 bg-red-950/30 border-2 border-red-900/50 rounded-xl text-center not-prose">
                        <h3 className="text-2xl font-bold text-white mb-4 font-sans">Take The 7-Day Challenge</h3>
                        <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                            I've put together a 7-day email series that will deprogram the "nice guy" Christianity you've been fed and replace it with biblical authority. It's free.
                        </p>

                        <div className="max-w-md mx-auto">
                            <ChallengeForm />
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            Warning: This content may offend your modern sensibilities. That's the point.
                        </p>
                    </div>

                    <div className="text-center pt-8 border-t border-gray-800">
                        <p className="text-gray-400 mb-6 italic">
                            "Stop being soft. Stop compromising Scripture. Start leading like the man God called you to be."
                        </p>

                        <div className="max-w-2xl mx-auto mb-8 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
                            <h4 className="text-xl font-bold text-white mb-3 font-sans">Get Full Access to The Biblical Man Hub</h4>
                            <p className="text-gray-300 mb-4">
                                Access all resources, the War Room, King's Radio, Intel Articles, and The Armory for just <strong className="text-red-500 text-2xl">$3</strong>
                            </p>
                            <p className="text-sm text-gray-400 mb-6">
                                One-time payment. Lifetime access. After payment, you'll receive an email to create your account.
                            </p>
                            <a
                                href="https://buy.stripe.com/3cIaEYgbC1uh5I45VIcMM26"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded font-bold text-lg transition-all hover:bg-red-700"
                            >
                                <span>Get Access Now ($3)</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        <p className="text-sm text-gray-500">
                            Already a member? <a href="/member/login" className="text-red-500 underline hover:text-red-400 transition-colors">Login here</a>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
