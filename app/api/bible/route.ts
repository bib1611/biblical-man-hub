import { NextRequest, NextResponse } from 'next/server';

// Mock Bible data - in production, use a real KJV API or database
const mockVerses: Record<string, any> = {
  'Genesis-1': [
    { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
    { book: 'Genesis', chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
    { book: 'Genesis', chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
    { book: 'Genesis', chapter: 1, verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
    { book: 'Genesis', chapter: 1, verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
  ],
  'John-3': [
    { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { book: 'John', chapter: 3, verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
  ],
  'Proverbs-3': [
    { book: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
    { book: 'Proverbs', chapter: 3, verse: 6, text: 'In all thy ways acknowledge him, and he shall direct thy paths.' },
  ],
};

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

    const key = `${book}-${chapter}`;
    const verses = mockVerses[key] || generateMockVerses(book, parseInt(chapter));

    return NextResponse.json(verses);
  } catch (error) {
    console.error('Bible API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verses' },
      { status: 500 }
    );
  }
}

function generateMockVerses(book: string, chapter: number) {
  // Generate some mock verses for any book/chapter combination
  return Array.from({ length: 10 }, (_, i) => ({
    book,
    chapter,
    verse: i + 1,
    text: `This is verse ${i + 1} of ${book} chapter ${chapter}. [KJV text would be loaded from an API or database in production]`,
  }));
}
