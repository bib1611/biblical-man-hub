export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating: number;
  isPaid: boolean;
  category?: 'transformation' | 'truth' | 'support' | 'impact' | 'challenge';
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Melanie Rigney',
    content: "I've enjoyed all your posts. This is the one that converted me from free to paid. Thanks and God bless.",
    rating: 5,
    isPaid: true,
    category: 'transformation',
  },
  {
    id: '2',
    name: 'Diego Hernán Pozzoli',
    content: "You are a compelling preacher! You certainly are. Besides, I truly believe what you write. Your message is really needed today. If the choice is 'go for a discount or be a founding member', if I truly understood your message these last days, I believe there is no choice at all ... :))",
    rating: 5,
    isPaid: true,
    category: 'truth',
  },
  {
    id: '3',
    name: 'Joerg Peters',
    content: "I support your work because I deeply appreciate the way you're tackling one of the greatest challenges facing contemporary Christianity. Many Christians, at least in Germany, tend to go to extremes when it comes to the Bible: either taking everything literally or interpreting Scripture. I value your faithful, literal reading of the Bible and above all, the way you consistently live it out in practice.",
    rating: 5,
    isPaid: true,
    category: 'truth',
  },
  {
    id: '4',
    name: 'Vivian',
    content: "this is radical christianity, as it should be!",
    rating: 5,
    isPaid: true,
    category: 'challenge',
  },
  {
    id: '5',
    name: 'Ben Leavens',
    content: "Praise God for your good work.",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
  {
    id: '6',
    name: 'Alex',
    content: "I supported your work because I'm a sinner saved by grace and your work reminds me to thank God for his mercy. Your work reminds me that I am his and need to die to self in order to live for Christ. Thanks. Be encouraged. I will be praying for you, lifting you and your family up to the throne of a god whom wk great God and Savior the Lord Jesus Christ is seated at the right hand of God!",
    rating: 5,
    isPaid: true,
    category: 'transformation',
  },
  {
    id: '7',
    name: 'Brady Silas',
    content: "God is clearly speaking through your words. You channel His spirit beautifully.",
    rating: 5,
    isPaid: true,
    category: 'impact',
  },
  {
    id: '8',
    name: 'Barbra Jay',
    content: "I came across you on Twitter and have been following your posts. I truly love what you write. When you mentioned wanting to write full time and needing support, I thought about it but stepped away at the time. Then I read your email this morning, and it really spoke to me. You've got me now. I've subscribed. Thank you for all that you do.",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
  {
    id: '9',
    name: 'Becky',
    content: "I like what you have to say. You're apparently fearless, spiritually-unafraid to tell people the truth of Scripture and how it actually relates to each one of us. It's not just for Christians - Jesus never said he died only for his followers, but 'that the WORLD through Him might be saved.' I pray your messages wake up more than just Christians, and they'll make the right choice.",
    rating: 5,
    isPaid: true,
    category: 'truth',
  },
  {
    id: '10',
    name: 'Roxanne Taylor',
    content: "I support your efforts to share the good news of Jesus Christ! God bless you and your family.",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
  {
    id: '11',
    name: 'Paul S',
    content: "Edmund, You are a great vessel and worth every dime. I wish I could give you more but recently had to retire...Combat Veteran, disabled. I love how you are being tuned to propagate TRUTH. With Yoodie gone, Johnny MAC, and the target that is Christian conservativism - If give me more, when I can! Love you, brother!!",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
  {
    id: '12',
    name: 'Liminal Balance',
    content: "Your direct and raw approach to truth telling inspires me in many ways, like read the bible as a daily routine and seeking the wisdom through Jesus Christ, my personal saviour...",
    rating: 5,
    isPaid: true,
    category: 'transformation',
  },
  {
    id: '13',
    name: 'nvr2l8',
    content: "Praying for your premise. My son is 39. He was 1lb 10oz and docs gave him little chance of survival. In fact they almost killed him with an overdose that actually led to his healing. Lots to say but God is bigger. Rejoice in your grandson and know He is Sovereign over the good and bad nurses, good and bad docs, kind readers and not so much. Love your work. Thank you!",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
  {
    id: '14',
    name: 'Tona Cornelius',
    content: '"2 Timothy Chapter 2 - the whole chapter."',
    rating: 5,
    isPaid: true,
    category: 'truth',
  },
  {
    id: '15',
    name: 'Philip Harrelson',
    content: "I have been very challenged by your Twitter (X) feed. I also purchased several of your books. I need to know how to access the Romans file.",
    rating: 5,
    isPaid: true,
    category: 'challenge',
  },
  {
    id: '16',
    name: 'Thomas Merrin',
    content: "Keep spreading the word and fighting the good fight. Blessings to you and your family.",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
  {
    id: '17',
    name: 'Melissa Clary',
    content: "It appears so far to be honest and true information offered by truly ethical Christians. And there is stimulating, bold exchanges of intelligent feedback and support. A good platform to share with like-minded folks.",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
  {
    id: '18',
    name: 'David Gerry',
    content: "Thank you for your bold clarity in representing our Savior and Lord.",
    rating: 5,
    isPaid: true,
    category: 'truth',
  },
  {
    id: '19',
    name: 'Anna Montgomery',
    content: "I support your work because of your humanity, knowledge and philosophical approach to all things human and spiritual. You give insights and 'conversational' I have no access to in my world. You challenge status quo with no BS. The BS and false christianity is destroying our moral fibre. Thank you. I am grateful.",
    rating: 5,
    isPaid: true,
    category: 'truth',
  },
  {
    id: '20',
    name: 'Belema',
    content: "God bless.",
    rating: 5,
    isPaid: true,
    category: 'support',
  },
];

// Featured testimonials for landing page (most impactful)
export const featuredTestimonials = [
  testimonials[1], // Diego - compelling preacher
  testimonials[2], // Joerg - literal reading of Bible
  testimonials[8], // Becky - fearless truth
  testimonials[18], // Anna - destroying false christianity
  testimonials[7], // Barbra - stepped away then came back
  testimonials[3], // Vivian - radical christianity
];
