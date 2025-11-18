import { NextRequest, NextResponse } from 'next/server';

const BIBLE_API_BASE = 'https://bible-api.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Missing search query parameter' },
        { status: 400 }
      );
    }

    // The Bible API supports search via the query format
    // Format: /search?q=query
    const response = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(query)}?translation=kjv`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to search Bible verses');
    }

    const data = await response.json();

    // Transform API response to our format
    const verses = data.verses ? data.verses.map((verse: any) => ({
      book: verse.book_name,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text.trim(),
    })) : [];

    return NextResponse.json({
      query,
      count: verses.length,
      verses,
    });
  } catch (error) {
    console.error('Bible search error:', error);

    // Return empty results on error
    return NextResponse.json({
      query: request.nextUrl.searchParams.get('q') || '',
      count: 0,
      verses: [],
      error: 'Search failed. Please try again.',
    });
  }
}
