import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch Final Fight Bible Radio RSS feed
    const response = await fetch('https://finalfightbibleradio.com/feed/', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch FFBR feed');
    }

    const xmlText = await response.text();

    // Parse RSS XML to extract episodes/posts
    const episodes = parseFFBRFeed(xmlText);

    return NextResponse.json({ episodes });
  } catch (error) {
    console.error('FFBR feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FFBR feed', episodes: [] },
      { status: 500 }
    );
  }
}

function parseFFBRFeed(xml: string) {
  const episodes = [];

  // Extract items from RSS feed
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = xml.match(itemRegex) || [];

  for (const item of items.slice(0, 20)) { // Get latest 20 episodes
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');
    const description = extractTag(item, 'description');
    const category = extractTag(item, 'category');
    const creator = extractTag(item, 'dc:creator');

    // Extract clean preview text (remove HTML tags)
    const cleanDescription = description
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .substring(0, 200) + '...';

    episodes.push({
      id: link,
      title,
      url: link,
      preview: cleanDescription,
      date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      category: category || 'General',
      author: creator || 'FFBR',
      isPremium: category === 'Premium Blog Posts',
    });
  }

  return episodes;
}

function extractTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tagName}>`, 'i');
  const cdataMatch = xml.match(regex);

  if (cdataMatch) {
    return cdataMatch[1].trim();
  }

  const simpleRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = xml.match(simpleRegex);

  return match ? match[1].trim() : '';
}
