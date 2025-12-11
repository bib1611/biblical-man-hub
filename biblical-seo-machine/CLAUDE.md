# CLAUDE.md - Biblical SEO Machine Project Instructions

## Project Overview

This is the **Biblical SEO Machine** - an SEO content automation system for the Biblical Man brand. It generates keyword research, competitor analysis, content briefs, and SEO-optimized articles while preserving a distinctive voice.

## Voice Identity (CRITICAL)

You are generating content for **Biblical Man** - a confrontational, KJV-based voice for Christian men. This is NOT mainstream Christian content.

### Voice Characteristics

1. **Confrontational, not soft** - Lead with challenge, not comfort
2. **Staccato rhythm** - Short paragraphs (2-4 sentences), fragment sentences
3. **KJV scripture** - Integrated and interpreted, not decorative
4. **Working-man perspective** - Garbage trucks, calloused hands, not golf courses
5. **Direct address** - "You", "Brother", "Men" - never "one should"
6. **Binary endings** - Force a choice, no soft landings

### Voice Violations (NEVER USE)

**Therapy-speak:**
- boundaries, toxic, triggered, trauma, safe space, self-care, validate, journey

**Soft qualifiers:**
- I think, maybe, perhaps, sort of, kind of, in my opinion

**Prosperity gospel:**
- blessed and highly favored, breakthrough, abundance mindset, unlock your potential

## Project Structure

```
/biblical-seo-machine
├── /config
│   ├── api_keys.env      # API configuration (template)
│   ├── settings.yaml     # Project settings
│   └── voice_guidelines.md # Full voice documentation
├── /modules
│   ├── keyword_research.py    # Keyword expansion & research
│   ├── competitor_analysis.py # SERP analysis
│   ├── intent_classifier.py   # Search intent classification
│   ├── content_generator.py   # Content brief & article generation
│   └── seo_optimizer.py       # SEO & voice compliance checking
├── /prompts
│   ├── research_prompts.md    # Keyword research prompts
│   ├── writing_prompts.md     # Content generation prompts
│   ├── optimization_prompts.md # SEO optimization prompts
│   └── voice_preservation.md  # Voice checking prompts
├── /outputs
│   ├── /articles        # Generated articles
│   ├── /product_pages   # Gumroad content
│   └── /meta_content    # Titles, descriptions
├── /data
│   ├── keyword_database.json  # Keyword inventory
│   ├── competitor_data.json   # Competitor cache
│   └── content_calendar.json  # Content planning
├── main.py              # Workflow orchestrator
├── requirements.txt     # Python dependencies
└── README.md           # Usage instructions
```

## Workflows

### 1. Keyword Research

```bash
python main.py research --seeds "biblical masculinity" "christian husband"
```

Or run directly in Claude Code:
1. Read `prompts/research_prompts.md`
2. Use "Keyword Expansion Prompt" with your seed keyword
3. Save results to `data/keyword_database.json`

### 2. Competitor Analysis

```bash
python main.py analyze --keyword "biblical masculinity"
```

Or use the prompt from `prompts/research_prompts.md` - "Competitor Analysis Prompt"

### 3. Content Brief Generation

```bash
python main.py brief --keyword "how to be a godly husband"
```

This generates a complete brief with H2 structure, key points, and the article generation prompt.

### 4. Article Generation

Use the generated prompt from the brief, or use `prompts/writing_prompts.md` - "Article Generation Prompt"

### 5. Voice Compliance Check

```bash
python main.py voice-check --file draft.md
```

Or use prompts from `prompts/voice_preservation.md`

### 6. Full Pipeline

```bash
python main.py full --keyword "biblical fatherhood"
```

Runs: Research → Analysis → Brief → Prompt generation

## Content Generation Instructions

When generating content for this project:

### Before Writing
1. Check `config/voice_guidelines.md` for current voice parameters
2. Run competitor analysis for the target keyword
3. Generate or review the content brief

### While Writing
1. Start with a hook, not "In today's world..."
2. Use short paragraphs (2-4 sentences max)
3. Include at least one KJV verse with interpretation
4. Add working-class metaphor or personal element
5. Use "you" direct address throughout
6. End with binary choice, not soft encouragement

### After Writing
1. Run voice compliance check
2. Verify keyword placement (title, first 100 words, H2s)
3. Check for therapy-speak violations
4. Ensure ending challenges, doesn't comfort

## SEO Requirements

- **Title**: Under 60 chars, keyword front-loaded
- **Meta description**: Under 160 chars, keyword + hook
- **H2 headings**: 4-6 per article, keyword in at least 2
- **Keyword density**: 1-2% naturally integrated
- **Internal links**: 3+ placeholders per article
- **Word count**: Based on competitor benchmark (typically 1500-2000)

## Data Files

### keyword_database.json
Contains seed keywords by category, high-opportunity keywords with scores, and the content calendar queue.

### competitor_data.json
Caches competitor analysis and stores known competitor weaknesses.

### content_calendar.json
Tracks content inventory and weekly themes.

## Quick Commands

| Task | Command |
|------|---------|
| Demo workflow | `python main.py demo` |
| Research keywords | `python main.py research --seeds "keyword1" "keyword2"` |
| Analyze competition | `python main.py analyze --keyword "your keyword"` |
| Generate brief | `python main.py brief --keyword "your keyword"` |
| Check voice | `python main.py voice-check --file article.md` |
| Full pipeline | `python main.py full --keyword "your keyword"` |
| Show prompts | `python main.py prompts --type writing_prompts` |

## Integration Points

### Substack
- Articles output to `/outputs/articles/` in markdown
- Meta descriptions included in frontmatter
- Internal link placeholders for cross-referencing

### Gumroad
- Product pages output to `/outputs/product_pages/`
- Use `prompts/writing_prompts.md` - "Product Description Prompt"

### Future Blog
- All content is SEO-ready
- Heading structures optimized for WordPress/Ghost

## Voice Quick Reference

**DO:**
- "Your wife needs a man who leads. Not a committee."
- "Quit you like men, be strong." — 1 Corinthians 16:13
- "I spent 20 years hauling garbage. You know what I learned?"
- "Stop reading, start doing."

**DON'T:**
- "Perhaps we should consider..."
- "On your journey toward biblical masculinity..."
- "It's important to set healthy boundaries..."
- "I hope this has given you some things to think about..."

## Remember

This content exists because the Church has lost its spine. We're not here to make people feel good about their mediocrity. We're here to call men up.

Write like it matters. Because it does.
