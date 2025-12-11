"""
Biblical SEO Machine - Keyword Research Module

Generates long-tail keyword variations, estimates search volume,
and scores opportunities for the biblical masculinity niche.
"""

import json
import os
from typing import Optional
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class KeywordOpportunity:
    """Represents a keyword opportunity with SEO metrics."""
    keyword: str
    intent: str  # informational, navigational, transactional, commercial
    competition: str  # low, medium, high
    opportunity_score: int  # 1-10
    content_type: str  # article, guide, product_page, listicle
    search_volume_estimate: str  # low, medium, high
    notes: str = ""


class KeywordResearcher:
    """
    Handles keyword research and expansion for biblical masculinity content.

    This module works with Claude/LLM to generate keyword variations
    and can integrate with DataForSEO or SerpAPI for real metrics.
    """

    # Seed keyword categories for biblical masculinity niche
    SEED_CATEGORIES = {
        "identity": [
            "biblical masculinity",
            "christian manhood",
            "godly man",
            "man of God",
            "biblical man"
        ],
        "marriage": [
            "christian husband",
            "biblical husband",
            "husband leadership",
            "spiritual head of household",
            "ephesians 5 husband"
        ],
        "fatherhood": [
            "christian father",
            "biblical fatherhood",
            "faith and fatherhood",
            "raising sons",
            "discipling children"
        ],
        "faith": [
            "mens bible study",
            "christian men faith",
            "spiritual disciplines men",
            "prayer life men",
            "scripture memorization"
        ],
        "leadership": [
            "servant leadership christian",
            "church leadership men",
            "leading your family",
            "spiritual authority",
            "biblical eldership"
        ],
        "struggle": [
            "christian men temptation",
            "overcoming lust christian",
            "porn addiction christian",
            "anger christian man",
            "fear christian man"
        ],
        "work": [
            "christian work ethic",
            "faith at work",
            "biblical view of work",
            "providing for family",
            "vocation calling christian"
        ],
        "culture": [
            "masculinity crisis",
            "feminized church",
            "men leaving church",
            "biblical vs toxic masculinity",
            "christian masculinity movement"
        ]
    }

    # Long-tail modifiers for expansion
    MODIFIERS = {
        "how_to": ["how to be a", "how to become", "steps to", "guide to"],
        "what_is": ["what is", "what does", "meaning of", "definition of"],
        "why": ["why men need", "why christian men", "importance of"],
        "best": ["best books on", "best resources for", "top tips for"],
        "vs": ["vs", "versus", "compared to", "difference between"],
        "for": ["for husbands", "for fathers", "for young men", "for christian men"],
        "bible": ["bible verses about", "scripture on", "what the bible says about"],
        "questions": ["is it biblical to", "should christian men", "can a christian man"]
    }

    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.database_path = self.data_dir / "keyword_database.json"
        self.keywords = self._load_database()

    def _load_database(self) -> dict:
        """Load existing keyword database or create empty one."""
        if self.database_path.exists():
            with open(self.database_path, 'r') as f:
                return json.load(f)
        return {"keywords": [], "last_updated": None}

    def save_database(self):
        """Save keyword database to JSON file."""
        self.data_dir.mkdir(parents=True, exist_ok=True)
        with open(self.database_path, 'w') as f:
            json.dump(self.keywords, f, indent=2)

    def get_expansion_prompt(self, seed_keyword: str) -> str:
        """
        Generate the prompt for LLM-based keyword expansion.

        Args:
            seed_keyword: The base keyword to expand

        Returns:
            Formatted prompt for Claude/LLM
        """
        prompt = f'''Given the seed keyword "{seed_keyword}" in the biblical masculinity niche:

1. Generate 20 long-tail keyword variations
2. Classify each by search intent:
   - informational: seeking knowledge/answers
   - navigational: looking for specific resource
   - transactional: ready to buy/download
   - commercial: researching before purchase

3. Estimate relative competition (low/medium/high) based on:
   - Low: Niche specific, less commercial
   - Medium: Some competition, moderate search volume
   - High: Competitive terms, high commercial intent

4. Score opportunity (1-10) based on:
   - Relevance to Christian men 30-55
   - Alignment with biblical masculinity message
   - Content gap potential (can we say something unique?)
   - Conversion potential for Substack/Gumroad

5. Recommend content type for each:
   - article: Standard blog post (800-1500 words)
   - guide: Comprehensive resource (2000+ words)
   - product_page: Gumroad product optimization
   - listicle: List-based article
   - devotional: Scripture-focused short piece

Output as JSON array with this structure:
{{
  "seed_keyword": "{seed_keyword}",
  "expansions": [
    {{
      "keyword": "example long tail keyword",
      "intent": "informational",
      "competition": "low",
      "opportunity_score": 8,
      "content_type": "article",
      "search_volume_estimate": "medium",
      "notes": "Good angle for confrontational piece on X"
    }}
  ]
}}

Focus on keywords that:
- A working-class Christian man would actually search
- Have room for a bold, biblical perspective
- Aren't dominated by soft, mainstream Christian content
- Could lead to Substack subscriptions or Gumroad sales'''

        return prompt

    def expand_seed_keyword(self, seed_keyword: str) -> list[dict]:
        """
        Generate keyword variations using pattern-based expansion.

        This creates initial variations that can be enhanced
        by LLM analysis or API data.

        Args:
            seed_keyword: Base keyword to expand

        Returns:
            List of keyword variation dictionaries
        """
        variations = []

        # Apply modifiers
        for modifier_type, modifiers in self.MODIFIERS.items():
            for mod in modifiers:
                if modifier_type == "vs":
                    # For comparison keywords
                    variation = f"{seed_keyword} {mod} secular view"
                else:
                    variation = f"{mod} {seed_keyword}"

                variations.append({
                    "keyword": variation,
                    "base_keyword": seed_keyword,
                    "modifier_type": modifier_type,
                    "intent": self._guess_intent(modifier_type),
                    "competition": "medium",
                    "opportunity_score": 5,
                    "content_type": self._guess_content_type(modifier_type),
                    "search_volume_estimate": "low",
                    "notes": f"Auto-generated from {modifier_type} modifier"
                })

        return variations

    def _guess_intent(self, modifier_type: str) -> str:
        """Estimate search intent from modifier type."""
        intent_map = {
            "how_to": "informational",
            "what_is": "informational",
            "why": "informational",
            "best": "commercial",
            "vs": "informational",
            "for": "informational",
            "bible": "informational",
            "questions": "informational"
        }
        return intent_map.get(modifier_type, "informational")

    def _guess_content_type(self, modifier_type: str) -> str:
        """Estimate best content type from modifier."""
        type_map = {
            "how_to": "guide",
            "what_is": "article",
            "why": "article",
            "best": "listicle",
            "vs": "article",
            "for": "guide",
            "bible": "devotional",
            "questions": "article"
        }
        return type_map.get(modifier_type, "article")

    def get_all_seeds(self) -> list[str]:
        """Return all seed keywords from all categories."""
        seeds = []
        for category_seeds in self.SEED_CATEGORIES.values():
            seeds.extend(category_seeds)
        return seeds

    def get_seeds_by_category(self, category: str) -> list[str]:
        """Get seed keywords for a specific category."""
        return self.SEED_CATEGORIES.get(category, [])

    def add_keyword(self, keyword_data: dict):
        """Add a keyword opportunity to the database."""
        self.keywords["keywords"].append(keyword_data)

    def get_top_opportunities(self, min_score: int = 7, limit: int = 10) -> list[dict]:
        """
        Get highest-scoring keyword opportunities.

        Args:
            min_score: Minimum opportunity score (1-10)
            limit: Maximum results to return

        Returns:
            List of top keyword opportunities
        """
        filtered = [
            kw for kw in self.keywords.get("keywords", [])
            if kw.get("opportunity_score", 0) >= min_score
        ]
        sorted_kws = sorted(
            filtered,
            key=lambda x: x.get("opportunity_score", 0),
            reverse=True
        )
        return sorted_kws[:limit]

    def filter_by_intent(self, intent: str) -> list[dict]:
        """Filter keywords by search intent."""
        return [
            kw for kw in self.keywords.get("keywords", [])
            if kw.get("intent") == intent
        ]

    def filter_by_competition(self, competition: str) -> list[dict]:
        """Filter keywords by competition level."""
        return [
            kw for kw in self.keywords.get("keywords", [])
            if kw.get("competition") == competition
        ]

    def generate_batch_expansion_prompt(self, seeds: list[str]) -> str:
        """
        Generate prompt for batch keyword expansion.

        Args:
            seeds: List of seed keywords to expand

        Returns:
            Formatted prompt for batch processing
        """
        seeds_formatted = "\n".join(f"- {seed}" for seed in seeds)

        return f'''Analyze these seed keywords for the biblical masculinity niche and generate 5 high-opportunity long-tail variations for each:

SEED KEYWORDS:
{seeds_formatted}

For each seed, provide 5 variations with:
- keyword: The long-tail variation
- intent: informational/navigational/transactional/commercial
- competition: low/medium/high
- opportunity_score: 1-10 (prioritize unique biblical angles)
- content_type: article/guide/product_page/listicle/devotional

Output as JSON:
{{
  "batch_results": [
    {{
      "seed": "seed keyword",
      "variations": [
        {{"keyword": "...", "intent": "...", "competition": "...", "opportunity_score": X, "content_type": "..."}}
      ]
    }}
  ]
}}

Prioritize keywords where:
1. Mainstream Christian content is too soft/generic
2. There's room for confrontational, biblical perspective
3. Working-class men would actually search this
4. Clear path to Substack/Gumroad conversion'''

        return prompt


def main():
    """Test the keyword researcher."""
    researcher = KeywordResearcher(data_dir="data")

    # Get a seed keyword
    seed = "biblical masculinity"

    # Generate expansion prompt
    prompt = researcher.get_expansion_prompt(seed)
    print("=== KEYWORD EXPANSION PROMPT ===")
    print(prompt)
    print("\n" + "="*50 + "\n")

    # Generate pattern-based variations
    variations = researcher.expand_seed_keyword(seed)
    print(f"=== PATTERN VARIATIONS ({len(variations)} generated) ===")
    for v in variations[:5]:
        print(f"  - {v['keyword']} ({v['intent']}, {v['content_type']})")

    # Show all seed categories
    print("\n=== SEED CATEGORIES ===")
    for category, seeds in researcher.SEED_CATEGORIES.items():
        print(f"\n{category.upper()}:")
        for s in seeds:
            print(f"  - {s}")


if __name__ == "__main__":
    main()
