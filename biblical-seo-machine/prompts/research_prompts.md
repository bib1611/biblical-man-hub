# Research Prompts

Prompts for keyword research, competitor analysis, and market intelligence.

---

## 1. Keyword Expansion Prompt

```
Given the seed keyword "[KEYWORD]" in the biblical masculinity niche:

1. Generate 20 long-tail keyword variations
2. Classify each by search intent:
   - informational: seeking knowledge/answers
   - navigational: looking for specific resource
   - transactional: ready to buy/download
   - commercial: researching before purchase

3. Estimate relative competition (low/medium/high) based on:
   - Low: Niche specific, less commercial intent
   - Medium: Some competition, moderate volume
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

Output as JSON:
{
  "seed_keyword": "[KEYWORD]",
  "expansions": [
    {
      "keyword": "example long tail keyword",
      "intent": "informational",
      "competition": "low",
      "opportunity_score": 8,
      "content_type": "article",
      "search_volume_estimate": "medium",
      "notes": "Good angle for confrontational piece"
    }
  ]
}

Focus on keywords that:
- A working-class Christian man would actually search
- Have room for a bold, biblical perspective
- Aren't dominated by soft, mainstream Christian content
- Could lead to Substack subscriptions or Gumroad sales
```

---

## 2. Competitor Analysis Prompt

```
Analyze the top-ranking content for "[KEYWORD]":

Imagine you have access to the top 10 Google results. For the top 5, analyze:

1. **Content Metrics:**
   - Estimated word count
   - Number of H2 and H3 headings
   - Content type (article, guide, listicle, video, forum)

2. **Heading Structure:**
   - Common H2 headings used
   - Subtopics covered

3. **Tone Analysis:**
   - soft: Accommodating, gentle, avoiding confrontation
   - moderate: Balanced, mainstream Christian
   - bold: Direct, challenging, takes positions

4. **Scripture Usage:**
   - Heavy, moderate, light, or none?
   - Which versions?
   - Integrated or decorative?

5. **Content Gaps:**
   - What are they NOT saying that Biblical Man would?
   - Where is the soft underbelly?
   - What hard truths are they avoiding?

6. **Differentiation Opportunities:**
   - Where can we be more confrontational?
   - What working-man perspective is missing?
   - What KJV truth would cut through?

OUTPUT:
{
  "keyword": "[KEYWORD]",
  "serp_overview": {
    "dominant_content_type": "article",
    "dominant_tone": "soft",
    "scripture_presence": "light"
  },
  "benchmarks": {
    "avg_word_count": 1500,
    "recommended_word_count": 1800,
    "avg_h2_count": 5
  },
  "common_h2_topics": [...],
  "content_gaps": [...],
  "biblical_man_opportunities": [...],
  "recommended_approach": {
    "word_count": 1800,
    "structure": "Problem → Hard Truth → Scripture → Challenge",
    "unique_angle": "..."
  }
}
```

---

## 3. Batch Keyword Research Prompt

```
Analyze these seed keywords for the biblical masculinity niche:

SEEDS:
- [SEED 1]
- [SEED 2]
- [SEED 3]
- [SEED 4]
- [SEED 5]

For each seed, generate 5 high-opportunity long-tail variations with:
- keyword: The long-tail variation
- intent: informational/navigational/transactional/commercial
- competition: low/medium/high
- opportunity_score: 1-10
- content_type: article/guide/product_page/listicle/devotional

Prioritize keywords where:
1. Mainstream Christian content is too soft/generic
2. There's room for confrontational, biblical perspective
3. Working-class men would search this
4. Clear path to conversion

OUTPUT as JSON array of seed results.
```

---

## 4. Content Gap Discovery Prompt

```
For the topic "[TOPIC]" in the biblical masculinity space:

IDENTIFY:

1. **Questions men are asking** (but not getting real answers to):
   - What "taboo" questions exist?
   - What are men afraid to ask their pastor?
   - What does Reddit/forums reveal?

2. **Mainstream Christian blind spots:**
   - What does Christianity Today NOT say?
   - What does Desiring God hedge on?
   - Where does mainstream content go soft?

3. **Cultural flashpoints:**
   - Where does this topic intersect current events?
   - What cultural lies need biblical correction?
   - What makes this relevant RIGHT NOW?

4. **Product opportunities:**
   - What would men pay to learn/solve?
   - What guide/resource doesn't exist?
   - What transformation are they seeking?

OUTPUT:
{
  "topic": "[TOPIC]",
  "unanswered_questions": [...],
  "mainstream_blind_spots": [...],
  "cultural_angles": [...],
  "product_opportunities": [...],
  "recommended_content_series": [
    {
      "title": "...",
      "angle": "...",
      "format": "..."
    }
  ]
}
```

---

## 5. Niche Authority Mapping Prompt

```
Map the biblical masculinity content landscape:

IDENTIFY KEY PLAYERS:

1. **Major Christian sites** covering this topic:
   - What's their angle?
   - What's their weakness?

2. **Influencers/creators** in this space:
   - Who has authority?
   - Where are they soft?

3. **Competing products:**
   - What courses/books exist?
   - What are they missing?

4. **Untapped sub-niches:**
   - What specific audiences are underserved?
   - What intersections aren't covered?

OUTPUT:
{
  "landscape_summary": "...",
  "major_competitors": [...],
  "competitor_weaknesses": [...],
  "underserved_audiences": [...],
  "recommended_positioning": "...",
  "differentiation_strategy": "..."
}
```

---

## Usage Notes

- Run Keyword Expansion for each seed category (identity, marriage, fatherhood, etc.)
- Run Competitor Analysis before writing any major content piece
- Use Batch Research for weekly content planning
- Run Content Gap Discovery monthly to find new angles
- Update Niche Authority Mapping quarterly
