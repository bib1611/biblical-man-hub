"""
Biblical SEO Machine - Content Generator Module

Generates SEO-optimized content that preserves Biblical Man voice.
Combines keyword data, competitor benchmarks, and voice guidelines
to produce publish-ready articles.
"""

import json
from dataclasses import dataclass, asdict
from typing import Optional
from pathlib import Path
from datetime import datetime


@dataclass
class ContentBrief:
    """Complete brief for content generation."""
    keyword: str
    secondary_keywords: list[str]
    intent: str
    target_word_count: int
    h2_sections: list[str]
    key_points: list[str]
    biblical_angle: str
    internal_links: list[str]
    cta_type: str
    voice_reminders: list[str]
    competitor_notes: str


@dataclass
class GeneratedContent:
    """Output from content generation."""
    keyword: str
    title: str
    meta_description: str
    content_markdown: str
    word_count: int
    h2_count: int
    internal_link_placeholders: list[str]
    suggested_internal_links: list[str]
    voice_check_notes: list[str]
    generated_at: str


class ContentGenerator:
    """
    Generates SEO-optimized content with Biblical Man voice.

    Works with Claude/LLM to produce content based on:
    - Keyword research data
    - Competitor benchmarks
    - Voice guidelines
    """

    # Voice reminders to include in every prompt
    VOICE_REMINDERS = [
        "Confrontational, not soft - lead with challenge",
        "Staccato rhythm - short paragraphs, fragments for punch",
        "KJV scripture - integrated, not decorative",
        "Working-man metaphors - garbage trucks, calloused hands",
        "Direct address - 'You', 'Brother', 'Men'",
        "No therapy-speak - no 'boundaries', 'toxic', 'triggered'",
        "No soft qualifiers - no 'maybe', 'I think', 'perhaps'",
        "Binary endings - force a choice, no soft landings"
    ]

    # H2 templates that work with the voice
    H2_TEMPLATES = {
        "problem": [
            "The Problem Nobody Talks About",
            "What's Really Going On",
            "The Hard Truth About {topic}",
            "Why This Matters More Than You Think"
        ],
        "scripture": [
            "What Scripture Actually Says",
            "The Verse That Changes Everything",
            "God's Word on {topic}",
            "KJV Truth: {topic}"
        ],
        "practical": [
            "What This Means For You",
            "Stop Reading, Start Doing",
            "The Practical Path Forward",
            "How To Actually {action}"
        ],
        "challenge": [
            "The Question You're Avoiding",
            "Your Move",
            "The Binary Choice",
            "No More Excuses"
        ],
        "story": [
            "A Man I Know",
            "What I Learned Hauling Garbage",
            "The Lesson Nobody Taught Me",
            "When It Got Real"
        ]
    }

    def __init__(self, output_dir: str = "outputs/articles", prompts_dir: str = "prompts"):
        self.output_dir = Path(output_dir)
        self.prompts_dir = Path(prompts_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate_content_brief(
        self,
        keyword: str,
        intent: str,
        target_word_count: int,
        competitor_data: Optional[dict] = None
    ) -> ContentBrief:
        """
        Generate a complete content brief.

        Args:
            keyword: Target keyword
            intent: Search intent type
            target_word_count: Recommended word count
            competitor_data: Optional competitor analysis

        Returns:
            ContentBrief ready for content generation
        """
        # Generate H2 sections based on intent
        h2_sections = self._generate_h2_structure(keyword, intent)

        # Generate key points
        key_points = self._generate_key_points(keyword)

        # Generate biblical angle
        biblical_angle = self._generate_biblical_angle(keyword)

        # Suggest internal links
        internal_links = self._suggest_internal_links(keyword)

        # Determine CTA type
        cta_type = self._determine_cta(intent)

        # Competitor notes
        competitor_notes = ""
        if competitor_data:
            competitor_notes = f"Target {competitor_data.get('recommended_word_count', target_word_count)} words. Gaps: {', '.join(competitor_data.get('content_gaps', [])[:3])}"

        return ContentBrief(
            keyword=keyword,
            secondary_keywords=self._generate_secondary_keywords(keyword),
            intent=intent,
            target_word_count=target_word_count,
            h2_sections=h2_sections,
            key_points=key_points,
            biblical_angle=biblical_angle,
            internal_links=internal_links,
            cta_type=cta_type,
            voice_reminders=self.VOICE_REMINDERS,
            competitor_notes=competitor_notes
        )

    def _generate_h2_structure(self, keyword: str, intent: str) -> list[str]:
        """Generate H2 section structure."""
        structure = []

        # Opening hook
        structure.append(f"The Hard Truth About {keyword.title()}")

        # Problem/context
        structure.append("What Nobody's Telling You")

        # Scripture foundation
        structure.append("What God's Word Says")

        # Practical application
        if intent in ["informational", "commercial"]:
            structure.append("What This Means For Your Life")
            structure.append("The Path Forward")

        # Challenge/binary choice
        structure.append("Your Move")

        return structure

    def _generate_key_points(self, keyword: str) -> list[str]:
        """Generate key points to cover."""
        return [
            f"Define {keyword} from biblical perspective (not cultural)",
            "Address the main objection/excuse men have",
            "Include at least one KJV verse with interpretation",
            "Add working-class/personal experience element",
            "Challenge comfortable Christianity on this topic",
            "End with specific, actionable binary choice"
        ]

    def _generate_biblical_angle(self, keyword: str) -> str:
        """Generate the unique biblical angle."""
        return f"Approach '{keyword}' from a confrontational, KJV-based perspective that challenges soft, mainstream Christianity and calls men to action."

    def _suggest_internal_links(self, keyword: str) -> list[str]:
        """Suggest internal linking opportunities."""
        return [
            "[INTERNAL LINK: biblical masculinity definition]",
            "[INTERNAL LINK: related Substack post]",
            "[INTERNAL LINK: relevant Gumroad product]"
        ]

    def _determine_cta(self, intent: str) -> str:
        """Determine appropriate CTA type."""
        cta_map = {
            "informational": "subscribe_substack",
            "commercial": "check_gumroad_product",
            "transactional": "buy_now",
            "navigational": "explore_site"
        }
        return cta_map.get(intent, "subscribe_substack")

    def _generate_secondary_keywords(self, keyword: str) -> list[str]:
        """Generate secondary keywords to include."""
        words = keyword.lower().split()
        secondary = []

        # Common variations
        if "biblical" in words:
            secondary.append(keyword.replace("biblical", "christian"))
            secondary.append(keyword.replace("biblical", "godly"))

        if "man" in words or "men" in words:
            secondary.append(keyword.replace("man", "husband"))
            secondary.append(keyword.replace("men", "husbands"))
            secondary.append(keyword.replace("man", "father"))

        # Add generic secondaries
        secondary.extend([
            f"{keyword} bible",
            f"{keyword} scripture",
            f"what is {keyword}"
        ])

        return secondary[:5]

    def get_article_prompt(self, brief: ContentBrief) -> str:
        """
        Generate the full article writing prompt.

        Args:
            brief: ContentBrief with all parameters

        Returns:
            Complete prompt for Claude/LLM
        """
        h2_list = "\n".join(f"- {h2}" for h2 in brief.h2_sections)
        points_list = "\n".join(f"- {point}" for point in brief.key_points)
        voice_list = "\n".join(f"- {reminder}" for reminder in brief.voice_reminders)
        secondary_kws = ", ".join(brief.secondary_keywords)

        prompt = f'''Write an SEO-optimized article for the keyword: "{brief.keyword}"

TARGET SPECS:
- Word count: {brief.target_word_count} words
- Intent: {brief.intent}
- Secondary keywords to include naturally: {secondary_kws}

H2 STRUCTURE (use these or similar):
{h2_list}

KEY POINTS TO COVER:
{points_list}

BIBLICAL ANGLE:
{brief.biblical_angle}

VOICE REQUIREMENTS (CRITICAL - DO NOT VIOLATE):
{voice_list}

SEO REQUIREMENTS:
- Include "{brief.keyword}" in:
  - Title (front-loaded)
  - First 100 words
  - At least 2 H2 headings
  - Meta description
- Natural keyword density (1-2%)
- Include these internal link placeholders: {brief.internal_links}

STRUCTURE FORMAT:
1. Opening hook (2-3 sentences, confrontational)
2. Problem identification (why this matters)
3. Scripture foundation (KJV, interpreted, not decorative)
4. Practical application (specific, actionable)
5. Challenge/binary choice ending (no soft landing)

COMPETITOR NOTES:
{brief.competitor_notes}

OUTPUT FORMAT:
---
TITLE: [Under 60 characters, includes keyword]
META_DESCRIPTION: [Under 160 characters, includes keyword + CTA hook]
---

[Full article in markdown with ## for H2, ### for H3]

---
INTERNAL_LINKS_SUGGESTED:
- [Topic 1]: [Suggested anchor text]
- [Topic 2]: [Suggested anchor text]
- [Topic 3]: [Suggested anchor text]
---

Write this like a man who's worked with his hands. Make it Biblical. Make it confrontational. Make it real.'''

        return prompt

    def get_brief_prompt(self, keyword: str, intent: str, word_count: int) -> str:
        """
        Generate prompt for creating a content brief.

        Args:
            keyword: Target keyword
            intent: Search intent
            word_count: Target word count

        Returns:
            Prompt for generating detailed brief
        """
        return f'''Create a complete content brief for: "{keyword}"

CONTEXT:
- Search intent: {intent}
- Target word count: {word_count}
- Niche: Biblical masculinity / Christian men
- Voice: Confrontational, KJV-based, working-class perspective

GENERATE:
1. **Target keyword**: {keyword}
2. **Secondary keywords** (3-5): Related terms to include naturally
3. **Search intent**: {intent}
4. **Recommended word count**: {word_count}
5. **Required H2 sections** (5-7):
   - Include specific heading text
   - Each should cover distinct aspect
   - At least one should be scripture-focused
   - Final one should be challenge/action
6. **Key points to cover**:
   - Main argument/thesis
   - Common objections to address
   - Scripture to include (KJV)
   - Personal/working-man element
7. **Biblical angle**: What makes this different from soft Christian content?
8. **Internal linking opportunities**: What existing content to link?
9. **CTA recommendation**: Based on intent, what action?
10. **Voice reminders**:
    - Specific phrases to use
    - Specific phrases to AVOID
    - Rhythm/structure notes

OUTPUT as JSON:
{{
  "keyword": "{keyword}",
  "secondary_keywords": [...],
  "intent": "{intent}",
  "target_word_count": {word_count},
  "h2_sections": [
    {{"heading": "...", "purpose": "..."}}
  ],
  "key_points": [...],
  "scripture_to_include": [
    {{"reference": "...", "application": "..."}}
  ],
  "biblical_angle": "...",
  "internal_links": [...],
  "cta": {{
    "type": "...",
    "text_suggestion": "..."
  }},
  "voice_reminders": {{
    "do": [...],
    "avoid": [...],
    "style_notes": "..."
  }}
}}'''

    def get_product_page_prompt(
        self,
        product_name: str,
        price: str,
        current_description: str
    ) -> str:
        """
        Generate prompt for Gumroad product page optimization.

        Args:
            product_name: Name of the product
            price: Product price
            current_description: Existing description

        Returns:
            Prompt for product page optimization
        """
        return f'''Optimize this Gumroad product for SEO and conversion:

PRODUCT: {product_name}
PRICE: {price}
CURRENT DESCRIPTION:
{current_description}

CREATE:

1. **SEO-Optimized Title** (keyword + benefit, under 60 chars)

2. **Meta Description** (under 160 chars, keyword + CTA)

3. **Rewritten Product Description** using Biblical Man voice:
   - Lead with the pain point (what problem does this solve?)
   - Agitate with specificity (make them feel it)
   - Present product as tool (not savior - only Christ saves)
   - Include social proof placeholder [TESTIMONIAL]
   - End with direct CTA
   - Use staccato rhythm
   - Include relevant scripture if appropriate

4. **Product Features** (bullet points, benefit-focused):
   - What they get
   - What changes
   - Why this, not that

5. **Target Keywords** (5 long-tail keywords to optimize for):
   - Primary transactional keyword
   - Secondary informational keywords
   - Related questions people search

6. **Objection Handling**:
   - Common objections
   - Biblical response to each

OUTPUT FORMAT:
```
TITLE: [optimized title]
META: [meta description]

DESCRIPTION:
[Full rewritten description in Biblical Man voice]

FEATURES:
- [Feature 1]
- [Feature 2]
...

KEYWORDS:
1. [primary]
2. [secondary]
...

OBJECTIONS:
- Objection: [objection]
  Response: [response]
...
```

Make it sell without being salesy. Biblical Man doesn't beg - he offers a tool and lets men choose.'''

    def save_content(self, content: GeneratedContent, filename: Optional[str] = None):
        """Save generated content to file."""
        if filename is None:
            # Generate filename from keyword
            safe_keyword = content.keyword.lower().replace(" ", "-")[:50]
            date_str = datetime.now().strftime("%Y%m%d")
            filename = f"{date_str}-{safe_keyword}.md"

        filepath = self.output_dir / filename

        # Build full markdown file
        output = f"""---
keyword: {content.keyword}
title: {content.title}
meta_description: {content.meta_description}
word_count: {content.word_count}
generated_at: {content.generated_at}
---

{content.content_markdown}

---
## Internal Link Suggestions
{chr(10).join(f"- {link}" for link in content.suggested_internal_links)}

## Voice Check Notes
{chr(10).join(f"- {note}" for note in content.voice_check_notes)}
"""

        with open(filepath, 'w') as f:
            f.write(output)

        return filepath

    def save_brief(self, brief: ContentBrief, filename: Optional[str] = None):
        """Save content brief to file."""
        briefs_dir = self.output_dir.parent / "briefs"
        briefs_dir.mkdir(parents=True, exist_ok=True)

        if filename is None:
            safe_keyword = brief.keyword.lower().replace(" ", "-")[:50]
            date_str = datetime.now().strftime("%Y%m%d")
            filename = f"brief-{date_str}-{safe_keyword}.json"

        filepath = briefs_dir / filename

        with open(filepath, 'w') as f:
            json.dump(asdict(brief), f, indent=2)

        return filepath


def main():
    """Test the content generator."""
    generator = ContentGenerator()

    # Generate a content brief
    brief = generator.generate_content_brief(
        keyword="biblical masculinity",
        intent="informational",
        target_word_count=1800
    )

    print("=== CONTENT BRIEF ===")
    print(f"Keyword: {brief.keyword}")
    print(f"Word count: {brief.target_word_count}")
    print(f"Intent: {brief.intent}")
    print(f"\nH2 Sections:")
    for h2 in brief.h2_sections:
        print(f"  - {h2}")
    print(f"\nKey Points:")
    for point in brief.key_points:
        print(f"  - {point}")

    # Generate article prompt
    prompt = generator.get_article_prompt(brief)
    print("\n=== ARTICLE PROMPT (first 1000 chars) ===")
    print(prompt[:1000] + "...")

    # Generate product page prompt
    product_prompt = generator.get_product_page_prompt(
        product_name="Biblical Manhood Blueprint",
        price="$19",
        current_description="A guide to being a godly man."
    )
    print("\n=== PRODUCT PAGE PROMPT (first 500 chars) ===")
    print(product_prompt[:500] + "...")


if __name__ == "__main__":
    main()
