"""
Biblical SEO Machine - Competitor Analysis Module

Analyzes top SERP results for target keywords to extract:
- Word counts and content length benchmarks
- Heading structures (H2s, H3s)
- Content gaps and opportunities
- Biblical perspective differentiation potential
"""

import json
from dataclasses import dataclass, asdict
from typing import Optional
from pathlib import Path


@dataclass
class CompetitorContent:
    """Represents a competitor's content analysis."""
    url: str
    title: str
    word_count: int
    h2_count: int
    h3_count: int
    h2_headings: list[str]
    has_scripture: bool
    tone: str  # soft, moderate, bold
    content_type: str
    strengths: list[str]
    weaknesses: list[str]


@dataclass
class CompetitorBenchmark:
    """Aggregated benchmark from competitor analysis."""
    keyword: str
    avg_word_count: int
    min_word_count: int
    max_word_count: int
    recommended_word_count: int
    common_h2_topics: list[str]
    content_gaps: list[str]
    biblical_angle_opportunities: list[str]
    competitors_analyzed: int


class CompetitorAnalyzer:
    """
    Analyzes competitor content for SERP benchmarking.

    Designed to work with Claude/LLM for analysis,
    with optional integration to SerpAPI or DataForSEO.
    """

    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.cache_path = self.data_dir / "competitor_data.json"
        self.cache = self._load_cache()

    def _load_cache(self) -> dict:
        """Load cached competitor data."""
        if self.cache_path.exists():
            with open(self.cache_path, 'r') as f:
                return json.load(f)
        return {"analyses": {}}

    def save_cache(self):
        """Save competitor data to cache."""
        self.data_dir.mkdir(parents=True, exist_ok=True)
        with open(self.cache_path, 'w') as f:
            json.dump(self.cache, f, indent=2)

    def get_analysis_prompt(self, keyword: str) -> str:
        """
        Generate prompt for LLM-based competitor analysis.

        Args:
            keyword: Target keyword to analyze SERP for

        Returns:
            Formatted prompt for Claude/LLM
        """
        prompt = f'''Analyze the top-ranking content for the keyword: "{keyword}"

Imagine you have access to the top 10 Google search results. For each of the top 5 results, analyze:

1. **Content Metrics:**
   - Estimated word count
   - Number of H2 and H3 headings
   - Content type (article, guide, listicle, video, forum)

2. **Heading Structure:**
   - List the likely H2 headings based on the keyword
   - Common subtopics covered

3. **Tone Analysis:**
   - soft: Accommodating, gentle, avoiding confrontation
   - moderate: Balanced, mainstream Christian perspective
   - bold: Direct, challenging, takes strong positions

4. **Scripture Usage:**
   - Does competing content use Scripture heavily?
   - Which versions (NIV, ESV, KJV)?
   - Is it integrated or decorative?

5. **Content Gaps:**
   - What are they NOT saying that Biblical Man would say?
   - Where is the soft underbelly?
   - What hard truths are they avoiding?

6. **Opportunities for Biblical Differentiation:**
   - Where can we be more confrontational?
   - What working-man perspective is missing?
   - What KJV truth would cut through their softness?

OUTPUT FORMAT (JSON):
{{
  "keyword": "{keyword}",
  "serp_overview": {{
    "total_results_analyzed": 5,
    "dominant_content_type": "article|guide|listicle",
    "dominant_tone": "soft|moderate|bold",
    "scripture_presence": "none|light|heavy"
  }},
  "benchmarks": {{
    "avg_word_count": 1500,
    "min_word_count": 800,
    "max_word_count": 2500,
    "recommended_word_count": 1800,
    "avg_h2_count": 5,
    "recommended_h2_count": 6
  }},
  "common_h2_topics": [
    "What is [topic]",
    "Why [topic] matters",
    "How to [topic]",
    "Bible verses about [topic]"
  ],
  "competitors": [
    {{
      "rank": 1,
      "url_type": "major_christian_site|personal_blog|church|secular",
      "estimated_word_count": 1500,
      "tone": "soft",
      "strengths": ["comprehensive", "well-structured"],
      "weaknesses": ["avoids hard truths", "generic advice", "no personal voice"]
    }}
  ],
  "content_gaps": [
    "No confrontation of comfortable Christianity",
    "Missing working-class perspective",
    "Scripture used decoratively, not structurally",
    "No binary challenges - everything is 'consider this'"
  ],
  "biblical_man_opportunities": [
    "Lead with challenge instead of comfort",
    "Use KJV with actual interpretation",
    "Include personal blue-collar experience",
    "End with binary choice, not soft landing"
  ],
  "recommended_approach": {{
    "word_count": 1800,
    "structure": "Problem → Hard Truth → Scripture → Challenge",
    "tone": "confrontational but pastoral",
    "unique_angle": "What mainstream content won't say"
  }}
}}'''

        return prompt

    def get_content_length_prompt(self, keyword: str) -> str:
        """
        Generate focused prompt for content length benchmarking.

        Args:
            keyword: Target keyword

        Returns:
            Prompt focused on word count analysis
        """
        return f'''For the keyword "{keyword}", estimate the content length benchmark:

Based on typical SERP results for Christian/religious content keywords:

1. What word count range do top results likely have?
2. What's the minimum to compete?
3. What's optimal for ranking + engagement?
4. Should we go longer or more concise than competitors?

Consider:
- Informational keywords typically need 1500-2500 words
- "How to" guides often need 2000+ words
- Devotional content can be shorter (800-1200)
- List posts vary by list length

Output:
{{
  "keyword": "{keyword}",
  "estimated_competitor_range": "1200-2000 words",
  "minimum_to_compete": 1200,
  "recommended_length": 1800,
  "reasoning": "Explanation of recommendation"
}}'''

    def get_heading_analysis_prompt(self, keyword: str) -> str:
        """
        Generate prompt for heading structure analysis.

        Args:
            keyword: Target keyword

        Returns:
            Prompt for H2/H3 structure analysis
        """
        return f'''For the keyword "{keyword}", predict the heading structure of top-ranking content:

1. What H2 sections would competitors typically include?
2. What's the standard structure for this content type?
3. What H2 would Biblical Man add that others miss?

Generate a recommended heading structure that:
- Covers what competitors cover (for SEO completeness)
- Adds unique biblical/confrontational angles
- Follows the staccato rhythm in heading text

Output:
{{
  "keyword": "{keyword}",
  "typical_competitor_h2s": [
    "What is [topic]",
    "Why [topic] matters",
    "Steps to [topic]",
    "Bible verses about [topic]"
  ],
  "biblical_man_h2s": [
    "The Hard Truth About [topic]",
    "What Your Pastor Won't Tell You",
    "Scripture That Demands Action",
    "Stop Making Excuses",
    "The Binary Choice"
  ],
  "recommended_structure": [
    {{"h2": "Opening Hook H2", "purpose": "grab attention with challenge"}},
    {{"h2": "The Problem H2", "purpose": "name the pain"}},
    {{"h2": "The Hard Truth H2", "purpose": "confrontational insight"}},
    {{"h2": "What Scripture Says H2", "purpose": "KJV foundation"}},
    {{"h2": "What This Means For You H2", "purpose": "practical application"}},
    {{"h2": "The Choice H2", "purpose": "binary ending"}}
  ]
}}'''

    def analyze_content_gaps(self, keyword: str, competitor_data: list[dict]) -> list[str]:
        """
        Identify content gaps from competitor analysis.

        Args:
            keyword: Target keyword
            competitor_data: List of analyzed competitor content

        Returns:
            List of identified content gaps
        """
        # Default gaps that apply to most mainstream Christian content
        standard_gaps = [
            "Avoids confrontational language",
            "Uses soft qualifiers ('maybe', 'consider')",
            "Scripture is decorative, not structural",
            "Missing working-class perspective",
            "No personal struggle/testimony",
            "Ends with soft encouragement instead of challenge",
            "Therapy-speak instead of biblical language",
            "Avoids binary choices",
            "Too academic/seminary tone",
            "Missing the 'so what' application"
        ]

        # Analyze competitor data for specific gaps
        gaps = []

        if competitor_data:
            tones = [c.get("tone", "soft") for c in competitor_data]
            if tones.count("soft") > len(tones) // 2:
                gaps.append("Competitors are predominantly soft-toned - opportunity to be bold")

            scripture_presence = [c.get("has_scripture", False) for c in competitor_data]
            if scripture_presence.count(True) < len(scripture_presence) // 2:
                gaps.append("Most competitors light on Scripture - opportunity for KJV depth")

        return gaps or standard_gaps[:5]

    def get_benchmark(self, keyword: str) -> Optional[CompetitorBenchmark]:
        """
        Get cached benchmark for a keyword.

        Args:
            keyword: Target keyword

        Returns:
            CompetitorBenchmark if cached, None otherwise
        """
        cached = self.cache.get("analyses", {}).get(keyword)
        if cached:
            return CompetitorBenchmark(**cached)
        return None

    def save_benchmark(self, benchmark: CompetitorBenchmark):
        """Save a benchmark to cache."""
        self.cache["analyses"][benchmark.keyword] = asdict(benchmark)
        self.save_cache()

    def get_quick_benchmark(self, keyword: str, intent: str = "informational") -> dict:
        """
        Get quick benchmark estimates based on keyword type.

        Args:
            keyword: Target keyword
            intent: Search intent type

        Returns:
            Estimated benchmark data
        """
        # Baseline benchmarks by intent
        benchmarks = {
            "informational": {
                "min_word_count": 1200,
                "recommended_word_count": 1800,
                "max_word_count": 2500,
                "h2_count": 5,
                "h3_count": 8
            },
            "commercial": {
                "min_word_count": 1500,
                "recommended_word_count": 2200,
                "max_word_count": 3000,
                "h2_count": 6,
                "h3_count": 10
            },
            "transactional": {
                "min_word_count": 800,
                "recommended_word_count": 1200,
                "max_word_count": 1800,
                "h2_count": 4,
                "h3_count": 6
            },
            "navigational": {
                "min_word_count": 500,
                "recommended_word_count": 800,
                "max_word_count": 1200,
                "h2_count": 3,
                "h3_count": 4
            }
        }

        base = benchmarks.get(intent, benchmarks["informational"])

        # Adjust for keyword complexity
        word_count = len(keyword.split())
        if word_count >= 5:  # Long-tail, can be more focused
            base["recommended_word_count"] = int(base["recommended_word_count"] * 0.9)

        return {
            "keyword": keyword,
            "intent": intent,
            **base,
            "note": "Estimated benchmark - run full analysis for accuracy"
        }


def main():
    """Test the competitor analyzer."""
    analyzer = CompetitorAnalyzer(data_dir="data")

    keyword = "biblical masculinity"

    # Generate analysis prompt
    prompt = analyzer.get_analysis_prompt(keyword)
    print("=== COMPETITOR ANALYSIS PROMPT ===")
    print(prompt[:1000] + "...\n")

    # Get quick benchmark
    benchmark = analyzer.get_quick_benchmark(keyword, "informational")
    print("=== QUICK BENCHMARK ===")
    for key, value in benchmark.items():
        print(f"  {key}: {value}")

    # Show content gaps
    print("\n=== STANDARD CONTENT GAPS ===")
    gaps = analyzer.analyze_content_gaps(keyword, [])
    for gap in gaps:
        print(f"  - {gap}")


if __name__ == "__main__":
    main()
