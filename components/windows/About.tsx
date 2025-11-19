'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Target, Sword, Heart, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-red-950/20 via-black/60 to-orange-950/20 text-gray-100">
      {/* Hero Section */}
      <div className="relative border-b border-red-900/30 bg-gradient-to-r from-red-900/40 to-black/60 p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Biblical Man Truth
            </h1>
            <p className="text-xl md:text-2xl text-red-200 font-semibold mb-6">
              Uncomfortable Biblical truth for Christian men who refuse to compromise
            </p>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-red-400" />
                <span className="font-bold">20,000+ Men</span>
              </div>
              <div className="text-gray-500">•</div>
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-red-400" />
                <span>Daily Biblical Teaching</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-4xl mx-auto p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Target className="text-red-500" size={32} />
            Our Mission
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              <strong className="text-white">The Biblical Man Truth</strong> exists to equip Christian men with uncompromising biblical truth in a world that's diluted Scripture, feminized the church, and left men confused about their God-given roles as husbands, fathers, and spiritual leaders.
            </p>
            <p>
              We don't preach "comfort Christianity." We preach the uncomfortable truths that build real men of God who lead their families with biblical authority, love their wives as Christ loved the church, and refuse to bow to cultural compromise.
            </p>
            <p className="text-red-200 font-semibold italic">
              "Stop being soft. Stop compromising Scripture. Start leading like the man God called you to be."
            </p>
          </div>
        </motion.div>

        {/* Why We're Different */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Sword className="text-red-500" size={32} />
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-red-950/30 to-black/40 border border-red-900/30 rounded-xl">
              <Shield className="text-red-400 mb-3" size={28} />
              <h3 className="text-xl font-bold text-white mb-3">No Compromise on Scripture</h3>
              <p className="text-gray-300">
                We don't water down the Bible to fit modern culture. We teach what the Bible actually says about manhood, marriage, and family—even when it's uncomfortable.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-red-950/30 to-black/40 border border-red-900/30 rounded-xl">
              <Users className="text-red-400 mb-3" size={28} />
              <h3 className="text-xl font-bold text-white mb-3">Battle-Tested Truth</h3>
              <p className="text-gray-300">
                This isn't theory from an ivory tower. This is real biblical manhood learned through 22 years of marriage, raising children, ministry work, and getting kicked out of seminary for preaching truth.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-red-950/30 to-black/40 border border-red-900/30 rounded-xl">
              <Heart className="text-red-400 mb-3" size={28} />
              <h3 className="text-xl font-bold text-white mb-3">Love Through Truth</h3>
              <p className="text-gray-300">
                We speak hard truths because we love you enough to be honest. Your marriage, your family, and your walk with God are too important for soft preaching.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-red-950/30 to-black/40 border border-red-900/30 rounded-xl">
              <BookOpen className="text-red-400 mb-3" size={28} />
              <h3 className="text-xl font-bold text-white mb-3">Daily Content That Transforms</h3>
              <p className="text-gray-300">
                Over 20,000 men receive daily biblical teaching via Substack. We're building a movement of uncompromising Christian men who lead their families God's way.
              </p>
            </div>
          </div>
        </motion.div>

        {/* The Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">The Story Behind The Biblical Man</h2>
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-gradient-to-r from-red-950/40 to-black/60 p-8 rounded-xl border border-red-900/30">
              <p className="text-gray-300 mb-4">
                I'm a preacher with calluses. A man who learned biblical truth the hard way—through 22 years of marriage, raising children, working with my hands, and refusing to compromise when the cost was high.
              </p>
              <p className="text-gray-300 mb-4">
                I got kicked out of Bible school for preaching what the King James Bible actually says about headship, submission, and biblical manhood. The establishment didn't like uncomfortable truth. But God's Word doesn't need their approval.
              </p>
              <p className="text-gray-300 mb-4">
                This ministry was born from seeing too many Christian men:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Abdicate their God-given role as spiritual leaders</li>
                <li>Let their wives dominate because they're afraid of being "unloving"</li>
                <li>Compromise on Scripture to avoid conflict</li>
                <li>Raise soft children who can't handle hard truth</li>
                <li>Wonder why their marriages feel lifeless and their faith feels fake</li>
              </ul>
              <p className="text-gray-300 mb-4">
                The Biblical Man Truth was created to give you what the modern church won't: biblical masculinity without apology, marriage headship rooted in Scripture, and the uncomfortable truths that actually transform lives.
              </p>
              <p className="text-white font-bold text-xl">
                With me, there are no games. What you see is what you get. I care about you enough to tell you the truth—even when it stings.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Join the Movement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <div className="p-8 bg-gradient-to-r from-red-900/60 to-orange-900/60 rounded-xl border-2 border-red-600/50">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join 20,000+ Men Who Refuse to Compromise
            </h2>
            <p className="text-xl text-gray-200 mb-6">
              Get daily biblical truth delivered to your inbox. No fluff. No compromise. Just Scripture.
            </p>
            <a
              href="https://biblicalman.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-red-900 rounded-lg font-bold text-lg transition-all shadow-xl transform hover:scale-105"
            >
              Subscribe for Free →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
