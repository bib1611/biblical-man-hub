import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch Substack RSS feed
    const response = await fetch('https://biblicalman.substack.com/feed', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Substack feed');
    }

    const xmlText = await response.text();

    // Parse RSS XML to extract posts
    const posts = parseSubstackRSS(xmlText);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Substack feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Substack posts', posts: [] },
      { status: 500 }
    );
  }
}

function parseSubstackRSS(xml: string) {
  const posts = [];

  // Extract items from RSS feed
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = xml.match(itemRegex) || [];

  for (const item of items.slice(0, 10)) { // Get latest 10 posts
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');
    const description = extractTag(item, 'description');
    const creator = extractTag(item, 'dc:creator');

    // Extract image from enclosure tag
    const imageMatch = item.match(/<enclosure[^>]+url="([^"]+)"[^>]*type="image/i);
    const imageUrl = imageMatch ? imageMatch[1] : null;

    // Extract clean preview text (remove HTML tags)
    const cleanDescription = description
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .substring(0, 200) + '...';

    posts.push({
      id: link,
      title,
      url: link,
      preview: cleanDescription,
      date: new Date(pubDate).toISOString(),
      platform: 'Substack' as const,
      author: creator || 'The Biblical Man',
      imageUrl,
    });
  }

  return posts;
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
