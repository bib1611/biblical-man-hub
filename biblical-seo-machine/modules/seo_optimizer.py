"""
Biblical SEO Machine - SEO Optimizer Module

Analyzes and optimizes content for SEO while preserving voice.
Checks:
- Keyword density and placement
- Heading structure
- Readability
- Internal linking
- Voice compliance
"""

import re
from dataclasses import dataclass, field
from typing import Optional
from pathlib import Path


@dataclass
class SEOScore:
    """SEO optimization score and breakdown."""
    overall_score: int  # 0-100
    keyword_score: int
    structure_score: int
    readability_score: int
    voice_score: int
    issues: list[str] = field(default_factory=list)
    recommendations: list[str] = field(default_factory=list)


@dataclass
class VoiceViolation:
    """A detected voice guideline violation."""
    violation_type: str
    text_found: str
    location: str
    severity: str  # low, medium, high
    suggestion: str


class SEOOptimizer:
    """
    Optimizes content for SEO while checking voice compliance.
    """

    # SEO parameters
    TITLE_MAX_LENGTH = 60
    META_MAX_LENGTH = 160
    MIN_WORD_COUNT = 800
    KEYWORD_DENSITY_MIN = 0.01
    KEYWORD_DENSITY_MAX = 0.025
    MIN_H2_COUNT = 3
    MAX_PARAGRAPH_LENGTH = 150  # words

    # Voice violation patterns
    THERAPY_SPEAK = [
        "boundaries", "toxic", "triggered", "trauma", "safe space",
        "self-care", "validate", "validated", "journey", "healing journey",
        "unpack", "sit with", "hold space"
    ]

    SOFT_QUALIFIERS = [
        "i think", "maybe", "perhaps", "sort of", "kind of",
        "in my opinion", "it seems", "possibly", "might be",
        "could potentially", "i believe", "i feel like"
    ]

    PROSPERITY_GOSPEL = [
        "blessed and highly favored", "breakthrough", "abundance mindset",
        "unlock your potential", "destiny", "god wants you to be happy",
        "manifest", "claim your blessing", "divine favor"
    ]

    # Good patterns to look for
    VOICE_STRENGTHS = [
        r"\byou\b",  # Direct address
        r"\bbrother\b",
        r"\bmen\b",
        r"—",  # Em dash (rhythm)
        r"\.",  # Short sentences indicated by periods
    ]

    def __init__(self):
        pass

    def analyze(self, content: str, keyword: str, title: str = "", meta: str = "") -> SEOScore:
        """
        Analyze content for SEO optimization.

        Args:
            content: The article content
            keyword: Target keyword
            title: Article title
            meta: Meta description

        Returns:
            SEOScore with detailed breakdown
        """
        issues = []
        recommendations = []

        # Keyword analysis
        keyword_score = self._analyze_keywords(content, keyword, title, meta, issues, recommendations)

        # Structure analysis
        structure_score = self._analyze_structure(content, keyword, issues, recommendations)

        # Readability analysis
        readability_score = self._analyze_readability(content, issues, recommendations)

        # Voice analysis
        voice_score = self._analyze_voice(content, issues, recommendations)

        # Calculate overall score
        overall_score = int(
            keyword_score * 0.3 +
            structure_score * 0.25 +
            readability_score * 0.20 +
            voice_score * 0.25
        )

        return SEOScore(
            overall_score=overall_score,
            keyword_score=keyword_score,
            structure_score=structure_score,
            readability_score=readability_score,
            voice_score=voice_score,
            issues=issues,
            recommendations=recommendations
        )

    def _analyze_keywords(
        self,
        content: str,
        keyword: str,
        title: str,
        meta: str,
        issues: list,
        recommendations: list
    ) -> int:
        """Analyze keyword usage and density."""
        score = 100
        content_lower = content.lower()
        keyword_lower = keyword.lower()

        # Word count
        words = content.split()
        word_count = len(words)

        if word_count < self.MIN_WORD_COUNT:
            score -= 20
            issues.append(f"Word count ({word_count}) below minimum ({self.MIN_WORD_COUNT})")
            recommendations.append(f"Add {self.MIN_WORD_COUNT - word_count} more words")

        # Keyword density
        keyword_count = content_lower.count(keyword_lower)
        if word_count > 0:
            density = keyword_count / word_count

            if density < self.KEYWORD_DENSITY_MIN:
                score -= 15
                issues.append(f"Keyword density ({density:.2%}) too low")
                recommendations.append(f"Add keyword '{keyword}' more naturally")
            elif density > self.KEYWORD_DENSITY_MAX:
                score -= 10
                issues.append(f"Keyword density ({density:.2%}) too high - may seem spammy")
                recommendations.append("Reduce keyword repetition, use variations")

        # Keyword in title
        if title and keyword_lower not in title.lower():
            score -= 15
            issues.append("Keyword not in title")
            recommendations.append(f"Include '{keyword}' in title")

        # Keyword in meta
        if meta and keyword_lower not in meta.lower():
            score -= 10
            issues.append("Keyword not in meta description")
            recommendations.append(f"Include '{keyword}' in meta description")

        # Keyword in first 100 words
        first_100 = " ".join(words[:100]).lower()
        if keyword_lower not in first_100:
            score -= 15
            issues.append("Keyword not in first 100 words")
            recommendations.append(f"Add '{keyword}' to opening paragraph")

        # Title length
        if title:
            if len(title) > self.TITLE_MAX_LENGTH:
                score -= 10
                issues.append(f"Title too long ({len(title)} chars, max {self.TITLE_MAX_LENGTH})")
                recommendations.append("Shorten title to under 60 characters")

        # Meta length
        if meta:
            if len(meta) > self.META_MAX_LENGTH:
                score -= 10
                issues.append(f"Meta description too long ({len(meta)} chars)")
                recommendations.append("Shorten meta to under 160 characters")

        return max(0, score)

    def _analyze_structure(
        self,
        content: str,
        keyword: str,
        issues: list,
        recommendations: list
    ) -> int:
        """Analyze heading structure."""
        score = 100
        keyword_lower = keyword.lower()

        # Count H2s
        h2_pattern = r"^##\s+(.+)$"
        h2_matches = re.findall(h2_pattern, content, re.MULTILINE)
        h2_count = len(h2_matches)

        if h2_count < self.MIN_H2_COUNT:
            score -= 20
            issues.append(f"Only {h2_count} H2 headings (minimum {self.MIN_H2_COUNT})")
            recommendations.append(f"Add {self.MIN_H2_COUNT - h2_count} more H2 sections")

        # Check keyword in H2s
        h2_with_keyword = sum(1 for h2 in h2_matches if keyword_lower in h2.lower())
        if h2_with_keyword < 2:
            score -= 15
            issues.append("Keyword appears in fewer than 2 H2 headings")
            recommendations.append(f"Include '{keyword}' in at least 2 H2 headings")

        # Check H3s exist under H2s
        h3_pattern = r"^###\s+(.+)$"
        h3_matches = re.findall(h3_pattern, content, re.MULTILINE)

        if h2_count > 4 and len(h3_matches) < 2:
            score -= 10
            issues.append("No H3 subheadings for long content")
            recommendations.append("Add H3 subheadings to break up longer sections")

        # Check for internal link placeholders
        internal_link_pattern = r"\[INTERNAL LINK:.*?\]"
        internal_links = re.findall(internal_link_pattern, content)

        if len(internal_links) < 2:
            score -= 10
            issues.append("Fewer than 2 internal link opportunities marked")
            recommendations.append("Add internal link placeholders to relevant content")

        return max(0, score)

    def _analyze_readability(
        self,
        content: str,
        issues: list,
        recommendations: list
    ) -> int:
        """Analyze readability for the voice."""
        score = 100

        # Split into paragraphs
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip() and not p.startswith("#")]

        # Check paragraph length
        long_paragraphs = 0
        for p in paragraphs:
            word_count = len(p.split())
            if word_count > self.MAX_PARAGRAPH_LENGTH:
                long_paragraphs += 1

        if long_paragraphs > 2:
            score -= 15
            issues.append(f"{long_paragraphs} paragraphs exceed {self.MAX_PARAGRAPH_LENGTH} words")
            recommendations.append("Break up long paragraphs for staccato rhythm")

        # Check sentence variety (fragments are good for this voice)
        sentences = re.split(r'[.!?]+', content)
        short_sentences = sum(1 for s in sentences if len(s.split()) <= 5)
        sentence_ratio = short_sentences / len(sentences) if sentences else 0

        if sentence_ratio < 0.2:
            score -= 10
            issues.append("Not enough short/fragment sentences")
            recommendations.append("Add more punchy, short sentences for rhythm")

        # Check for white space (section breaks)
        if content.count("\n\n") < 5:
            score -= 10
            issues.append("Not enough paragraph breaks")
            recommendations.append("Add more white space between thoughts")

        return max(0, score)

    def _analyze_voice(
        self,
        content: str,
        issues: list,
        recommendations: list
    ) -> int:
        """Analyze voice compliance."""
        score = 100
        content_lower = content.lower()

        violations = []

        # Check therapy-speak
        for term in self.THERAPY_SPEAK:
            if term in content_lower:
                violations.append(f"Therapy-speak: '{term}'")
                score -= 10

        # Check soft qualifiers
        for qualifier in self.SOFT_QUALIFIERS:
            if qualifier in content_lower:
                violations.append(f"Soft qualifier: '{qualifier}'")
                score -= 8

        # Check prosperity gospel
        for term in self.PROSPERITY_GOSPEL:
            if term in content_lower:
                violations.append(f"Prosperity gospel adjacent: '{term}'")
                score -= 12

        if violations:
            issues.extend(violations[:5])  # Show first 5
            if len(violations) > 5:
                issues.append(f"...and {len(violations) - 5} more voice violations")
            recommendations.append("Replace flagged terms with Biblical Man alternatives")

        # Check for positive voice indicators
        direct_address = len(re.findall(r"\byou\b", content_lower))
        if direct_address < 10:
            score -= 10
            issues.append("Not enough direct address ('you')")
            recommendations.append("Add more direct 'you' address")

        # Check for scripture
        kjv_pattern = r"—\s*\d?\s*[A-Za-z]+\s+\d+:\d+"
        scripture_refs = re.findall(kjv_pattern, content)
        if len(scripture_refs) < 1:
            score -= 15
            issues.append("No Scripture references found")
            recommendations.append("Add at least one KJV verse with interpretation")

        return max(0, score)

    def get_voice_violations(self, content: str) -> list[VoiceViolation]:
        """
        Get detailed voice violations.

        Args:
            content: Content to analyze

        Returns:
            List of VoiceViolation objects
        """
        violations = []
        content_lower = content.lower()

        # Check each category
        for term in self.THERAPY_SPEAK:
            if term in content_lower:
                violations.append(VoiceViolation(
                    violation_type="therapy_speak",
                    text_found=term,
                    location=self._find_context(content, term),
                    severity="high",
                    suggestion=f"Replace '{term}' with biblical alternative"
                ))

        for term in self.SOFT_QUALIFIERS:
            if term in content_lower:
                violations.append(VoiceViolation(
                    violation_type="soft_qualifier",
                    text_found=term,
                    location=self._find_context(content, term),
                    severity="medium",
                    suggestion=f"Remove '{term}' - state directly"
                ))

        for term in self.PROSPERITY_GOSPEL:
            if term in content_lower:
                violations.append(VoiceViolation(
                    violation_type="prosperity_gospel",
                    text_found=term,
                    location=self._find_context(content, term),
                    severity="high",
                    suggestion=f"Remove '{term}' - not biblical"
                ))

        return violations

    def _find_context(self, content: str, term: str, context_words: int = 5) -> str:
        """Find the context around a term."""
        idx = content.lower().find(term.lower())
        if idx == -1:
            return ""

        # Get surrounding text
        start = max(0, idx - 50)
        end = min(len(content), idx + len(term) + 50)

        context = content[start:end]
        if start > 0:
            context = "..." + context
        if end < len(content):
            context = context + "..."

        return context

    def get_optimization_prompt(self, content: str, keyword: str, score: SEOScore) -> str:
        """
        Generate prompt for LLM-based optimization.

        Args:
            content: Current content
            keyword: Target keyword
            score: Current SEO score

        Returns:
            Prompt for optimization
        """
        issues_list = "\n".join(f"- {issue}" for issue in score.issues)
        rec_list = "\n".join(f"- {rec}" for rec in score.recommendations)

        return f'''Optimize this content for SEO while preserving Biblical Man voice:

TARGET KEYWORD: "{keyword}"
CURRENT SCORE: {score.overall_score}/100

ISSUES FOUND:
{issues_list}

RECOMMENDATIONS:
{rec_list}

CONTENT TO OPTIMIZE:
---
{content}
---

OPTIMIZATION INSTRUCTIONS:

1. **Fix Keyword Issues** (Score: {score.keyword_score}/100)
   - Ensure keyword appears in title, first 100 words, and 2+ H2s
   - Maintain natural density (1-2%)
   - Use keyword variations naturally

2. **Fix Structure Issues** (Score: {score.structure_score}/100)
   - Ensure 4-6 H2 headings
   - Add H3s under long sections
   - Add internal link placeholders

3. **Fix Readability Issues** (Score: {score.readability_score}/100)
   - Break up long paragraphs
   - Add short/fragment sentences
   - Increase white space

4. **Fix Voice Issues** (Score: {score.voice_score}/100)
   - Remove ALL therapy-speak terms
   - Remove ALL soft qualifiers
   - Add more direct "you" address
   - Ensure Scripture is integrated, not decorative

OUTPUT FORMAT:
---
TITLE: [Optimized title, under 60 chars]
META: [Optimized meta, under 160 chars]
---

[Full optimized content with all issues fixed]

---
CHANGES MADE:
- [List of specific changes]
---

Preserve the confrontational voice. Make it rank AND sound like Biblical Man.'''

    def get_voice_check_prompt(self, content: str) -> str:
        """
        Generate prompt for voice compliance check.

        Args:
            content: Content to check

        Returns:
            Prompt for voice checking
        """
        return f'''Review this content for Biblical Man voice compliance:

---
{content}
---

CHECK FOR VIOLATIONS:
- [ ] Therapy-speak ("boundaries," "toxic," "triggered," "journey")
- [ ] Soft qualifications ("I think," "maybe," "perhaps")
- [ ] Prosperity gospel adjacent language
- [ ] Seminary jargon without translation
- [ ] Long paragraphs (5+ sentences)
- [ ] Missing scripture integration
- [ ] Missing personal/working-man element
- [ ] Passive voice overuse
- [ ] Missing direct address ("You")
- [ ] Soft ending instead of challenge

FOR EACH VIOLATION FOUND:
1. Quote the problematic text
2. Explain why it violates voice
3. Provide specific replacement

OUTPUT:
{{
  "score": X/10,
  "violations": [
    {{
      "type": "therapy_speak|soft_qualifier|prosperity|etc",
      "text": "the problematic text",
      "location": "paragraph/sentence context",
      "fix": "specific replacement text"
    }}
  ],
  "strengths": [
    "what the content does well"
  ],
  "overall_assessment": "summary of voice compliance",
  "priority_fixes": [
    "most important changes to make"
  ]
}}'''

    def get_voice_injection_prompt(self, content: str) -> str:
        """
        Generate prompt to inject voice into generic content.

        Args:
            content: Content to transform

        Returns:
            Prompt for voice injection
        """
        return f'''Rewrite this SEO content to match Biblical Man voice:

---
{content}
---

APPLY THESE TRANSFORMATIONS:

1. **Staccato rhythm**
   - Break up long sentences
   - Add fragment sentences for punch
   - More white space between thoughts

2. **Direct address**
   - Add "You" statements
   - Use "Brother" for emphasis
   - Make it personal

3. **Scripture integration**
   - Add one relevant KJV verse
   - Interpret it (don't just drop it)
   - Connect ancient text to modern struggle

4. **Working-man element**
   - Add one blue-collar metaphor
   - Make it physical, tangible
   - Not theory - lived experience

5. **Remove softness**
   - Delete ALL qualifiers (maybe, perhaps, I think)
   - Make statements declarative
   - No apologizing for truth

6. **Challenge ending**
   - End with binary choice
   - No soft landing
   - Make them decide

OUTPUT:
Rewritten version that ranks AND sounds authentic to Biblical Man.

After the rewrite, list the specific changes made.'''


def main():
    """Test the SEO optimizer."""
    optimizer = SEOOptimizer()

    # Sample content to analyze
    sample_content = """
## What is Biblical Masculinity?

I think biblical masculinity is perhaps the most important topic for Christian men today.
Maybe we should consider what the Bible says about being a man.

In today's world, men are struggling with their identity. The culture tells us that
traditional masculinity is toxic, but is that really true? Perhaps we need to look
deeper at what Scripture teaches.

## The Importance of Understanding Your Journey

Your healing journey as a man starts with setting healthy boundaries. It's important
to validate your feelings while also holding space for growth. Self-care isn't selfish -
it's necessary for breakthrough.

God wants you to be happy and blessed and highly favored. You just need to unlock
your potential and manifest your destiny.

## What the Bible Says

"Quit you like men, be strong." - 1 Corinthians 16:13

This verse is good advice.

## Conclusion

I hope this article has given you some things to think about on your journey toward
biblical masculinity. Consider taking some steps to grow in this area.
"""

    # Analyze
    score = optimizer.analyze(
        content=sample_content,
        keyword="biblical masculinity",
        title="What is Biblical Masculinity? A Guide",
        meta="Learn about biblical masculinity and what it means for Christian men today."
    )

    print("=== SEO ANALYSIS ===")
    print(f"Overall Score: {score.overall_score}/100")
    print(f"  Keyword: {score.keyword_score}/100")
    print(f"  Structure: {score.structure_score}/100")
    print(f"  Readability: {score.readability_score}/100")
    print(f"  Voice: {score.voice_score}/100")

    print("\nISSUES:")
    for issue in score.issues:
        print(f"  - {issue}")

    print("\nRECOMMENDATIONS:")
    for rec in score.recommendations:
        print(f"  - {rec}")

    # Get voice violations
    print("\n=== VOICE VIOLATIONS ===")
    violations = optimizer.get_voice_violations(sample_content)
    for v in violations[:5]:
        print(f"  [{v.severity.upper()}] {v.violation_type}: '{v.text_found}'")


if __name__ == "__main__":
    main()
