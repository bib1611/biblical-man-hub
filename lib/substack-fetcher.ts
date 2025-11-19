// Fetch real Substack articles for community discussions

export interface SubstackArticle {
  title: string;
  url: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  guid: string;
}

const SUBSTACK_RSS_FEED = 'https://thebiblicalman.substack.com/feed';

export async function fetchRecentSubstackArticles(hours: number = 24): Promise<SubstackArticle[]> {
  try {
    const response = await fetch(SUBSTACK_RSS_FEED, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch Substack RSS:', response.statusText);
      return getFallbackArticles();
    }

    const xmlText = await response.text();
    const articles = parseSubstackRSS(xmlText);

    // Filter to last N hours
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    const recentArticles = articles.filter((article) => {
      const publishedTime = new Date(article.publishedAt).getTime();
      return publishedTime > cutoffTime;
    });

    // If no recent articles, return all available
    return recentArticles.length > 0 ? recentArticles : articles.slice(0, 5);
  } catch (error) {
    console.error('Error fetching Substack articles:', error);
    return getFallbackArticles();
  }
}

function parseSubstackRSS(xmlText: string): SubstackArticle[] {
  const articles: SubstackArticle[] = [];

  // Extract all <item> elements
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    // Extract fields
    const title = extractTag(itemContent, 'title');
    const link = extractTag(itemContent, 'link');
    const guid = extractTag(itemContent, 'guid');
    const pubDate = extractTag(itemContent, 'pubDate');
    const description = extractTag(itemContent, 'description');
    const contentEncoded = extractTag(itemContent, 'content:encoded');

    // Use content:encoded if available, fallback to description
    const fullContent = contentEncoded || description;

    articles.push({
      title: cleanHTML(title),
      url: link,
      content: cleanHTML(fullContent),
      excerpt: cleanHTML(description).substring(0, 300) + '...',
      publishedAt: pubDate,
      guid: guid || link,
    });
  }

  return articles;
}

function extractTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function cleanHTML(html: string): string {
  // Remove CDATA
  let text = html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

function getFallbackArticles(): SubstackArticle[] {
  // Fallback articles for when RSS feed fails
  return [
    {
      title: 'Why Most Christian Men Are Spiritually Soft',
      url: 'https://thebiblicalman.substack.com/p/why-most-christian-men-are-spiritually-soft',
      content:
        "Most Christian men today are spiritually soft. Not because they lack knowledge. Not because they don't go to church. But because they've never been taught to fight. The modern church has neutered biblical masculinity. We've replaced warriors with nice guys. Strength with sentimentality. Conviction with consensus. And we wonder why our families are falling apart. The biblical man doesn't avoid conflict - he runs toward it with wisdom. He doesn't seek comfort - he seeks Christ. He doesn't wait for feelings - he acts on truth. This is what the church has forgotten to teach.",
      excerpt:
        "Most Christian men today are spiritually soft. Not because they lack knowledge. Not because they don't go to church. But because they've never been taught to fight...",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-spiritual-soft',
    },
    {
      title: 'The Uncomfortable Truth About Biblical Submission',
      url: 'https://thebiblicalman.substack.com/p/biblical-submission',
      content:
        "Submission isn't a dirty word - it's a divine design. But the modern church has either ignored it or twisted it beyond recognition. Biblical submission isn't about women being doormats. It's about God's order for the family. And when we reject that order, we reject God's wisdom. The truth is uncomfortable: wives are called to submit to their husbands. Not because women are inferior. Not because men are always right. But because God designed a hierarchy for the home. And that hierarchy works. When a wife submits to her husband's godly leadership, the family flourishes. When a husband loves his wife as Christ loved the church, submission becomes beautiful. This is what Ephesians 5 actually teaches - not the watered-down version you hear on Sunday.",
      excerpt:
        "Submission isn't a dirty word - it's a divine design. But the modern church has either ignored it or twisted it beyond recognition...",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-submission',
    },
    {
      title: "Stop Waiting for 'The Right Time' to Lead Your Family",
      url: 'https://thebiblicalman.substack.com/p/stop-waiting',
      content:
        "There is no 'right time' to start leading your family biblically. You're waiting for confidence you'll never have. Clarity that won't come. Permission that nobody's going to give you. Meanwhile, your wife is desperate for leadership. Your kids are watching you waffle. And Satan is laughing. The right time was yesterday. The second right time is now. You don't need a seminary degree to lead family devotions. You don't need to be a perfect man to make hard decisions. You don't need to feel ready to step up. You just need to START. Read the Bible with your family tonight. Make a decision your wife has been waiting for. Stop the sin you've been tolerating. The biblical man doesn't wait for feelings - he acts on truth.",
      excerpt:
        "There is no 'right time' to start leading your family biblically. You're waiting for confidence you'll never have...",
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-stop-waiting',
    },
    {
      title: "Your Wife Doesn't Need a \"Nice Guy\" - She Needs a Man",
      url: 'https://thebiblicalman.substack.com/p/nice-guy',
      content:
        "Being nice is not the same as being godly. And your wife doesn't need \"nice\" - she needs strength wrapped in love. The nice guy avoids conflict. The biblical man confronts sin. The nice guy seeks to please everyone. The biblical man seeks to please God. The nice guy is terrified of his wife's emotions. The biblical man leads through them with wisdom. Here's what nobody told you: your wife is attracted to strength. Not dominance. Not harshness. But confident, godly leadership. When you shrink back from hard decisions, she loses respect. When you apologize for having convictions, she feels unsafe. When you let her lead because it's easier, she resents you. Stop being nice. Start being a man. Love her like Christ loved the church - with sacrificial strength, not passive weakness.",
      excerpt:
        "Being nice is not the same as being godly. And your wife doesn't need \"nice\" - she needs strength wrapped in love...",
      publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-nice-guy',
    },
  ];
}
