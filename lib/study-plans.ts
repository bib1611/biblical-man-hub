// Premium Bible Study Plans System
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  theme: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface StudyPlanDay {
  id: string;
  planId: string;
  dayNumber: number;
  title: string;
  verseReference: string;
  verseText: string;
  teaching: string;
  reflectionQuestions: string[];
  actionItem: string;
  createdAt: Date;
}

export interface UserStudyProgress {
  id: string;
  userId: string;
  planId: string;
  currentDay: number;
  completedDays: number[];
  startedAt: Date;
  completedAt?: Date;
}

// Pre-built premium study plans
export const PREMIUM_STUDY_PLANS = [
  {
    title: 'The 7-Day Leadership Transformation',
    description: 'Become the leader God called you to be. Seven days of intensive biblical training on how to lead your family, church, and workplace with authority and grace.',
    durationDays: 7,
    theme: 'leadership',
    days: [
      {
        dayNumber: 1,
        title: 'The Call to Lead',
        verseReference: 'Joshua 1:9',
        verseText: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
        teaching: `Leadership is not a suggestion—it's a command. When God called Joshua to lead Israel after Moses died, He didn't ask Joshua's permission. He commanded him.

The same applies to you. As a man created in God's image, you were designed to lead. Your family needs you to lead. Your church needs you to lead. Your workplace needs you to lead.

But notice what God says: "Be strong and of good courage." Why? Because leadership requires strength. It requires courage. The man who waits for perfect conditions will never lead. The man who seeks everyone's approval will never lead.

God's promise accompanies His command: "For the LORD thy God is with thee whithersoever thou goest." You are not alone. The Creator of the universe backs your leadership when it aligns with His will.

Stop waiting for permission. Stop waiting to feel ready. God has already commanded you to lead. Now obey.`,
        reflectionQuestions: [
          'In what areas have you been waiting for permission to lead?',
          'What fears are holding you back from stepping into leadership?',
          'How does knowing God is with you change your approach to leadership?',
        ],
        actionItem: 'Identify one area where you\'ve been passive. Today, make a decision without seeking approval from anyone except God.',
      },
      {
        dayNumber: 2,
        title: 'Leading Your Wife',
        verseReference: 'Ephesians 5:25-28',
        verseText: 'Husbands, love your wives, even as Christ also loved the church, and gave himself for it; That he might sanctify and cleanse it with the washing of water by the word, That he might present it to himself a glorious church, not having spot, or wrinkle, or any such thing; but that it should be holy and without blemish. So ought men to love their wives as their own bodies. He that loveth his wife loveth himself.',
        teaching: `The modern church has twisted this passage into weakness. They focus only on "love your wives" and ignore what that love looks like.

Christ's love for the church is active, not passive. He gave Himself. He sanctifies. He cleanses. He presents the church to Himself. This is decisive, authoritative love—not sentimental emotion.

Your job as a husband is to lead your wife toward holiness. Not to make her happy (happiness is fleeting). Not to give her whatever she wants (that's abdication, not leadership). But to sanctify her—to help her become more Christlike.

This means you need to know the Word so you can wash her with it. It means you make the hard decisions that benefit her soul, even when she resists. It means you sacrifice your comfort for her sanctification.

Loving your wife as Christ loves the church is the most demanding leadership role you'll ever have. And it starts with you leading spiritually.`,
        reflectionQuestions: [
          'When was the last time you led your wife in Bible study or prayer?',
          'Are you more focused on her happiness or her holiness?',
          'What decision have you been avoiding that you need to make for your family?',
        ],
        actionItem: 'Tonight, lead your wife in reading Scripture together. Even if it\'s just 5 minutes. Take the initiative.',
      },
      {
        dayNumber: 3,
        title: 'Leading Your Children',
        verseReference: 'Ephesians 6:4',
        verseText: 'And, ye fathers, provoke not your children to wrath: but bring them up in the nurture and admonition of the Lord.',
        teaching: `Notice who this command is addressed to: Fathers. Not mothers. Not "parents." Fathers.

God holds you—the father—primarily responsible for the spiritual training of your children. You cannot delegate this to your wife, the church, or the Christian school.

"Bring them up" means to rear them, to nourish them, to train them. This is active work. "In the nurture and admonition of the Lord" means through discipline (nurture) and instruction (admonition) that comes from God's Word.

The man who leaves child-rearing to his wife has abandoned his post. The man who expects Sunday School to disciple his children has failed his mission.

Your children need to see you reading the Bible. They need to hear you pray. They need your correction when they sin and your instruction in righteousness. They need a father who leads.

The most important leadership role you have is not at work. It's at home. Your children will either rise up and call you blessed or curse the day you abandoned your responsibility.`,
        reflectionQuestions: [
          'How much time do you spend weekly in direct spiritual training of your children?',
          'Have you delegated your fatherly duties to your wife or the church?',
          'What specific area of your children\'s character needs your attention?',
        ],
        actionItem: 'This evening, gather your children and teach them one truth from Scripture. Make this a weekly habit.',
      },
      {
        dayNumber: 4,
        title: 'Leading Under Authority',
        verseReference: 'Romans 13:1-2',
        verseText: 'Let every soul be subject unto the higher powers. For there is no power but of God: the powers that be are ordained of God. Whosoever therefore resisteth the power, resisteth the ordinance of God: and they that resist shall receive to themselves damnation.',
        teaching: `Before you can lead others well, you must learn to follow well. The man who rebels against authority is unfit to wield authority.

This doesn't mean blind obedience to ungodly commands. Peter and the apostles said, "We ought to obey God rather than men" when commanded to stop preaching Christ. But it does mean submitting to the legitimate authority structures God has ordained.

At work, submit to your employer. In the church, submit to your elders. In the nation, submit to governing authorities. When you chafe against authority, you reveal pride—and pride disqualifies you from godly leadership.

Jesus Himself submitted to the Father. He could have called down legions of angels, but He submitted to the cross. "Not my will, but thine, be done." That's the model.

The leader who demands submission but refuses to give it is a tyrant. The leader who submits to God's ordained authorities while leading those under his charge is modeling biblical authority.`,
        reflectionQuestions: [
          'Where do you struggle most with submitting to authority?',
          'How does your attitude toward authority affect your ability to lead?',
          'What would change in your leadership if you modeled Jesus\' submission?',
        ],
        actionItem: 'Identify one authority in your life you\'ve been resisting. Today, choose to honor that authority as unto the Lord.',
      },
      {
        dayNumber: 5,
        title: 'Leading Through Service',
        verseReference: 'Mark 10:43-45',
        verseText: 'But so shall it not be among you: but whosoever will be great among you, shall be your minister: And whosoever of you will be the chiefest, shall be servant of all. For even the Son of man came not to be ministered unto, but to minister, and to give his life a ransom for many.',
        teaching: `Biblical leadership is not about being served—it's about serving. But don't mistake this for weakness.

Jesus washed His disciples' feet, but He also overturned tables in the temple. He served sacrificially, but He also commanded with authority. Biblical servant leadership is not passive doormat-ism. It's powerful service that puts others' needs above your own comfort.

The servant leader takes the hard watch so others can sleep. The servant leader confronts sin because he loves too much to let it fester. The servant leader sacrifices his preferences for the good of those he leads.

This is not popular in a world that worships self. But the greatest leader who ever lived—Jesus Christ—defined greatness as service. He gave His life. Can you give your time? Your comfort? Your preferences?

Lead by serving. Serve by leading. The two are not opposites—they are one.`,
        reflectionQuestions: [
          'In what ways have you confused servant leadership with passive leadership?',
          'How can you serve your family this week in a tangible way?',
          'What comfort or preference do you need to sacrifice for those you lead?',
        ],
        actionItem: 'Do one act of service for your family today that costs you something—time, comfort, or convenience.',
      },
      {
        dayNumber: 6,
        title: 'Leading Through Discipline',
        verseReference: '1 Corinthians 9:27',
        verseText: 'But I keep under my body, and bring it into subjection: lest that by any means, when I have preached to others, I myself should be a castaway.',
        teaching: `You cannot lead others if you cannot lead yourself. Self-discipline is the foundation of all leadership.

Paul, the greatest missionary in history, still had to "keep under" his body. He had to bring it "into subjection." Why? Because his flesh—like yours—naturally rebels against what is right.

The undisciplined man is ruled by his appetites. Food, sleep, lust, entertainment—whatever his body craves, it gets. But the leader must master his body, not be mastered by it.

This means waking up early to pray when your body wants to sleep. It means saying no to that second plate when your stomach wants more. It means turning off the screen when your eyes want distraction. It means fleeing temptation when your flesh wants to linger.

A man who cannot say no to himself has no business saying no to others. Before you lead your family, lead yourself. Before you discipline your children, discipline your appetites.`,
        reflectionQuestions: [
          'What appetite has mastery over you?',
          'How does your lack of self-discipline affect your leadership?',
          'What daily discipline do you need to implement immediately?',
        ],
        actionItem: 'Choose one area of self-discipline to implement this week. Wake up 30 minutes earlier. Fast one meal. Cut out one distraction. Start today.',
      },
      {
        dayNumber: 7,
        title: 'Leading for Eternity',
        verseReference: 'Matthew 25:21',
        verseText: 'His lord said unto him, Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things: enter thou into the joy of thy lord.',
        teaching: `Everything you do as a leader is preparation for eternity. The way you lead your family, your ministry, your work—all of it is training for the kingdom.

Jesus told this parable about a master who entrusted talents to his servants. The faithful servants multiplied what they were given. The unfaithful servant buried his talent in fear.

What has God entrusted to you? A wife? Children? A ministry? A business? Employees? Friends who need Christ? These are your talents. You will give an account for how you led them.

The faithful leader will hear, "Well done, good and faithful servant." The unfaithful leader will face consequences we don't want to imagine.

This is not about perfectionism—it's about faithfulness. God doesn't require that you be the best leader in history. He requires that you be faithful with what He's given you.

Lead faithfully today. Lead as if you'll give an account tomorrow—because you will.`,
        reflectionQuestions: [
          'What has God entrusted to you that you\'ll give account for?',
          'Have you been faithful or have you buried your talents?',
          'What changes when you view your leadership through an eternal lens?',
        ],
        actionItem: 'Write down everyone God has entrusted to your leadership. Pray over each name. Commit to leading them faithfully.',
      },
    ],
  },
  {
    title: 'Marriage Dominion: 7 Days to Biblical Headship',
    description: 'Master the art of biblical husbandry. Learn to lead your wife with love, authority, and grace—the way God intended.',
    durationDays: 7,
    theme: 'marriage',
    days: [
      {
        dayNumber: 1,
        title: 'Understanding Headship',
        verseReference: '1 Corinthians 11:3',
        verseText: 'But I would have you know, that the head of every man is Christ; and the head of the woman is the man; and the head of Christ is God.',
        teaching: `The biblical order of authority is clear: God, Christ, man, woman. This is not oppression—it's divine design.

Headship means you are responsible. When things go wrong in your home, God looks to you. When your family drifts spiritually, God holds you accountable. When decisions need to be made, you make them.

This is a heavy responsibility—and it should be. But it's also an honor. God has entrusted you with the spiritual leadership of your household. Don't shrink from it.

Modern culture will tell you this is outdated, oppressive, or hateful. The Bible tells you it's the pattern of Christ and the church. Choose whom you will believe.`,
        reflectionQuestions: [
          'Do you truly understand and accept your role as head of your household?',
          'What responsibilities have you been avoiding?',
          'How would your marriage change if you fully embraced headship?',
        ],
        actionItem: 'Write out what headship means to you. Share it with your wife. Ask for her honest feedback on your leadership.',
      },
      {
        dayNumber: 2,
        title: 'Loving Like Christ',
        verseReference: 'Ephesians 5:25',
        verseText: 'Husbands, love your wives, even as Christ also loved the church, and gave himself for it.',
        teaching: `Christ\'s love for the church is the model for your love for your wife. And Christ\'s love was sacrificial, sanctifying, and sovereign.

Sacrificial: He gave Himself. Not His leftovers, not His spare time—Himself. Your wife deserves your best, not what remains after work, hobbies, and entertainment.

Sanctifying: He loves the church toward holiness. Your love should make your wife more godly, not just more comfortable.

Sovereign: He leads with authority. He doesn't ask permission to save or sanctify—He acts decisively for our good.

This is not soft, sentimental love. This is warrior love—fierce, protective, transformative. Love your wife like Christ loves you.`,
        reflectionQuestions: [
          'Is your love for your wife sacrificial or convenient?',
          'Are you helping your wife grow in godliness?',
          'What would change if you loved her as Christ loves the church?',
        ],
        actionItem: 'Sacrifice something you want today for something your wife needs. Don\'t tell her—just do it.',
      },
      {
        dayNumber: 3,
        title: 'The Decision Maker',
        verseReference: 'Genesis 3:6',
        verseText: 'And when the woman saw that the tree was good for food, and that it was pleasant to the eyes, and a tree to be desired to make one wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat.',
        teaching: `Notice the tragedy: Adam was "with her." He was present when Eve was deceived—and he did nothing. He didn\'t lead. He didn\'t protect. He didn\'t make the hard call.

Then, when confronted, he blamed his wife: "The woman whom thou gavest to be with me, she gave me of the tree."

This is the template for failed headship: passive presence followed by blame shifting. Sound familiar?

As the head of your home, you make the hard decisions. You don\'t poll for consensus. You don\'t wait for your wife to decide. You gather information, you pray, you decide, and you take responsibility for the outcome.

Your wife wants you to lead. She may test your leadership—that\'s natural. But she wants a man who will make decisions and stand behind them.`,
        reflectionQuestions: [
          'Are you an Adam—present but passive?',
          'What decisions have you avoided making?',
          'Do you take responsibility or shift blame?',
        ],
        actionItem: 'Make one decision today you\'ve been putting off. Don\'t ask permission. Decide and act.',
      },
      {
        dayNumber: 4,
        title: 'Spiritual Leadership at Home',
        verseReference: 'Deuteronomy 6:6-7',
        verseText: 'And these words, which I command thee this day, shall be in thine heart: And thou shalt teach them diligently unto thy children, and shalt talk of them when thou sittest in thine house, and when thou walkest by the way, and when thou liest down, and when thou risest up.',
        teaching: `You are the pastor of your home. Not your actual pastor—you. He shepherds the church; you shepherd your family.

This means you lead family worship. You initiate prayer. You teach Scripture. You create the spiritual culture of your home.

If your wife has to beg you to pray together, you\'ve failed. If your kids only hear the Bible at church, you\'ve failed. If spiritual conversations feel awkward in your home, you\'ve failed.

This isn\'t about perfection—it\'s about initiation. Take the lead. Start imperfectly. But start.`,
        reflectionQuestions: [
          'Who leads spiritual formation in your home—you or your wife?',
          'When was the last time you initiated family worship?',
          'What would it take for you to become the spiritual leader?',
        ],
        actionItem: 'Tonight, gather your family. Read one Proverb. Pray for each person by name. Make this weekly.',
      },
      {
        dayNumber: 5,
        title: 'Providing and Protecting',
        verseReference: '1 Timothy 5:8',
        verseText: 'But if any provide not for his own, and specially for those of his own house, he hath denied the faith, and is worse than an infidel.',
        teaching: `Provision is not optional—it\'s definitional. A man who doesn\'t provide for his family is worse than an unbeliever. Strong words from Scripture.

Provision means working hard. It means managing money wisely. It means ensuring your family has food, shelter, clothing, and security.

Protection means guarding your home—physically, emotionally, and spiritually. It means being willing to confront threats. It means creating a safe place for your wife and children.

In an age of soft men who expect their wives to carry equal financial burden, be the man who provides. In an age where men don\'t protect their families from spiritual danger, be the man who guards the gates.`,
        reflectionQuestions: [
          'Are you providing fully for your family\'s needs?',
          'What threats to your family are you ignoring?',
          'How are you protecting your home spiritually?',
        ],
        actionItem: 'Review your family\'s finances. Create or update a budget. Ensure provision is secure.',
      },
      {
        dayNumber: 6,
        title: 'Conflict and Correction',
        verseReference: '1 Peter 3:7',
        verseText: 'Likewise, ye husbands, dwell with them according to knowledge, giving honour unto the wife, as unto the weaker vessel, and as being heirs together of the grace of life; that your prayers be not hindered.',
        teaching: `Dwell with her "according to knowledge." This means understanding your wife—her needs, her struggles, her ways.

But notice: she is the "weaker vessel." This doesn\'t mean inferior—it means she needs your strength. She needs your protection. She needs your leadership, especially in conflict.

When conflict arises, you don\'t escalate—you lead toward resolution. You don\'t attack—you correct with love. You don\'t withdraw—you engage with wisdom.

And note the warning: mistreatment of your wife hinders your prayers. God won\'t hear the prayers of a man who dishonors his wife.`,
        reflectionQuestions: [
          'How do you handle conflict with your wife?',
          'Do you understand her—or just react to her?',
          'How might your treatment of your wife be affecting your prayers?',
        ],
        actionItem: 'Ask your wife: "How can I lead you better?" Listen without defending. Act on what you hear.',
      },
      {
        dayNumber: 7,
        title: 'The Legacy of Leadership',
        verseReference: 'Proverbs 31:28',
        verseText: 'Her children arise up, and call her blessed; her husband also, and he praiseth her.',
        teaching: `The Proverbs 31 woman is blessed because her husband leads well. Her children rise up because of the legacy of godly leadership in the home.

What legacy are you building? Will your children rise up and call you blessed? Will your wife praise God for the man you became?

This doesn\'t happen by accident. It happens through years of faithful leadership. Small decisions. Daily obedience. Consistent presence.

Start today. Lead today. Build the legacy today that your grandchildren will inherit.`,
        reflectionQuestions: [
          'What legacy are you currently building?',
          'Will your children rise up and call you blessed?',
          'What needs to change for you to leave a godly legacy?',
        ],
        actionItem: 'Write a letter to your future grandchildren describing the man you want to become. Let it guide your actions.',
      },
    ],
  },
];

/**
 * Get all study plans
 */
export async function getStudyPlans(): Promise<StudyPlan[]> {
  try {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapStudyPlan);
  } catch {
    return [];
  }
}

/**
 * Get study plan by ID with all days
 */
export async function getStudyPlanWithDays(planId: string): Promise<{ plan: StudyPlan; days: StudyPlanDay[] } | null> {
  try {
    const { data: plan, error: planError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) return null;

    const { data: days, error: daysError } = await supabase
      .from('study_plan_days')
      .select('*')
      .eq('plan_id', planId)
      .order('day_number', { ascending: true });

    if (daysError) return null;

    return {
      plan: mapStudyPlan(plan),
      days: days.map(mapStudyPlanDay),
    };
  } catch {
    return null;
  }
}

/**
 * Get user's progress on a study plan
 */
export async function getUserProgress(userId: string, planId: string): Promise<UserStudyProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', planId)
      .single();

    if (error || !data) return null;
    return mapUserProgress(data);
  } catch {
    return null;
  }
}

/**
 * Start a study plan for user
 */
export async function startStudyPlan(userId: string, planId: string): Promise<UserStudyProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_study_progress')
      .insert({
        user_id: userId,
        plan_id: planId,
        current_day: 1,
        completed_days: [],
      })
      .select()
      .single();

    if (error) throw error;
    return mapUserProgress(data);
  } catch {
    return null;
  }
}

/**
 * Mark day as completed
 */
export async function completeDay(userId: string, planId: string, dayNumber: number): Promise<boolean> {
  try {
    const progress = await getUserProgress(userId, planId);
    if (!progress) return false;

    const completedDays = [...progress.completedDays];
    if (!completedDays.includes(dayNumber)) {
      completedDays.push(dayNumber);
    }

    const nextDay = Math.max(...completedDays) + 1;

    const { error } = await supabase
      .from('user_study_progress')
      .update({
        completed_days: completedDays,
        current_day: nextDay,
        completed_at: completedDays.length >= 7 ? new Date().toISOString() : null,
      })
      .eq('user_id', userId)
      .eq('plan_id', planId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Seed the default study plans into the database
 */
export async function seedStudyPlans(): Promise<void> {
  for (const plan of PREMIUM_STUDY_PLANS) {
    // Check if plan already exists
    const { data: existing } = await supabase
      .from('study_plans')
      .select('id')
      .eq('title', plan.title)
      .single();

    if (existing) {
      console.log(`Study plan "${plan.title}" already exists, skipping...`);
      continue;
    }

    // Insert plan
    const { data: newPlan, error: planError } = await supabase
      .from('study_plans')
      .insert({
        title: plan.title,
        description: plan.description,
        duration_days: plan.durationDays,
        theme: plan.theme,
        is_premium: true,
      })
      .select()
      .single();

    if (planError || !newPlan) {
      console.error(`Error creating plan "${plan.title}":`, planError);
      continue;
    }

    // Insert days
    for (const day of plan.days) {
      const { error: dayError } = await supabase.from('study_plan_days').insert({
        plan_id: newPlan.id,
        day_number: day.dayNumber,
        title: day.title,
        verse_reference: day.verseReference,
        verse_text: day.verseText,
        teaching: day.teaching,
        reflection_questions: day.reflectionQuestions,
        action_item: day.actionItem,
      });

      if (dayError) {
        console.error(`Error creating day ${day.dayNumber} for "${plan.title}":`, dayError);
      }
    }

    console.log(`Created study plan: "${plan.title}"`);
  }
}

// Helper mappers
function mapStudyPlan(data: any): StudyPlan {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    durationDays: data.duration_days,
    theme: data.theme,
    isPremium: data.is_premium,
    createdAt: new Date(data.created_at),
  };
}

function mapStudyPlanDay(data: any): StudyPlanDay {
  return {
    id: data.id,
    planId: data.plan_id,
    dayNumber: data.day_number,
    title: data.title,
    verseReference: data.verse_reference,
    verseText: data.verse_text,
    teaching: data.teaching,
    reflectionQuestions: data.reflection_questions || [],
    actionItem: data.action_item,
    createdAt: new Date(data.created_at),
  };
}

function mapUserProgress(data: any): UserStudyProgress {
  return {
    id: data.id,
    userId: data.user_id,
    planId: data.plan_id,
    currentDay: data.current_day,
    completedDays: data.completed_days || [],
    startedAt: new Date(data.started_at),
    completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
  };
}
