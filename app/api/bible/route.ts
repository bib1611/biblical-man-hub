import { NextRequest, NextResponse } from 'next/server';

// Using the Bible API (bible-api.com) - free, no auth required
const BIBLE_API_BASE = 'https://bible-api.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const book = searchParams.get('book');
    const chapter = searchParams.get('chapter');

    if (!book || !chapter) {
      return NextResponse.json(
        { error: 'Missing book or chapter parameter' },
        { status: 400 }
      );
    }

    // Fetch from Bible API
    const response = await fetch(`${BIBLE_API_BASE}/${book}+${chapter}?translation=kjv`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Bible verses');
    }

    const data = await response.json();

    // Transform API response to our format
    const verses = data.verses.map((verse: any) => ({
      book: verse.book_name,
      chapter: verse.chapter,
      verse: verse.verse,
      text: verse.text.trim(),
    }));

    return NextResponse.json(verses);
  } catch (error) {
    console.error('Bible API error:', error);

    // Fallback to mock data if API fails
    const book = request.nextUrl.searchParams.get('book');
    const chapter = parseInt(request.nextUrl.searchParams.get('chapter') || '1');

    return NextResponse.json(generateFallbackVerses(book || 'Genesis', chapter));
  }
}

function generateFallbackVerses(book: string, chapter: number) {
  // Fallback data for Genesis 1 (most commonly requested)
  if (book === 'Genesis' && chapter === 1) {
    return [
      { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
      { book: 'Genesis', chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
      { book: 'Genesis', chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
      { book: 'Genesis', chapter: 1, verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
      { book: 'Genesis', chapter: 1, verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
      { book: 'Genesis', chapter: 1, verse: 6, text: 'And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.' },
      { book: 'Genesis', chapter: 1, verse: 7, text: 'And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.' },
      { book: 'Genesis', chapter: 1, verse: 8, text: 'And God called the firmament Heaven. And the evening and the morning were the second day.' },
      { book: 'Genesis', chapter: 1, verse: 9, text: 'And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.' },
      { book: 'Genesis', chapter: 1, verse: 10, text: 'And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.' },
      { book: 'Genesis', chapter: 1, verse: 11, text: 'And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.' },
      { book: 'Genesis', chapter: 1, verse: 12, text: 'And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.' },
      { book: 'Genesis', chapter: 1, verse: 13, text: 'And the evening and the morning were the third day.' },
      { book: 'Genesis', chapter: 1, verse: 14, text: 'And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:' },
      { book: 'Genesis', chapter: 1, verse: 15, text: 'And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.' },
    ];
  }

  // Generic fallback for other books/chapters
  return Array.from({ length: 10 }, (_, i) => ({
    book,
    chapter,
    verse: i + 1,
    text: `Verse ${i + 1} of ${book} chapter ${chapter}. [Loading full KJV text...]`,
  }));
}
