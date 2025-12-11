# Biblical SEO Machine

SEO content automation system for the Biblical Man brand. Generates keyword research, competitor analysis, content briefs, and SEO-optimized articles while preserving a distinctive voice.

## Quick Start

```bash
# Run the demo
python main.py demo

# Or run the full pipeline for a keyword
python main.py full --keyword "biblical masculinity"
```

## What This Does

1. **Keyword Research** - Expands seed keywords into long-tail opportunities
2. **Competitor Analysis** - Analyzes SERP to find content gaps
3. **Intent Classification** - Determines search intent for content strategy
4. **Content Brief Generation** - Creates comprehensive briefs with H2 structure
5. **Article Generation** - Produces SEO-optimized prompts for Claude
6. **Voice Compliance** - Ensures content matches Biblical Man voice
7. **SEO Optimization** - Checks keyword density, structure, readability

## Project Structure

```
/biblical-seo-machine
├── config/           # Configuration files
├── modules/          # Python modules
├── prompts/          # Prompt templates
├── outputs/          # Generated content
├── data/            # Keyword & competitor data
├── main.py          # Main orchestrator
└── CLAUDE.md        # Claude Code instructions
```

## Usage

### Command Line

```bash
# Keyword research
python main.py research --seeds "biblical masculinity" "christian husband"

# Competitor analysis
python main.py analyze --keyword "how to be a godly husband"

# Generate content brief
python main.py brief --keyword "biblical fatherhood"

# Check voice compliance
python main.py voice-check --file outputs/articles/draft.md

# Full pipeline
python main.py full --keyword "teaching boys to be men"

# Show prompts
python main.py prompts --type writing_prompts
```

### With Claude Code

1. Open this project in Claude Code
2. Claude reads CLAUDE.md for context
3. Ask Claude to:
   - "Generate a content brief for 'biblical masculinity'"
   - "Write an article using the brief"
   - "Check this content for voice compliance"
   - "Run keyword research on these seeds"

## Voice Guidelines

This is NOT soft Christian content. The Biblical Man voice is:

- **Confrontational** - Lead with challenge, not comfort
- **Staccato** - Short paragraphs, fragment sentences
- **KJV-based** - Scripture integrated, not decorative
- **Working-class** - Garbage trucks, not golf courses
- **Direct** - "You", never "one should"
- **Binary** - Force choices, no soft landings

### Never Use

- Therapy-speak: boundaries, toxic, triggered, journey
- Soft qualifiers: maybe, perhaps, I think
- Prosperity gospel: breakthrough, abundance mindset

See `config/voice_guidelines.md` for complete guidelines.

## Key Files

| File | Purpose |
|------|---------|
| `config/voice_guidelines.md` | Complete voice documentation |
| `config/settings.yaml` | SEO parameters and banned terms |
| `data/keyword_database.json` | 50 seed keywords + opportunities |
| `prompts/writing_prompts.md` | Article generation prompts |
| `prompts/voice_preservation.md` | Voice checking prompts |

## Workflow

### Weekly Content (5 pieces)

1. **Monday**: Run `python main.py research` on week's themes
2. **Mon-Fri**: Generate briefs → Write articles → Voice check
3. **Friday**: Review outputs, schedule for publishing

### Monthly

1. Run content audit on existing inventory
2. Update keyword database with new opportunities
3. Analyze competitor movements

## Output Format

Articles are saved as markdown with frontmatter:

```markdown
---
keyword: biblical masculinity
title: The Hard Truth About Biblical Masculinity
meta_description: What mainstream Christianity won't tell you...
word_count: 1847
---

## The Problem Nobody's Talking About

Your grandfather didn't need a podcast to tell him how to be a man.

[Content continues...]
```

## Integration

- **Substack**: Copy markdown directly
- **Gumroad**: Use product page prompts
- **Blog**: Markdown ready for WordPress/Ghost

## Requirements

- Python 3.9+
- No external dependencies for core functionality
- Optional: anthropic, requests for API integration

## Support

This project is built for the Biblical Man brand. For questions about the SEO methodology, refer to the prompt templates. For voice questions, see `config/voice_guidelines.md`.

---

*"Quit you like men, be strong." — 1 Corinthians 16:13*
