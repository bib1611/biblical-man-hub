import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, fetch from actual RSS feeds
const mockContent = [
  {
    id: '1',
    title: 'Why Most Christian Men Are Spiritually Soft',
    platform: 'Substack',
    preview:
      "The modern church has created a generation of men who mistake niceness for godliness. Real Biblical masculinity isn't about being agreeable—it's about being dangerous for the Kingdom.",
    url: '#',
    date: new Date().toISOString(),
    content:
      "The modern church has created a generation of men who mistake niceness for godliness. Real Biblical masculinity isn't about being agreeable—it's about being dangerous for the Kingdom.\n\nJesus wasn't a soft, passive figure. He overturned tables. He called out hypocrisy. He challenged authority when it conflicted with truth.\n\nYet somehow, we've turned Christianity into a religion of politeness. We've made 'being nice' the highest virtue. We've created men who are terrified to offend, who shrink from conflict, who mistake weakness for humility.\n\nThis isn't Biblical masculinity. This is cowardice dressed up in religious language.",
  },
  {
    id: '2',
    title: 'The Marriage Framework - Now Available',
    platform: 'Gumroad',
    preview:
      'A complete system for building a marriage that glorifies God and creates generational wealth. Based on Biblical principles, not modern compromise.',
    url: '#',
    date: new Date(Date.now() - 86400000).toISOString(),
    content:
      "Your marriage isn't just about you and your wife. It's the foundation for generational impact.\n\nThe Marriage Framework gives you the complete system for building a marriage that actually works—not based on Disney movies or compromise, but on Biblical truth and tested principles.",
  },
  {
    id: '3',
    title: 'Stop Praying Weak Prayers',
    platform: 'Beehiiv',
    preview:
      'Your prayers reveal your theology. If your prayers are timid, your God is small. Learn to pray like men who actually believe God can move mountains.',
    url: '#',
    date: new Date(Date.now() - 172800000).toISOString(),
    content:
      "Most men pray like they're asking a stranger for spare change. Timid. Uncertain. Apologetic.\n\nBut look at how Biblical men prayed:\n\n- David prayed for God to destroy his enemies\n- Elijah prayed for fire from heaven\n- Jesus commanded storms to stop\n\nThey prayed with authority because they knew WHO they were praying to.\n\nYour weak prayers reveal a weak theology. Change your prayers, change your life.",
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, you would:
    // 1. Fetch RSS feeds from Substack, Beehiiv, etc.
    // 2. Parse and aggregate them
    // 3. Cache the results

    // For now, return mock data
    return NextResponse.json(mockContent);
  } catch (error) {
    console.error('Content feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
