"""
Biblical SEO Machine - Search Intent Classifier

Classifies keywords by search intent and recommends content formats.
Intent types:
- Informational: Seeking knowledge/answers
- Navigational: Looking for specific resource/site
- Transactional: Ready to buy/download/subscribe
- Commercial: Researching before purchase
"""

import re
from dataclasses import dataclass
from typing import Optional


@dataclass
class IntentClassification:
    """Result of intent classification."""
    keyword: str
    primary_intent: str
    confidence: float  # 0-1
    secondary_intent: Optional[str]
    recommended_content_type: str
    recommended_word_count: int
    cta_type: str
    funnel_stage: str  # awareness, consideration, decision


class IntentClassifier:
    """
    Classifies search intent for keywords.

    Uses pattern matching and heuristics, can be enhanced
    with LLM analysis for edge cases.
    """

    # Intent signal patterns
    INTENT_PATTERNS = {
        "informational": {
            "strong": [
                r"^what is",
                r"^what are",
                r"^how to",
                r"^how do",
                r"^why do",
                r"^why is",
                r"^when to",
                r"^who is",
                r"^guide to",
                r"^ways to",
                r"^tips for",
                r"^meaning of",
                r"^definition of",
                r"^examples of",
                r"^types of",
                r"^difference between",
                r"vs\.?$",
                r"versus",
            ],
            "moderate": [
                r"bible verse",
                r"scripture",
                r"biblical view",
                r"christian perspective",
                r"according to",
                r"explained",
                r"understanding",
            ]
        },
        "transactional": {
            "strong": [
                r"^buy",
                r"^download",
                r"^subscribe",
                r"^sign up",
                r"^get access",
                r"^order",
                r"^purchase",
                r"free pdf",
                r"free download",
                r"free ebook",
                r"printable",
                r"template",
                r"worksheet",
                r"checklist",
            ],
            "moderate": [
                r"course",
                r"book",
                r"ebook",
                r"program",
                r"membership",
            ]
        },
        "commercial": {
            "strong": [
                r"^best",
                r"^top \d+",
                r"^review",
                r"^comparison",
                r"^alternative",
                r"vs\.?$",
                r"or ",
                r"which is better",
                r"recommendations",
                r"for men",
                r"for husbands",
                r"for fathers",
            ],
            "moderate": [
                r"worth it",
                r"should i",
                r"is .* good",
                r"does .* work",
            ]
        },
        "navigational": {
            "strong": [
                r"biblical man",
                r"substack",
                r"gumroad",
                r"login",
                r"sign in",
                r"website",
                r"official",
            ],
            "moderate": [
                r"\.com",
                r"\.org",
                r"podcast",
                r"youtube",
            ]
        }
    }

    # Content type recommendations by intent
    CONTENT_RECOMMENDATIONS = {
        "informational": {
            "content_type": "article",
            "word_count_range": (1200, 2500),
            "cta_type": "subscribe_newsletter",
            "funnel_stage": "awareness"
        },
        "commercial": {
            "content_type": "guide",
            "word_count_range": (1800, 3000),
            "cta_type": "product_mention",
            "funnel_stage": "consideration"
        },
        "transactional": {
            "content_type": "product_page",
            "word_count_range": (800, 1500),
            "cta_type": "direct_purchase",
            "funnel_stage": "decision"
        },
        "navigational": {
            "content_type": "landing_page",
            "word_count_range": (500, 1000),
            "cta_type": "direct_link",
            "funnel_stage": "decision"
        }
    }

    def classify(self, keyword: str) -> IntentClassification:
        """
        Classify search intent for a keyword.

        Args:
            keyword: The keyword to classify

        Returns:
            IntentClassification with intent and recommendations
        """
        keyword_lower = keyword.lower().strip()

        # Score each intent type
        scores = {
            "informational": 0,
            "transactional": 0,
            "commercial": 0,
            "navigational": 0
        }

        for intent, patterns in self.INTENT_PATTERNS.items():
            for pattern in patterns.get("strong", []):
                if re.search(pattern, keyword_lower):
                    scores[intent] += 2
            for pattern in patterns.get("moderate", []):
                if re.search(pattern, keyword_lower):
                    scores[intent] += 1

        # Default to informational if no signals
        if sum(scores.values()) == 0:
            scores["informational"] = 1

        # Get primary intent
        primary_intent = max(scores, key=scores.get)
        max_score = scores[primary_intent]

        # Calculate confidence
        total_score = sum(scores.values())
        confidence = max_score / total_score if total_score > 0 else 0.5

        # Get secondary intent if close
        sorted_intents = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        secondary_intent = None
        if len(sorted_intents) > 1 and sorted_intents[1][1] > 0:
            if sorted_intents[1][1] >= max_score * 0.5:
                secondary_intent = sorted_intents[1][0]

        # Get recommendations
        rec = self.CONTENT_RECOMMENDATIONS[primary_intent]
        recommended_word_count = (rec["word_count_range"][0] + rec["word_count_range"][1]) // 2

        return IntentClassification(
            keyword=keyword,
            primary_intent=primary_intent,
            confidence=round(confidence, 2),
            secondary_intent=secondary_intent,
            recommended_content_type=rec["content_type"],
            recommended_word_count=recommended_word_count,
            cta_type=rec["cta_type"],
            funnel_stage=rec["funnel_stage"]
        )

    def get_classification_prompt(self, keyword: str) -> str:
        """
        Generate prompt for LLM-enhanced classification.

        Args:
            keyword: Keyword to classify

        Returns:
            Prompt for Claude/LLM analysis
        """
        # Get initial classification
        initial = self.classify(keyword)

        prompt = f'''Classify the search intent for: "{keyword}"

Initial automated classification:
- Primary intent: {initial.primary_intent} (confidence: {initial.confidence})
- Secondary intent: {initial.secondary_intent or "None"}

Validate or correct this classification:

INTENT TYPES:
1. **Informational**: User wants to learn/understand something
   - Questions (what, why, how)
   - Research queries
   - Concept explanations

2. **Commercial**: User is researching before a purchase
   - Comparisons (best, top, vs)
   - Reviews
   - "For [audience]" queries

3. **Transactional**: User is ready to take action
   - Buy, download, subscribe
   - Free resources
   - Sign up queries

4. **Navigational**: User looking for specific destination
   - Brand/site names
   - Specific resource titles
   - Login/access queries

For the biblical masculinity niche, also consider:
- Christian men often search informationally even when ready to buy
- "For husbands/fathers" can be commercial (looking for resources)
- Scripture searches are informational but can lead to products

OUTPUT:
{{
  "keyword": "{keyword}",
  "primary_intent": "informational|commercial|transactional|navigational",
  "confidence": 0.85,
  "secondary_intent": "type or null",
  "reasoning": "Why this classification",
  "content_recommendation": {{
    "type": "article|guide|product_page|landing_page",
    "word_count": 1500,
    "cta_type": "subscribe_newsletter|product_mention|direct_purchase",
    "funnel_stage": "awareness|consideration|decision"
  }},
  "biblical_man_angle": "How to approach this keyword for our voice"
}}'''

        return prompt

    def batch_classify(self, keywords: list[str]) -> list[IntentClassification]:
        """
        Classify multiple keywords.

        Args:
            keywords: List of keywords to classify

        Returns:
            List of IntentClassification objects
        """
        return [self.classify(kw) for kw in keywords]

    def get_intent_distribution(self, keywords: list[str]) -> dict:
        """
        Get distribution of intents across keyword list.

        Args:
            keywords: List of keywords

        Returns:
            Dict with intent counts and percentages
        """
        classifications = self.batch_classify(keywords)

        distribution = {
            "informational": 0,
            "commercial": 0,
            "transactional": 0,
            "navigational": 0
        }

        for c in classifications:
            distribution[c.primary_intent] += 1

        total = len(keywords)
        percentages = {
            intent: round(count / total * 100, 1) if total > 0 else 0
            for intent, count in distribution.items()
        }

        return {
            "counts": distribution,
            "percentages": percentages,
            "total_keywords": total,
            "dominant_intent": max(distribution, key=distribution.get)
        }

    def recommend_content_mix(self, intent_distribution: dict) -> dict:
        """
        Recommend content mix based on intent distribution.

        Args:
            intent_distribution: Output from get_intent_distribution

        Returns:
            Content strategy recommendations
        """
        dominant = intent_distribution.get("dominant_intent", "informational")
        percentages = intent_distribution.get("percentages", {})

        recommendations = {
            "weekly_content_mix": {
                "articles": 0,
                "guides": 0,
                "product_focused": 0
            },
            "priority_intents": [],
            "strategy_notes": []
        }

        # Informational builds audience
        if percentages.get("informational", 0) > 50:
            recommendations["weekly_content_mix"]["articles"] = 3
            recommendations["weekly_content_mix"]["guides"] = 1
            recommendations["priority_intents"].append("informational")
            recommendations["strategy_notes"].append(
                "Heavy informational focus - great for building authority and email list"
            )

        # Commercial indicates buying research
        if percentages.get("commercial", 0) > 20:
            recommendations["weekly_content_mix"]["guides"] += 1
            recommendations["priority_intents"].append("commercial")
            recommendations["strategy_notes"].append(
                "Strong commercial intent - create comparison/guide content linking to products"
            )

        # Transactional means product pages need work
        if percentages.get("transactional", 0) > 10:
            recommendations["weekly_content_mix"]["product_focused"] = 1
            recommendations["priority_intents"].append("transactional")
            recommendations["strategy_notes"].append(
                "Transactional keywords present - optimize Gumroad product pages"
            )

        # Ensure minimum content
        if sum(recommendations["weekly_content_mix"].values()) < 3:
            recommendations["weekly_content_mix"]["articles"] = max(
                recommendations["weekly_content_mix"]["articles"], 2
            )

        return recommendations


def main():
    """Test the intent classifier."""
    classifier = IntentClassifier()

    # Test keywords
    test_keywords = [
        "what is biblical masculinity",
        "how to be a godly husband",
        "best books for christian men",
        "biblical masculinity course",
        "download free prayer guide",
        "biblical man substack",
        "christian husband vs worldly husband",
        "why men leave church",
        "tips for leading family devotions",
        "biblical masculinity ebook"
    ]

    print("=== INTENT CLASSIFICATIONS ===\n")
    for keyword in test_keywords:
        result = classifier.classify(keyword)
        print(f"Keyword: {keyword}")
        print(f"  Intent: {result.primary_intent} ({result.confidence})")
        print(f"  Secondary: {result.secondary_intent or 'None'}")
        print(f"  Content: {result.recommended_content_type}")
        print(f"  Word count: {result.recommended_word_count}")
        print(f"  CTA: {result.cta_type}")
        print(f"  Funnel: {result.funnel_stage}")
        print()

    # Distribution
    print("=== INTENT DISTRIBUTION ===")
    dist = classifier.get_intent_distribution(test_keywords)
    for intent, count in dist["counts"].items():
        pct = dist["percentages"][intent]
        print(f"  {intent}: {count} ({pct}%)")
    print(f"  Dominant: {dist['dominant_intent']}")

    # Recommendations
    print("\n=== CONTENT MIX RECOMMENDATION ===")
    rec = classifier.recommend_content_mix(dist)
    print(f"  Weekly mix: {rec['weekly_content_mix']}")
    for note in rec["strategy_notes"]:
        print(f"  - {note}")


if __name__ == "__main__":
    main()
