# KJV Bible Study - Feature Documentation

## Overview

The KJV Bible Study module is a comprehensive Bible reading and study tool with real-time verse access, highlighting, notes, bookmarks, and audio integration.

## Core Features

### 1. Complete KJV Bible Access ✅

- **All 66 Books**: Old and New Testament
- **Real-time API Integration**: Powered by bible-api.com
- **Offline Fallback**: Genesis 1 available when API is down
- **24-hour Caching**: Fast loading with Next.js cache

**How it works:**
- API Route: `/app/api/bible/route.ts`
- Fetches from: `https://bible-api.com/{book}+{chapter}?translation=kjv`
- Automatically caches responses for 24 hours

### 2. Verse Search ✅ NEW

**Search the entire Bible for keywords and phrases**

**Features:**
- Press Enter in search box to search
- Shows verse count in results
- Full book/chapter/verse reference displayed
- Click "Go to Chapter" to navigate to full context
- Loading spinner during search
- Clear search to return to normal reading

**How to use:**
1. Type search query in the search box (left sidebar)
2. Press Enter or click outside
3. View results with full references (e.g., "John 3:16")
4. Hover over any result and click "Go to Chapter" to read in context
5. Click "Clear Search" to exit search mode

**API Endpoint:** `/app/api/bible/search/route.ts`

### 3. Multi-Color Highlighting System ✅ NEW

**5 Color Options:**
- 🟡 Yellow - General highlights
- 🟢 Green - Promises/encouragement
- 🔵 Blue - Doctrine/teaching
- 🔴 Red - Warnings/commands
- 🟣 Purple - Prayer verses

**How to use:**
1. Hover over any verse
2. Click "Highlight" button
3. Choose color from popup menu
4. Change colors or remove highlights anytime
5. All highlights saved to localStorage

**Storage:** Highlights persist across sessions in browser localStorage

### 4. Personal Notes System ✅

**Add private notes to any verse**

**Features:**
- Click "Note" button on any verse
- Enter your personal commentary
- Notes display below the verse
- Saved to localStorage
- Persists across sessions

**Use cases:**
- Personal reflections
- Cross-references
- Sermon notes
- Study insights

### 5. Bookmarks ✅

**Save your current reading position**

**Features:**
- Bookmark current chapter
- One-click bookmark button
- Saved to localStorage
- Quick access to return later

**Future enhancement:** Bookmark management panel

### 6. Alexander Scourby Audio ✅

**Listen to the King James Bible read by Alexander Scourby**

**Currently Available Books:**
- Genesis
- Psalms
- Proverbs
- Matthew
- Revelation

**Features:**
- Embedded YouTube player
- Auto-start at current chapter
- Full audio controls
- Show/hide player

**How it works:**
- Scourby audio mapped in `/lib/data/bible-books.ts`
- YouTube embed with chapter timing
- Format: `https://www.youtube.com/embed/{videoId}?start={chapterTime}`

### 7. Navigation System

**Three ways to navigate:**

1. **Book List** (left sidebar)
   - Click any book name
   - Auto-scrolls to that book
   - Highlights current selection

2. **Chapter Quick Nav** (top bar)
   - First 20 chapters shown as buttons
   - Dropdown for chapters 21+
   - One-click chapter switching

3. **Search Results** (when searching)
   - Click "Go to Chapter" on any verse
   - Auto-navigates to that book/chapter
   - Exits search mode automatically

## Technical Details

### Data Flow

```
User Action → Component State → localStorage/API → UI Update
```

### State Management

```typescript
// Core state
const [selectedBook, setSelectedBook] = useState('Genesis');
const [selectedChapter, setSelectedChapter] = useState(1);
const [searchQuery, setSearchQuery] = useState('');
const [verses, setVerses] = useState<BibleVerse[]>([]);
const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
const [highlights, setHighlights] = useState<Record<string, string>>({});
const [notes, setNotes] = useState<Record<string, string>>({});
const [bookmarks, setBookmarks] = useState<any[]>([]);
```

### localStorage Keys

```
bible-highlights - Verse highlighting data
bible-notes      - User notes data
bible-bookmarks  - Saved bookmarks
```

### API Routes

#### Get Chapter Verses
```
GET /api/bible?book={book}&chapter={chapter}
Returns: BibleVerse[]
```

#### Search Verses
```
GET /api/bible/search?q={query}
Returns: { query: string, count: number, verses: BibleVerse[] }
```

### Type Definitions

```typescript
interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}
```

## Usage Examples

### Example 1: Study Session
1. Open Bible Study from dock
2. Select "John" from book list
3. Read Chapter 3
4. Search for "born again"
5. Highlight John 3:3 in yellow
6. Add note: "Must be born of Spirit"
7. Bookmark chapter

### Example 2: Topical Study
1. Search "faith"
2. Review all results
3. Highlight key verses in different colors:
   - Yellow: Definition verses
   - Green: Promise verses
   - Blue: Teaching verses
4. Click "Go to Chapter" for context
5. Add notes to key verses

### Example 3: Daily Reading
1. Select book from left sidebar
2. Click chapter number
3. Click "Play Scourby Audio" (if available)
4. Read along with audio
5. Highlight impactful verses
6. Bookmark for tomorrow

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

**Note:** Requires localStorage support

## Performance

- **Initial Load**: ~300ms with cache
- **API Response**: ~500-1000ms (first load)
- **Cached Load**: ~50-100ms
- **Search**: ~500-1500ms depending on results
- **Verse Render**: Animated with stagger effect

## Future Enhancements

### Planned Features

1. **Advanced Search**
   - Boolean operators (AND, OR, NOT)
   - Phrase search with quotes
   - Book/chapter filtering
   - Testament filtering (OT/NT)

2. **Study Tools**
   - Strong's concordance integration
   - Cross-reference system
   - Parallel versions (KJV, ESV, NIV)
   - Verse comparison

3. **Bookmarks Panel**
   - Manage all bookmarks
   - Organize by category
   - Export/import bookmarks

4. **Notes Enhancement**
   - Rich text editor
   - Tag system
   - Search notes
   - Export notes to PDF/Markdown

5. **Audio Expansion**
   - All 66 books with Scourby audio
   - Speed control
   - Auto-advance chapters
   - Background audio mode

6. **Reading Plans**
   - Daily reading schedules
   - Bible-in-a-year plans
   - Topical reading plans
   - Progress tracking

7. **Share Features**
   - Share verses on social media
   - Generate verse images
   - Email verses
   - Copy formatted text

8. **Study Groups**
   - Collaborative notes
   - Group highlights
   - Discussion threads
   - Shared reading plans

## Troubleshooting

### Verses not loading
- Check internet connection
- Bible API may be down (fallback to Genesis 1)
- Check browser console for errors
- Refresh page

### Highlights not saving
- Ensure localStorage is enabled
- Check browser privacy settings
- Clear browser cache and reload
- Storage limit: ~5-10MB per origin

### Audio not playing
- Book may not have audio mapped
- YouTube embed may be blocked
- Check browser autoplay settings
- Try clicking play manually

### Search not working
- Check search query is not empty
- Bible API may be rate-limiting
- Try shorter/simpler queries
- Check network in DevTools

## Contributing

To add more Scourby audio:

1. Find YouTube video ID for book
2. Update `/lib/data/bible-books.ts`:
```typescript
export const scourbyAudioMap: Record<string, string> = {
  'BookName': 'YouTubeVideoID',
};
```
3. Estimate chapter timing (usually ~180 seconds per chapter)

## Support

For issues, bugs, or feature requests:
- Check [README.md](README.md) for general info
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for hosting issues
- File issues with detailed description

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
**API:** bible-api.com (free, no auth required)
**Audio:** Alexander Scourby KJV via YouTube
