'use client';

import { ArrowRight, Shield, Target, Sparkles, BookOpen, Headphones, Clock, CheckCircle } from 'lucide-react';
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
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
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

            <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-16">
                {/* Headline */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-900/20 border border-red-900/40 text-red-400 text-xs font-sans font-bold uppercase tracking-wider">
                        <Shield size={14} />
                        Built for men serious about Scripture
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight font-sans">
                        Turn conviction into action without losing your family or your faith
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-300 leading-relaxed max-w-3xl font-light">
                        The Biblical Man Hub is a calm, confident path to lead, provide, and protect using the King James Bible as your playbook. No noise, no posturing—just practical guidance you can act on today.
                    </p>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <a
                            href="#challenge"
                            className="group inline-flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded font-bold text-lg transition-all hover:bg-red-700"
                        >
                            Start the 7-day challenge
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <button
                            onClick={() => onEnter('start-here')}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-white rounded font-semibold hover:border-red-600 hover:text-red-200 transition"
                        >
                            Preview the Hub
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-sm text-gray-400 max-w-2xl font-sans">
                        No gimmicks. You get the notes, the radio feed, and the accountability steps exactly as you will inside the hub so you can judge the value in minutes, not weeks.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        {[{ label: 'Men already inside', value: '20,000+' }, { label: 'Action plan', value: '7-day email series' }, { label: 'Lifetime access', value: '$3 one-time' }].map(item => (
                            <div key={item.label} className="p-4 rounded border border-gray-800 bg-gray-900/40">
                                <div className="text-sm uppercase tracking-widest text-gray-500 font-sans">{item.label}</div>
                                <div className="text-2xl font-bold text-white font-sans mt-1">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Conversion clarity */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="grid md:grid-cols-2 gap-8 items-start"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white font-sans">A hub that respects your time</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Every lesson, broadcast, and guide is built to create momentum. You will know exactly what to do, how long it takes, and what outcome to expect so you can lead with clarity instead of reacting to pressure.
                        </p>
                        <div className="space-y-3">
                            {[{ title: 'Scripture first', copy: 'KJV passages paired with practical application so you can teach and model truth immediately.' }, { title: 'One dashboard', copy: 'Bible study, radio, counseling articles, and resources are organized in one clean interface.' }, { title: 'Action steps', copy: 'Short prompts and checklists help you turn conviction into daily practice with your family and church.' }].map(feature => (
                                <div key={feature.title} className="flex gap-3 items-start">
                                    <CheckCircle className="w-5 h-5 text-red-500 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm md:text-base">{feature.copy}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/40 space-y-4">
                        <div className="flex items-center gap-3">
                            <Target className="text-red-500" />
                            <div>
                                <p className="text-sm uppercase tracking-widest text-gray-500 font-sans">What you will unlock</p>
                                <p className="text-xl font-bold text-white font-sans">The Biblical Man Hub in three moves</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded bg-black/40 border border-gray-800">
                                <BookOpen className="text-red-400" />
                                <div>
                                    <p className="text-white font-semibold">War Room Bible study</p>
                                    <p className="text-gray-400 text-sm">Dig into Scripture with tools that remove guesswork and give you ready-to-teach notes.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded bg-black/40 border border-gray-800">
                                <Headphones className="text-red-400" />
                                <div>
                                    <p className="text-white font-semibold">King&apos;s Radio streaming</p>
                                    <p className="text-gray-400 text-sm">Uncompromising teaching you can keep on in the truck, at work, or with your son beside you.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded bg-black/40 border border-gray-800">
                                <Clock className="text-red-400" />
                                <div>
                                    <p className="text-white font-semibold">Weekly Intel briefings</p>
                                    <p className="text-gray-400 text-sm">Focused guides on marriage, fatherhood, and leadership so you always know the next step.</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onEnter('bible')}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition"
                        >
                            Step inside the hub now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.section>

                {/* Challenge */}
                <motion.section
                    id="challenge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="my-4"
                >
                    <div className="p-8 bg-red-950/40 border-2 border-red-900/50 rounded-xl text-center space-y-6">
                        <div className="flex items-center justify-center gap-2 text-red-200 uppercase text-xs font-sans tracking-[0.25em]">
                            <Sparkles size={16} />
                            7-day challenge
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white font-sans">Reset how you lead in the next week</h3>
                        <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed">
                            Receive one concise email per day with a Scripture focus, a conversation prompt for your family, and a simple action to build authority without becoming harsh. The series is free and built to deliver quick wins.
                        </p>
                        <div className="max-w-md mx-auto">
                            <ChallengeForm />
                        </div>
                        <p className="text-xs text-gray-500">
                            We protect your inbox. Unsubscribe anytime.
                        </p>
                    </div>
                </motion.section>

                {/* Offer */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="text-center space-y-6 border border-gray-800 rounded-xl p-8 bg-gray-900/40"
                >
                    <h4 className="text-2xl font-bold text-white font-sans">Lifetime access without monthly pressure</h4>
                    <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Join the hub, get every tool, and keep it forever for a one-time payment. No upsells, no hidden steps, and immediate access to the dashboard once your purchase completes.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <a
                            href="https://buy.stripe.com/3cIaEYgbC1uh5I45VIcMM26"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded font-bold text-lg transition-all hover:bg-red-700"
                        >
                            Get lifetime access for $3
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Shield className="text-red-400" size={18} />
                            Secure checkout via Stripe
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        Already a member? <a href="/member/login" className="text-red-500 underline hover:text-red-400 transition-colors">Login here</a>
                    </p>
                </motion.section>
            </main>

            {/* Sticky Conversion Footer */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur border-t border-red-900/30 z-40 md:hidden"
            >
                <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto">
                    <div className="text-xs text-gray-400">
                        <span className="block text-white font-bold">The Biblical Man Hub</span>
                        <span>Lifetime Access • $3</span>
                    </div>
                    <a
                        href="https://buy.stripe.com/3cIaEYgbC1uh5I45VIcMM26"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-red-600 text-white text-sm font-bold rounded shadow-lg shadow-red-900/20"
                    >
                        Join Now
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
