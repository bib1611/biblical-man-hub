import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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
    const titleMatch = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/) ||
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
    // Try multiple patterns to find Substack content
    let contentMatch = html.match(/<div[^>]*class="[^"]*available-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*subscription-widget/);

    if (!contentMatch) {
      // Try alternative pattern
      contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
    }

    if (!contentMatch) {
      // Try finding main content area
      contentMatch = html.match(/<div[^>]*class="[^"]*body[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    }

    let contentHtml = contentMatch ? contentMatch[1] : '';

    // If still no content, try to extract paragraphs from the page
    if (!contentHtml) {
      const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
      if (paragraphs && paragraphs.length > 3) {
        // Take paragraphs that look like article content (longer than 50 chars)
        contentHtml = paragraphs
          .filter(p => cleanHtml(p).length > 50)
          .join('\n');
      }
    }

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
    // Remove subscription widgets and buttons
    .replace(/<div[^>]*class="[^"]*subscription[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<button[^>]*subscribe[^>]*>[\s\S]*?<\/button>/gi, '')
    // Remove share buttons and social elements
    .replace(/<div[^>]*class="[^"]*share[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<a[^>]*class="[^"]*social[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '')
    // Remove Substack branding
    .replace(/<div[^>]*class="[^"]*pencraft[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    // Remove captioned images divs (keep just the img)
    .replace(/<div[^>]*class="[^"]*captioned-image[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, '$1')
    // Remove figure wrappers (keep content)
    .replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, '$1')
    // Remove data attributes
    .replace(/\s*data-[a-z-]+="[^"]*"/gi, '')
    // Remove most class attributes but keep basic ones
    .replace(/\s*class="[^"]*"/gi, '')
    // Remove id attributes
    .replace(/\s*id="[^"]*"/gi, '')
    // Remove style attributes
    .replace(/\s*style="[^"]*"/gi, '')
    // Remove empty paragraphs
    .replace(/<p[^>]*>\s*<\/p>/gi, '')
    // Remove empty divs
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    // Clean up multiple line breaks
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Convert headings to proper semantic HTML
  cleaned = cleaned
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '<h2>$1</h2>') // Convert h1 to h2
    .replace(/<strong[^>]*><h2>([\s\S]*?)<\/h2><\/strong>/gi, '<h2>$1</h2>') // Unwrap bold from headings;

  return cleaned;
}
