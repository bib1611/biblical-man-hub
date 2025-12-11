#!/usr/bin/env python3
"""
Biblical SEO Machine - Main Workflow Orchestrator

This is the central command for running SEO workflows:
- Keyword research and expansion
- Competitor analysis
- Content brief generation
- Article generation
- SEO optimization
- Voice compliance checking

Usage:
    python main.py [workflow] [options]

Workflows:
    research    - Run keyword research on seed keywords
    analyze     - Analyze competitors for a keyword
    brief       - Generate content brief for a keyword
    generate    - Generate article from brief
    optimize    - Optimize existing content
    voice-check - Check content for voice compliance
    full        - Run full pipeline: research → brief → generate → optimize
"""

import argparse
import json
from pathlib import Path
from datetime import datetime

# Import modules
from modules.keyword_research import KeywordResearcher
from modules.competitor_analysis import CompetitorAnalyzer
from modules.intent_classifier import IntentClassifier
from modules.content_generator import ContentGenerator
from modules.seo_optimizer import SEOOptimizer


class BiblicalSEOMachine:
    """Main orchestrator for SEO workflows."""

    def __init__(self, data_dir: str = "data", output_dir: str = "outputs"):
        self.data_dir = Path(data_dir)
        self.output_dir = Path(output_dir)

        # Initialize modules
        self.keyword_researcher = KeywordResearcher(data_dir=data_dir)
        self.competitor_analyzer = CompetitorAnalyzer(data_dir=data_dir)
        self.intent_classifier = IntentClassifier()
        self.content_generator = ContentGenerator(
            output_dir=str(self.output_dir / "articles"),
            prompts_dir="prompts"
        )
        self.seo_optimizer = SEOOptimizer()

    def run_keyword_research(self, seeds: list[str], save: bool = True) -> dict:
        """
        Run keyword research on seed keywords.

        Args:
            seeds: List of seed keywords
            save: Whether to save results

        Returns:
            Research results with expansion prompts
        """
        print(f"\n{'='*60}")
        print("KEYWORD RESEARCH WORKFLOW")
        print(f"{'='*60}\n")

        results = {
            "seeds_processed": len(seeds),
            "expansions": [],
            "prompts_generated": []
        }

        for seed in seeds:
            print(f"Processing: {seed}")

            # Classify intent
            intent = self.intent_classifier.classify(seed)
            print(f"  Intent: {intent.primary_intent} ({intent.confidence})")

            # Generate expansion prompt
            prompt = self.keyword_researcher.get_expansion_prompt(seed)
            results["prompts_generated"].append({
                "seed": seed,
                "prompt": prompt
            })

            # Generate pattern-based expansions
            expansions = self.keyword_researcher.expand_seed_keyword(seed)
            results["expansions"].append({
                "seed": seed,
                "intent": intent.primary_intent,
                "pattern_expansions": len(expansions),
                "sample_expansions": [e["keyword"] for e in expansions[:5]]
            })

            print(f"  Pattern expansions: {len(expansions)}")

        if save:
            output_path = self.output_dir / "research" / f"research_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"\nResults saved to: {output_path}")

        return results

    def run_competitor_analysis(self, keyword: str, save: bool = True) -> dict:
        """
        Run competitor analysis for a keyword.

        Args:
            keyword: Target keyword
            save: Whether to save results

        Returns:
            Analysis results with prompts
        """
        print(f"\n{'='*60}")
        print(f"COMPETITOR ANALYSIS: {keyword}")
        print(f"{'='*60}\n")

        # Get quick benchmark
        intent = self.intent_classifier.classify(keyword)
        benchmark = self.competitor_analyzer.get_quick_benchmark(keyword, intent.primary_intent)

        print(f"Intent: {intent.primary_intent}")
        print(f"Quick Benchmark:")
        print(f"  Recommended word count: {benchmark['recommended_word_count']}")
        print(f"  Min H2 count: {benchmark['h2_count']}")

        # Generate analysis prompt
        analysis_prompt = self.competitor_analyzer.get_analysis_prompt(keyword)

        # Get content gaps
        gaps = self.competitor_analyzer.analyze_content_gaps(keyword, [])

        print(f"\nContent Gaps Identified:")
        for gap in gaps[:5]:
            print(f"  - {gap}")

        results = {
            "keyword": keyword,
            "intent": intent.primary_intent,
            "benchmark": benchmark,
            "content_gaps": gaps,
            "analysis_prompt": analysis_prompt
        }

        if save:
            output_path = self.output_dir / "analysis" / f"analysis_{keyword.replace(' ', '_')[:30]}.json"
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"\nResults saved to: {output_path}")

        return results

    def generate_content_brief(self, keyword: str, save: bool = True) -> dict:
        """
        Generate a content brief for a keyword.

        Args:
            keyword: Target keyword
            save: Whether to save results

        Returns:
            Content brief
        """
        print(f"\n{'='*60}")
        print(f"CONTENT BRIEF: {keyword}")
        print(f"{'='*60}\n")

        # Classify intent
        intent = self.intent_classifier.classify(keyword)

        # Get benchmark
        benchmark = self.competitor_analyzer.get_quick_benchmark(keyword, intent.primary_intent)

        # Generate brief
        brief = self.content_generator.generate_content_brief(
            keyword=keyword,
            intent=intent.primary_intent,
            target_word_count=benchmark["recommended_word_count"],
            competitor_data=benchmark
        )

        print(f"Keyword: {brief.keyword}")
        print(f"Intent: {brief.intent}")
        print(f"Target word count: {brief.target_word_count}")
        print(f"\nH2 Sections:")
        for h2 in brief.h2_sections:
            print(f"  - {h2}")
        print(f"\nCTA Type: {brief.cta_type}")

        # Generate the article prompt
        article_prompt = self.content_generator.get_article_prompt(brief)

        results = {
            "brief": {
                "keyword": brief.keyword,
                "secondary_keywords": brief.secondary_keywords,
                "intent": brief.intent,
                "target_word_count": brief.target_word_count,
                "h2_sections": brief.h2_sections,
                "key_points": brief.key_points,
                "biblical_angle": brief.biblical_angle,
                "cta_type": brief.cta_type,
                "voice_reminders": brief.voice_reminders
            },
            "article_prompt": article_prompt
        }

        if save:
            # Save brief
            brief_path = self.content_generator.save_brief(brief)
            print(f"\nBrief saved to: {brief_path}")

            # Save prompt
            prompt_path = self.output_dir / "briefs" / f"prompt_{keyword.replace(' ', '_')[:30]}.md"
            prompt_path.parent.mkdir(parents=True, exist_ok=True)
            with open(prompt_path, 'w') as f:
                f.write(f"# Article Generation Prompt\n\nKeyword: {keyword}\n\n---\n\n{article_prompt}")
            print(f"Prompt saved to: {prompt_path}")

        return results

    def check_voice_compliance(self, content: str, keyword: str = "") -> dict:
        """
        Check content for voice compliance.

        Args:
            content: Content to check
            keyword: Optional keyword for context

        Returns:
            Voice check results
        """
        print(f"\n{'='*60}")
        print("VOICE COMPLIANCE CHECK")
        print(f"{'='*60}\n")

        # Get SEO analysis (includes voice score)
        score = self.seo_optimizer.analyze(content, keyword or "biblical masculinity")

        print(f"Overall Score: {score.overall_score}/100")
        print(f"Voice Score: {score.voice_score}/100")

        # Get detailed violations
        violations = self.seo_optimizer.get_voice_violations(content)

        if violations:
            print(f"\nViolations Found ({len(violations)}):")
            for v in violations[:10]:
                print(f"  [{v.severity.upper()}] {v.violation_type}: '{v.text_found}'")
                print(f"    → {v.suggestion}")
        else:
            print("\nNo voice violations found!")

        if score.issues:
            print(f"\nOther Issues:")
            for issue in score.issues[:5]:
                print(f"  - {issue}")

        # Generate voice check prompt
        voice_prompt = self.seo_optimizer.get_voice_check_prompt(content)

        return {
            "overall_score": score.overall_score,
            "voice_score": score.voice_score,
            "violations": [
                {
                    "type": v.violation_type,
                    "text": v.text_found,
                    "severity": v.severity,
                    "suggestion": v.suggestion
                }
                for v in violations
            ],
            "issues": score.issues,
            "recommendations": score.recommendations,
            "voice_check_prompt": voice_prompt
        }

    def run_full_pipeline(self, keyword: str) -> dict:
        """
        Run the full content creation pipeline.

        Args:
            keyword: Target keyword

        Returns:
            All pipeline outputs
        """
        print(f"\n{'='*60}")
        print(f"FULL PIPELINE: {keyword}")
        print(f"{'='*60}")

        results = {}

        # Step 1: Competitor Analysis
        print("\n[STEP 1/3] Competitor Analysis...")
        results["competitor_analysis"] = self.run_competitor_analysis(keyword, save=True)

        # Step 2: Content Brief
        print("\n[STEP 2/3] Content Brief Generation...")
        results["content_brief"] = self.generate_content_brief(keyword, save=True)

        # Step 3: Generate prompts for article creation
        print("\n[STEP 3/3] Article Prompt Generated")
        print("\nTo generate the article, use the prompt saved in outputs/briefs/")
        print("Run the prompt through Claude with voice guidelines loaded.")

        print(f"\n{'='*60}")
        print("PIPELINE COMPLETE")
        print(f"{'='*60}")
        print(f"\nOutputs saved to: {self.output_dir}/")
        print("\nNext Steps:")
        print("1. Review the content brief")
        print("2. Run the article prompt through Claude")
        print("3. Check voice compliance on output")
        print("4. Optimize and publish")

        return results

    def show_prompts(self, prompt_type: str = "all"):
        """Display available prompts."""
        prompts_dir = Path("prompts")

        if prompt_type == "all":
            print("\n=== AVAILABLE PROMPTS ===\n")
            for prompt_file in prompts_dir.glob("*.md"):
                print(f"  - {prompt_file.stem}")
        else:
            prompt_path = prompts_dir / f"{prompt_type}.md"
            if prompt_path.exists():
                print(f"\n=== {prompt_type.upper()} PROMPTS ===\n")
                with open(prompt_path, 'r') as f:
                    print(f.read())
            else:
                print(f"Prompt file not found: {prompt_type}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Biblical SEO Machine - Content Automation for Biblical Man",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py research --seeds "biblical masculinity" "christian husband"
  python main.py analyze --keyword "biblical masculinity"
  python main.py brief --keyword "how to be a godly husband"
  python main.py voice-check --file draft.md
  python main.py full --keyword "biblical fatherhood"
  python main.py prompts --type writing_prompts
        """
    )

    subparsers = parser.add_subparsers(dest="command", help="Workflow to run")

    # Research command
    research_parser = subparsers.add_parser("research", help="Run keyword research")
    research_parser.add_argument("--seeds", nargs="+", required=True, help="Seed keywords")

    # Analyze command
    analyze_parser = subparsers.add_parser("analyze", help="Analyze competitors")
    analyze_parser.add_argument("--keyword", required=True, help="Target keyword")

    # Brief command
    brief_parser = subparsers.add_parser("brief", help="Generate content brief")
    brief_parser.add_argument("--keyword", required=True, help="Target keyword")

    # Voice check command
    voice_parser = subparsers.add_parser("voice-check", help="Check voice compliance")
    voice_parser.add_argument("--file", help="File to check")
    voice_parser.add_argument("--text", help="Text to check")
    voice_parser.add_argument("--keyword", default="", help="Target keyword")

    # Full pipeline command
    full_parser = subparsers.add_parser("full", help="Run full pipeline")
    full_parser.add_argument("--keyword", required=True, help="Target keyword")

    # Prompts command
    prompts_parser = subparsers.add_parser("prompts", help="Show prompts")
    prompts_parser.add_argument("--type", default="all", help="Prompt type to show")

    # Demo command
    demo_parser = subparsers.add_parser("demo", help="Run demo workflow")

    args = parser.parse_args()

    # Initialize machine
    machine = BiblicalSEOMachine()

    if args.command == "research":
        machine.run_keyword_research(args.seeds)

    elif args.command == "analyze":
        machine.run_competitor_analysis(args.keyword)

    elif args.command == "brief":
        machine.generate_content_brief(args.keyword)

    elif args.command == "voice-check":
        if args.file:
            with open(args.file, 'r') as f:
                content = f.read()
        elif args.text:
            content = args.text
        else:
            print("Error: Provide --file or --text")
            return
        machine.check_voice_compliance(content, args.keyword)

    elif args.command == "full":
        machine.run_full_pipeline(args.keyword)

    elif args.command == "prompts":
        machine.show_prompts(args.type)

    elif args.command == "demo":
        # Run demo with biblical masculinity
        print("\n" + "="*60)
        print("BIBLICAL SEO MACHINE - DEMO")
        print("="*60)

        # Demo keyword research
        machine.run_keyword_research(["biblical masculinity"])

        # Demo competitor analysis
        machine.run_competitor_analysis("biblical masculinity")

        # Demo content brief
        machine.generate_content_brief("biblical masculinity")

        print("\n" + "="*60)
        print("DEMO COMPLETE - Check outputs/ for generated files")
        print("="*60)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
