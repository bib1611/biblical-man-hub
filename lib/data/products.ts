import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'marriage-framework',
    name: 'The Marriage Framework',
    description:
      'A complete system for building a Biblical marriage that creates generational wealth and glorifies God. Stop compromising. Start leading.',
    price: 97,
    category: 'marriage',
    gumroadUrl: 'https://gumroad.com/biblical-man/marriage-framework',
    features: [
      'Biblical authority structure',
      'Financial partnership model',
      'Conflict resolution system',
      'Intimacy optimization',
      'Generational legacy planning',
    ],
  },
  {
    id: 'biblical-masculinity',
    name: 'Biblical Masculinity Course',
    description:
      "Stop being a passive, nice guy. Learn what it means to be a dangerous man for the Kingdom. This isn't your church's soft masculinity.",
    price: 147,
    category: 'men',
    gumroadUrl: 'https://gumroad.com/biblical-man/masculinity',
    features: [
      '12-week transformation program',
      'Daily action steps',
      'Accountability framework',
      'Spiritual warfare training',
      'Leadership development',
    ],
  },
  {
    id: 'financial-dominion',
    name: 'Financial Dominion Guide',
    description:
      'Biblical wealth-building for men who are tired of being broke. God called you to have dominion—including over your finances.',
    price: 67,
    category: 'men',
    gumroadUrl: 'https://gumroad.com/biblical-man/financial',
    features: [
      'Biblical wealth principles',
      'Debt elimination strategy',
      'Income multiplication system',
      'Stewardship framework',
      'Generational wealth planning',
    ],
  },
  {
    id: 'fathers-legacy',
    name: "Father's Legacy System",
    description:
      'Raise sons who conquer and daughters who honor. Stop raising weak children in a strong world.',
    price: 97,
    category: 'parenting',
    gumroadUrl: 'https://gumroad.com/biblical-man/fathers-legacy',
    features: [
      'Age-specific training plans',
      'Character development system',
      'Spiritual discipleship model',
      'Practical skills training',
      'Legacy documentation',
    ],
  },
  {
    id: 'prayer-warrior',
    name: 'Prayer Warrior Training',
    description:
      'Stop praying weak prayers. Learn to pray like a man who actually believes God moves mountains.',
    price: 47,
    category: 'devotionals',
    gumroadUrl: 'https://gumroad.com/biblical-man/prayer',
    features: [
      '30-day prayer bootcamp',
      'Biblical prayer patterns',
      'Spiritual warfare prayers',
      'Faith-building exercises',
      'Prayer journal system',
    ],
  },
  {
    id: 'wife-proverbs-31',
    name: 'The Proverbs 31 Wife Protocol',
    description:
      'For women who want to be the crown of their husband, not his stumbling block. Biblical femininity restored.',
    price: 77,
    category: 'women',
    gumroadUrl: 'https://gumroad.com/biblical-man/proverbs-31',
    features: [
      'Biblical submission framework',
      'Home management system',
      'Respect and honor training',
      'Beauty and dignity balance',
      'Motherhood excellence',
    ],
  },
  {
    id: 'marriage-devotional',
    name: '90-Day Marriage Devotional',
    description:
      'Daily devotions designed to strengthen your marriage through Biblical truth. No fluff, just transformation.',
    price: 37,
    category: 'devotionals',
    gumroadUrl: 'https://gumroad.com/biblical-man/marriage-devotional',
    features: [
      '90 powerful devotions',
      'Couple discussion questions',
      'Action steps for each day',
      'Prayer prompts',
      'Progress tracking',
    ],
  },
  {
    id: 'complete-bundle',
    name: 'The Complete Biblical Man Bundle',
    description:
      'Every single resource. Every tool. Every framework. For men who are all-in on transformation.',
    price: 497,
    category: 'courses',
    gumroadUrl: 'https://gumroad.com/biblical-man/complete-bundle',
    features: [
      'All 7 core products',
      'Exclusive bonuses',
      'Lifetime updates',
      'Priority support',
      'Save over $300',
    ],
  },
];

export const categories = [
  { id: 'all', name: 'All Products', color: 'red' },
  { id: 'marriage', name: 'Marriage', color: 'pink' },
  { id: 'men', name: 'Men', color: 'blue' },
  { id: 'women', name: 'Women', color: 'purple' },
  { id: 'parenting', name: 'Parenting', color: 'green' },
  { id: 'devotionals', name: 'Devotionals', color: 'amber' },
  { id: 'courses', name: 'Courses', color: 'cyan' },
] as const;
