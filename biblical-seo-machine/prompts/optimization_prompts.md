# Optimization Prompts

Prompts for SEO optimization, content improvement, and performance enhancement.

---

## 1. Full SEO Optimization Prompt

```
Optimize this content for SEO while preserving Biblical Man voice:

TARGET KEYWORD: "[KEYWORD]"
CURRENT TITLE: "[TITLE]"
CURRENT META: "[META]"

---
[CONTENT]
---

OPTIMIZE FOR:

1. **Keyword Placement**
   - Keyword in title (front-loaded if possible)
   - Keyword in first 100 words
   - Keyword in at least 2 H2 headings
   - Natural density (1-2%)
   - Keyword in meta description

2. **Structure**
   - 4-6 H2 headings
   - H3 subheadings for long sections
   - Short paragraphs (2-4 sentences)
   - White space between sections

3. **Readability**
   - Staccato rhythm
   - Fragment sentences for punch
   - Direct "you" address throughout
   - Working-man metaphors

4. **Internal Linking**
   - Add [INTERNAL LINK: topic] placeholders
   - Minimum 3 linking opportunities

5. **Voice Preservation**
   - Remove any therapy-speak
   - Remove any soft qualifiers
   - Strengthen any weak endings
   - Ensure Scripture is integrated, not decorative

OUTPUT:
---
OPTIMIZED TITLE: [under 60 chars]
OPTIMIZED META: [under 160 chars]
---

[Full optimized content]

---
CHANGES MADE:
- [Specific change 1]
- [Specific change 2]
...
---
```

---

## 2. Title Tag Optimization Prompt

```
Optimize this title for SEO and click-through:

CURRENT: "[CURRENT_TITLE]"
KEYWORD: "[KEYWORD]"

REQUIREMENTS:
- Under 60 characters
- Keyword front-loaded (first 3 words if possible)
- Creates curiosity or challenges
- No clickbait, but compelling

AVOID:
- "The Ultimate Guide to..."
- "Everything You Need to Know..."
- Question formats (usually)
- Generic promises

GENERATE 5 OPTIONS:
1. [Direct/keyword-first]
2. [Benefit-focused]
3. [Challenging/confrontational]
4. [Specific/numbered]
5. [Curiosity gap]

For each, explain why it works and note character count.
```

---

## 3. Meta Description Optimization Prompt

```
Optimize this meta description:

CURRENT: "[CURRENT_META]"
KEYWORD: "[KEYWORD]"
TITLE: "[TITLE]"

REQUIREMENTS:
- Under 160 characters
- Include keyword naturally
- Include a hook or benefit
- Subtle CTA or curiosity
- Match searcher intent

VOICE ALIGNMENT:
- Can be slightly more "salesy" than content
- Still no therapy-speak
- Direct, not wishy-washy

GENERATE 3 OPTIONS:
1. [Benefit-focused]
2. [Curiosity/question]
3. [Direct/challenging]

For each, note character count and explain the angle.
```

---

## 4. Heading Structure Optimization Prompt

```
Optimize the heading structure for this content:

KEYWORD: "[KEYWORD]"
CURRENT H2s:
- [H2 1]
- [H2 2]
- [H2 3]
...

OPTIMIZE:
1. **Keyword inclusion**: At least 2 H2s should contain keyword or variation
2. **Structure clarity**: Each H2 should cover one distinct topic
3. **Voice alignment**: Headings should be direct, not soft
4. **Logical flow**: Problem → Truth → Scripture → Application → Challenge

BAD H2 EXAMPLES:
- "Some Thoughts on [Topic]" (weak)
- "Considering the Possibilities" (soft)
- "In Conclusion" (generic)

GOOD H2 EXAMPLES:
- "The Hard Truth About [Topic]"
- "What Scripture Actually Says"
- "Your Move"
- "Stop Making Excuses"

OUTPUT:
Recommended H2 structure with rationale for each.
```

---

## 5. Content Refresh Prompt

```
Refresh this existing content for improved performance:

URL: [URL]
ORIGINAL DATE: [DATE]
TARGET KEYWORD: [KEYWORD]

---
[CURRENT CONTENT]
---

REFRESH CHECKLIST:

1. **Update outdated information**
   - Statistics or references older than 2 years
   - Broken links
   - Outdated examples

2. **Strengthen SEO**
   - Check keyword density
   - Update title/meta if needed
   - Add new internal links

3. **Enhance value**
   - Add new section if topic has evolved
   - Include new Scripture if relevant
   - Update examples to current context

4. **Voice check**
   - Remove any drift toward softness
   - Strengthen any weak sections
   - Ensure ending still challenges

5. **Competitive update**
   - What are competitors now saying?
   - What new angle can we add?

OUTPUT:
- Summary of changes needed
- Refreshed content OR specific edit recommendations
- New title/meta if warranted
```

---

## 6. Underperforming Content Audit Prompt

```
Audit this underperforming content:

URL: [URL]
KEYWORD: [KEYWORD]
CURRENT POSITION: [POSITION]
TRAFFIC: [MONTHLY_TRAFFIC]

---
[CONTENT]
---

DIAGNOSE ISSUES:

1. **Keyword Issues**
   - Is keyword in title?
   - Is keyword in first 100 words?
   - Is keyword in H2s?
   - What's the density?

2. **Content Quality**
   - Is it comprehensive enough?
   - Does it answer the search intent?
   - Is it better than what's ranking above?

3. **Voice Issues**
   - Has it drifted soft?
   - Is Scripture integrated or decorative?
   - Does ending challenge?

4. **Technical Issues**
   - Title/meta length
   - Heading structure
   - Internal linking

5. **Competitive Gap**
   - What are top 3 doing better?
   - What are we missing?

OUTPUT:
{
  "issues_found": [...],
  "priority_fixes": [
    {
      "fix": "...",
      "impact": "high/medium/low",
      "effort": "high/medium/low"
    }
  ],
  "recommended_actions": [...],
  "expected_impact": "..."
}
```

---

## 7. Internal Linking Optimization Prompt

```
Optimize internal linking for this content:

TARGET CONTENT:
Title: [TITLE]
Keyword: [KEYWORD]
---
[CONTENT]
---

EXISTING CONTENT INVENTORY:
- [Title 1]: [URL 1] - [Topic]
- [Title 2]: [URL 2] - [Topic]
- [Title 3]: [URL 3] - [Topic]
...

FIND:
1. **Opportunities to link OUT from this content**
   - Where can we naturally reference other content?
   - What anchor text should we use?
   - Which links add most value?

2. **Opportunities to link TO this content**
   - Which existing content should link here?
   - What anchor text?
   - Where in those articles?

OUTPUT:
{
  "links_from_this_content": [
    {
      "anchor_text": "...",
      "link_to": "[URL]",
      "context": "where in article"
    }
  ],
  "links_to_this_content": [
    {
      "from_article": "[URL]",
      "anchor_text": "...",
      "context": "where to insert"
    }
  ]
}
```

---

## 8. Keyword Cannibalization Check Prompt

```
Check for keyword cannibalization:

TARGET KEYWORD: "[KEYWORD]"

CONTENT TARGETING THIS KEYWORD:
- [URL 1]: [Title 1]
- [URL 2]: [Title 2]
...

ANALYZE:
1. Are multiple pages competing for the same keyword?
2. Is there intent overlap or are they serving different intents?
3. Which page should be the primary target?
4. Should pages be consolidated, differentiated, or one removed?

OUTPUT:
{
  "cannibalization_detected": true/false,
  "competing_pages": [...],
  "recommendation": "consolidate/differentiate/keep",
  "action_plan": [
    {
      "page": "...",
      "action": "...",
      "new_keyword_focus": "..."
    }
  ]
}
```

---

## Usage Notes

- Run Full SEO Optimization on every new article before publishing
- Use Title/Meta prompts when A/B testing or refreshing
- Run Content Refresh quarterly on top-performing content
- Audit Underperforming content monthly
- Check Internal Linking when content inventory grows
- Run Cannibalization Check when targeting similar keywords
