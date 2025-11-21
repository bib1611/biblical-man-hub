/**
 * 7-Day Biblical Man Challenge Email Sequence
 * Aggressive, masculine, Ben Settle-inspired copy
 */

export interface EmailTemplate {
  day: number;
  subject: string;
  html: string;
}

const baseStyles = `
  font-family: Georgia, serif;
  max-width: 600px;
  margin: 0 auto;
  color: #1a1a1a;
  line-height: 1.7;
`;

export const emailSequence: EmailTemplate[] = [
  {
    day: 1,
    subject: 'Day 1: The Uncomfortable Truth About "Biblical" Manhood',
    html: `
      <div style="${baseStyles}">
        <p style="font-size: 16px;">Brother,</p>

        <p style="font-size: 16px;">
          You signed up for the 7-Day Challenge. Good.
        </p>

        <p style="font-size: 16px;">
          That means you're tired of the soft, feminized version of Christianity that's been crammed down your throat for years.
        </p>

        <p style="font-size: 16px;">
          <strong>Here's what we're NOT going to do:</strong>
        </p>

        <ul style="font-size: 16px; line-height: 1.8;">
          <li>Apologize for what the Bible actually says</li>
          <li>Water down Scripture to make people comfortable</li>
          <li>Pretend that "servant leadership" means being a doormat</li>
        </ul>

        <p style="font-size: 16px;">
          <strong>Here's what we ARE going to do:</strong>
        </p>

        <p style="font-size: 16px;">
          For the next 7 days, I'm going to dismantle every lie you've been told about biblical masculinity.
        </p>

        <div style="margin: 30px 0; padding: 25px; background: #fee2e2; border-left: 6px solid #dc2626;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #dc2626;">
            Day 1 Assignment:
          </p>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #333;">
            Read 1 Timothy 3:1-7. Write down every characteristic of a biblical man that makes modern Christians uncomfortable.
          </p>
        </div>

        <p style="font-size: 16px;">
          Tomorrow, we're going to talk about why your church probably lied to you about headship.
        </p>

        <p style="font-size: 16px;">
          Stay strong,<br>
          <strong>Adam</strong>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          The Biblical Man • Uncompromising Truth
        </p>
      </div>
    `,
  },
  {
    day: 2,
    subject: 'Day 2: Your Church Lied About Headship (And You Know It)',
    html: `
      <div style="${baseStyles}">
        <p style="font-size: 16px;">Brother,</p>

        <p style="font-size: 16px;">
          Let's address the elephant in the room:
        </p>

        <p style="font-size: 16px; font-weight: bold;">
          Your pastor won't preach Ephesians 5:22-24 without apologizing for it.
        </p>

        <p style="font-size: 16px;">
          "Wives, submit yourselves unto your own husbands, as unto the Lord."
        </p>

        <p style="font-size: 16px;">
          But every modern sermon adds a caveat: "Of course, this is mutual submission..." or "The husband must earn this..."
        </p>

        <p style="font-size: 16px;">
          <strong>That's not what the text says.</strong>
        </p>

        <p style="font-size: 16px;">
          The Bible doesn't stutter. It doesn't equivocate. Your authority as a husband is God-given, not wife-approved.
        </p>

        <div style="margin: 30px 0; padding: 25px; background: #1a1a1a; color: white; border-radius: 8px;">
          <p style="margin: 0; font-size: 18px; font-weight: bold;">
            Here's the hard truth:
          </p>
          <p style="margin: 15px 0 0 0; font-size: 16px;">
            If you're waiting for your wife to "let" you lead, you've already abdicated your role.
          </p>
        </div>

        <p style="font-size: 16px;">
          <strong>Day 2 Assignment:</strong>
        </p>

        <p style="font-size: 16px;">
          Read Ephesians 5:22-33. Then ask yourself: Am I leading, or am I negotiating?
        </p>

        <p style="font-size: 16px;">
          Tomorrow: Why most Christian men are spiritually weak (and how to fix it).
        </p>

        <p style="font-size: 16px;">
          Lead without apology,<br>
          <strong>Adam</strong>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          The Biblical Man • Day 2 of 7
        </p>
      </div>
    `,
  },
  {
    day: 3,
    subject: 'Day 3: Why Christian Men Are Spiritually Weak',
    html: `
      <div style="${baseStyles}">
        <p style="font-size: 16px;">Brother,</p>

        <p style="font-size: 16px;">
          I'm going to tell you something your pastor won't:
        </p>

        <p style="font-size: 16px; font-weight: bold; font-size: 18px;">
          Most Christian men are spiritually soft because they've been trained to be.
        </p>

        <p style="font-size: 16px;">
          The modern church has turned men into:
        </p>

        <ul style="font-size: 16px; line-height: 1.8;">
          <li><strong>Emotional processors</strong> instead of spiritual warriors</li>
          <li><strong>Consensus seekers</strong> instead of decisive leaders</li>
          <li><strong>Comfort lovers</strong> instead of cross-carriers</li>
        </ul>

        <p style="font-size: 16px;">
          You've been told that being "Christlike" means being passive. That's a lie.
        </p>

        <p style="font-size: 16px;">
          Jesus Christ overturned tables. He called religious leaders "vipers" and "whitewashed tombs."
        </p>

        <p style="font-size: 16px;">
          <strong>That's the masculinity the Bible teaches.</strong>
        </p>

        <div style="margin: 30px 0; padding: 25px; background: #fee2e2; border-left: 6px solid #dc2626;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #dc2626;">
            Day 3 Assignment:
          </p>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #333;">
            Identify ONE area where you've been passive. Make a decision TODAY without seeking approval.
          </p>
        </div>

        <p style="font-size: 16px;">
          Tomorrow we're going to destroy the myth of "mutual submission" once and for all.
        </p>

        <p style="font-size: 16px;">
          Carry your cross,<br>
          <strong>Adam</strong>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          The Biblical Man • Day 3 of 7
        </p>
      </div>
    `,
  },
  {
    day: 4,
    subject: 'Day 4: The "Mutual Submission" Myth',
    html: `
      <div style="${baseStyles}">
        <p style="font-size: 16px;">Brother,</p>

        <p style="font-size: 16px;">
          Let's settle this once and for all.
        </p>

        <p style="font-size: 16px;">
          Ephesians 5:21 says "Submit to one another out of reverence for Christ."
        </p>

        <p style="font-size: 16px;">
          Modern preachers stop there and say: "See? It's mutual!"
        </p>

        <p style="font-size: 16px; font-weight: bold;">
          But they conveniently ignore verses 22-24 that CLARIFY what that means:
        </p>

        <p style="font-size: 16px; padding-left: 20px; border-left: 3px solid #dc2626; font-style: italic;">
          "Wives, submit to your own husbands, as to the Lord. For the husband is head of the wife, as also Christ is head of the church..."
        </p>

        <p style="font-size: 16px;">
          <strong>Context matters.</strong>
        </p>

        <p style="font-size: 16px;">
          The husband submits to Christ. The wife submits to her husband. Children submit to parents. That's not "mutual" — that's hierarchical order established by God.
        </p>

        <div style="margin: 30px 0; padding: 25px; background: #1a1a1a; color: white; border-radius: 8px;">
          <p style="margin: 0; font-size: 18px; font-weight: bold;">
            The Truth:
          </p>
          <p style="margin: 15px 0 0 0; font-size: 16px;">
            Biblical marriage is not a democracy. It's a benevolent monarchy under Christ.
          </p>
        </div>

        <p style="font-size: 16px;">
          <strong>Day 4 Assignment:</strong>
        </p>

        <p style="font-size: 16px;">
          Read 1 Corinthians 11:3. Understand the chain of authority. Accept your position in it.
        </p>

        <p style="font-size: 16px;">
          Tomorrow: How to actually lead your family (not just pretend).
        </p>

        <p style="font-size: 16px;">
          Stand firm,<br>
          <strong>Adam</strong>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          The Biblical Man • Day 4 of 7
        </p>
      </div>
    `,
  },
  {
    day: 5,
    subject: 'Day 5: How to Actually Lead Your Family',
    html: `
      <div style="${baseStyles}">
        <p style="font-size: 16px;">Brother,</p>

        <p style="font-size: 16px;">
          We've spent 4 days tearing down lies. Today, we build.
        </p>

        <p style="font-size: 16px; font-weight: bold; font-size: 18px;">
          Here's how to lead your family like a biblical man:
        </p>

        <p style="font-size: 16px;"><strong>1. Lead Spiritually First</strong></p>
        <p style="font-size: 16px;">
          Open your Bible every morning. Pray with your wife. Teach your children Scripture. If you're not doing these, you're not leading — you're occupying space.
        </p>

        <p style="font-size: 16px;"><strong>2. Make Decisions</strong></p>
        <p style="font-size: 16px;">
          Stop polling your family on every choice. Get input, sure. But YOU decide. Decisiveness is masculine. Consensus-seeking is cowardice.
        </p>

        <p style="font-size: 16px;"><strong>3. Provide & Protect</strong></p>
        <p style="font-size: 16px;">
          Work hard. Earn money. Secure your home. Defend your family's honor. This isn't optional — it's biblical mandate.
        </p>

        <p style="font-size: 16px;"><strong>4. Discipline With Love</strong></p>
        <p style="font-size: 16px;">
          Your children need correction, not coddling. Proverbs 13:24 is clear. Modern parents produce weak children.
        </p>

        <div style="margin: 30px 0; padding: 25px; background: #fee2e2; border-left: 6px solid #dc2626;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #dc2626;">
            Day 5 Assignment:
          </p>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #333;">
            Start daily family Bible reading. Tonight. No excuses. Even if it's just 5 minutes.
          </p>
        </div>

        <p style="font-size: 16px;">
          Tomorrow: The resources you need to continue this journey.
        </p>

        <p style="font-size: 16px;">
          Lead boldly,<br>
          <strong>Adam</strong>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          The Biblical Man • Day 5 of 7
        </p>
      </div>
    `,
  },
  {
    day: 6,
    subject: 'Day 6: The Armory (Tools You Actually Need)',
    html: `
      <div style="${baseStyles}">
        <p style="font-size: 16px;">Brother,</p>

        <p style="font-size: 16px;">
          You can't fight a spiritual war with plastic swords.
        </p>

        <p style="font-size: 16px;">
          Over the past 5 days, we've covered the foundation. Now you need tools to build on it.
        </p>

        <p style="font-size: 16px; font-weight: bold;">
          Here's what's in The Armory:
        </p>

        <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="margin: 0; font-size: 17px; font-weight: bold; color: #dc2626;">
            📖 Biblical Marriage Framework
          </p>
          <p style="margin: 10px 0 0 0; font-size: 15px; color: #666;">
            Complete system for leading your wife biblically. No fluff. Just Scripture and practical application.
          </p>
          <a href="https://thebiblicalmantruth.com" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Get Framework →
          </a>
        </div>

        <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="margin: 0; font-size: 17px; font-weight: bold; color: #dc2626;">
            📻 The King's Radio
          </p>
          <p style="margin: 10px 0 0 0; font-size: 15px; color: #666;">
            24/7 uncompromising biblical teaching. Listen while you work, drive, or train.
          </p>
          <a href="https://thebiblicalmantruth.com" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Listen Now →
          </a>
        </div>

        <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="margin: 0; font-size: 17px; font-weight: bold; color: #dc2626;">
            ⚔️ Intel Articles
          </p>
          <p style="margin: 10px 0 0 0; font-size: 15px; color: #666;">
            Deep-dive tactical guides on fatherhood, spiritual warfare, and leadership.
          </p>
          <a href="https://biblicalman.substack.com" style="display: inline-block; margin-top: 15px; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Read Articles →
          </a>
        </div>

        <p style="font-size: 16px;">
          Tomorrow: Your final challenge.
        </p>

        <p style="font-size: 16px;">
          Arm yourself,<br>
          <strong>Adam</strong>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          The Biblical Man • Day 6 of 7
        </p>
      </div>
    `,
  },
  {
    day: 7,
    subject: 'Day 7: Final Challenge (Will You Lead or Quit?)',
    html: `
      <div style="${baseStyles}">
        <p style="font-size: 16px;">Brother,</p>

        <p style="font-size: 16px;">
          This is it. Day 7.
        </p>

        <p style="font-size: 16px;">
          You made it through the challenge. Most men don't.
        </p>

        <p style="font-size: 16px; font-weight: bold; font-size: 18px;">
          Now comes the real test:
        </p>

        <p style="font-size: 16px;">
          <strong>Will you actually DO what you've learned?</strong>
        </p>

        <p style="font-size: 16px;">
          Or will you go back to being a "nice Christian guy" who apologizes for biblical masculinity?
        </p>

        <div style="margin: 30px 0; padding: 30px; background: #1a1a1a; color: white; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 22px; font-weight: bold;">
            You have 3 options:
          </p>
          <p style="margin: 20px 0; font-size: 16px;">
            <strong>Option 1:</strong> Delete this email and forget everything. Go back to mediocrity.
          </p>
          <p style="margin: 20px 0; font-size: 16px;">
            <strong>Option 2:</strong> Agree with everything I said but do nothing. Feel better temporarily. Change nothing.
          </p>
          <p style="margin: 20px 0; font-size: 16px; color: #fca5a5;">
            <strong>Option 3:</strong> Join 20,000+ men who actually lead their families biblically.
          </p>
        </div>

        <p style="font-size: 16px;">
          If you choose Option 3:
        </p>

        <ul style="font-size: 16px; line-height: 1.8;">
          <li>Subscribe to my Substack for weekly tactical guides</li>
          <li>Join The Hub for full access to all resources</li>
          <li>Start leading TODAY, not tomorrow</li>
        </ul>

        <div style="text-align: center; margin: 40px 0;">
          <a href="https://thebiblicalmantruth.com" style="display: inline-block; padding: 20px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
            Enter The Hub →
          </a>
        </div>

        <p style="font-size: 16px;">
          <strong>Final Assignment:</strong>
        </p>

        <p style="font-size: 16px;">
          Read Joshua 24:15. Make your choice.
        </p>

        <p style="font-size: 16px;">
          The 7 days are over. The rest of your life starts now.
        </p>

        <p style="font-size: 16px;">
          Lead like you mean it,<br>
          <strong>Adam</strong><br>
          The Biblical Man
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          The Biblical Man • Day 7 of 7 — Challenge Complete
        </p>
      </div>
    `,
  },
];
