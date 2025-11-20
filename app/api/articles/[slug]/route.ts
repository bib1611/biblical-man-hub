import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch the full Substack article HTML
    const articleUrl = `https://biblicalman.substack.com/p/${slug}`;

    const response = await fetch(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BiblicalManHub/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const html = await response.text();

    // Extract article data from HTML
    const article = parseSubstackArticle(html, slug);

    if (!article) {
      return NextResponse.json(
        { error: 'Failed to parse article' },
        { status: 500 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

function parseSubstackArticle(html: string, slug: string) {
  try {
    // Extract title
    const titleMatch = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>(.*?)<\/h1>/s) ||
                      html.match(/<meta property="og:title" content="([^"]+)"/);
    const title = titleMatch ? cleanHtml(titleMatch[1]) : 'Untitled';

    // Extract date
    const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/);
    const date = dateMatch ? new Date(dateMatch[1]).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) : '';

    // Extract featured image
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const imageUrl = imageMatch ? imageMatch[1] : null;

    // Extract article content
    // Substack typically wraps article content in a div with class containing "body" or "available-content"
    const contentMatch = html.match(/<div[^>]*class="[^"]*available-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*subscription-widget-wrap/);
    let contentHtml = contentMatch ? contentMatch[1] : '';

    // Clean up the content
    contentHtml = cleanSubstackContent(contentHtml);

    // Extract plain text preview (first 200 chars)
    const plainText = contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const preview = plainText.substring(0, 200) + '...';

    // Estimate read time (average reading speed: 200 words per minute)
    const wordCount = plainText.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    return {
      slug,
      title,
      date,
      readTime: `${readTime} min read`,
      category: 'Biblical Truth',
      imageUrl,
      contentHtml,
      preview,
      url: `https://biblicalman.substack.com/p/${slug}`,
    };
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}

function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .trim();
}

function cleanSubstackContent(html: string): string {
  // Remove Substack-specific elements that shouldn't appear in the reader
  let cleaned = html
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove script tags
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    // Remove style tags
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove data attributes
    .replace(/\s*data-[a-z-]+="[^"]*"/gi, '')
    // Remove class attributes (but keep structure)
    .replace(/\s*class="[^"]*"/gi, '')
    // Remove id attributes
    .replace(/\s*id="[^"]*"/gi, '')
    // Remove empty paragraphs
    .replace(/<p[^>]*>\s*<\/p>/gi, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}
