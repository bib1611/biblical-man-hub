#!/usr/bin/env python3
"""
TinyFish Web Scraper - Biblical Man Edition
Scrape any website using AgentQL REST API (formerly TinyFish)

TinyFish rebranded to AgentQL. API moved from api.tinyfish.io -> api.agentql.com
Docs: https://docs.agentql.com/rest-api/api-reference
"""

import os
import sys
import json
import requests
from datetime import datetime
from urllib.parse import urlparse
import re

# Load API key (supports both old TINYFISH and new AGENTQL env names)
API_KEY = os.environ.get('AGENTQL_API_KEY') or os.environ.get('TINYFISH_API_KEY')
if not API_KEY:
    for env_file in ['.env.agentql', '.env.tinyfish']:
        try:
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('AGENTQL_API_KEY=') or line.startswith('TINYFISH_API_KEY='):
                        API_KEY = line.split('=', 1)[1].strip()
                        break
            if API_KEY:
                break
        except FileNotFoundError:
            continue

if not API_KEY:
    print("Warning: No API key found. Set AGENTQL_API_KEY env var or create .env.agentql file.")

# AgentQL query templates for each platform
QUERIES = {
    "twitter": """{
        tweet_text
        author_name
        author_handle
        timestamp
        likes_count
        retweets_count
        replies_count
    }""",
    "substack": """{
        article_title
        article_content
        author_name
        publish_date
        subtitle
    }""",
    "youtube": """{
        video_title
        video_description
        channel_name
        view_count
        upload_date
    }""",
    "generic": """{
        page_title
        main_content
        meta_description
        links[] {
            text
            url
        }
    }"""
}

class TinyFishScraper:
    def __init__(self):
        self.api_key = API_KEY
        # AgentQL REST API (TinyFish rebranded)
        self.base_url = "https://api.agentql.com/v1"
        self.headers = {
            "X-API-Key": self.api_key or "",
            "Content-Type": "application/json"
        }

    def scrape_url(self, url, options=None):
        """Scrape any URL using AgentQL (formerly TinyFish)"""
        print(f"🐟 Scraping with AgentQL: {url}")

        if not self.api_key:
            return {"error": "No API key configured. Set AGENTQL_API_KEY env var or create .env.agentql file."}

        # Select query based on platform
        platform = self.detect_platform(url)
        query_key = {
            "X/Twitter": "twitter",
            "Substack": "substack",
            "YouTube": "youtube",
        }.get(platform, "generic")

        query = QUERIES[query_key]

        # Allow custom query override via options
        if options and "query" in options:
            query = options["query"]

        payload = {
            "url": url,
            "query": query,
            "params": {
                "wait_for": 0,
                "is_scroll_to_bottom_enabled": False,
                "mode": "fast",
                "is_screenshot_enabled": False
            }
        }

        # Merge any extra params from options
        if options:
            if "params" in options:
                payload["params"].update(options["params"])

        try:
            response = requests.post(
                f"{self.base_url}/query-data",
                headers=self.headers,
                json=payload,
                timeout=60
            )

            if response.status_code == 200:
                return self.process_response(response.json(), url, platform)
            else:
                return {"error": f"AgentQL API returned {response.status_code}: {response.text}"}

        except Exception as e:
            return {"error": str(e)}
            
    def process_response(self, api_response, url, platform):
        """Process AgentQL response into our format"""
        # AgentQL returns {"data": {...}, "metadata": {"request_id": "..."}}
        data = api_response.get("data", api_response)
        metadata = api_response.get("metadata", {})

        result = {
            "url": url,
            "platform": platform,
            "extracted_at": datetime.now().isoformat(),
            "request_id": metadata.get("request_id"),
            "raw_data": data
        }

        # Extract content based on platform
        if platform == "X/Twitter":
            result.update(self.process_twitter(data))
        elif platform == "Substack":
            result.update(self.process_substack(data))
        elif platform == "YouTube":
            result.update(self.process_youtube(data))
        else:
            result.update(self.process_generic(data))

        # Add marketing analysis
        if result.get("content"):
            result["analysis"] = self.analyze_content(result["content"])

        return result
        
    def detect_platform(self, url):
        """Detect the platform from URL"""
        domain = urlparse(url).netloc.lower()
        if "x.com" in domain or "twitter.com" in domain:
            return "X/Twitter"
        elif "substack.com" in domain:
            return "Substack"
        elif "youtube.com" in domain:
            return "YouTube"
        elif "linkedin.com" in domain:
            return "LinkedIn"
        else:
            return "Web"
            
    def process_twitter(self, data):
        """Extract Twitter/X content from AgentQL structured response"""
        tweet_text = data.get("tweet_text", "")
        author = data.get("author_name", "")
        handle = data.get("author_handle", "")

        content = tweet_text or str(data)[:1000]

        return {
            "content": content,
            "type": "tweet",
            "author": author,
            "handle": handle,
            "engagement": {
                "likes": data.get("likes_count"),
                "retweets": data.get("retweets_count"),
                "replies": data.get("replies_count"),
            }
        }

    def process_substack(self, data):
        """Extract Substack content from AgentQL structured response"""
        title = data.get("article_title", "Unknown")
        content = data.get("article_content", "")
        author = data.get("author_name", "")

        return {
            "title": title,
            "content": content[:5000],
            "type": "article",
            "author": author,
            "subtitle": data.get("subtitle", ""),
            "publish_date": data.get("publish_date", ""),
        }

    def process_youtube(self, data):
        """Extract YouTube content from AgentQL structured response"""
        title = data.get("video_title", "Unknown")
        description = data.get("video_description", "")

        return {
            "title": title,
            "content": description,
            "type": "video",
            "channel": data.get("channel_name", ""),
            "view_count": data.get("view_count", ""),
            "upload_date": data.get("upload_date", ""),
            "note": "Use YouTube transcript scraper for full transcript"
        }

    def process_generic(self, data):
        """Process generic web content from AgentQL structured response"""
        title = data.get("page_title", "Unknown")
        content = data.get("main_content", "")
        links = data.get("links", [])

        return {
            "title": title,
            "content": content[:5000],
            "type": "webpage",
            "meta_description": data.get("meta_description", ""),
            "links": links[:50] if isinstance(links, list) else [],
        }
        
    def analyze_content(self, content):
        """Marketing analysis for Biblical Man"""
        content_lower = content.lower()
        words = re.findall(r'\b\w+\b', content_lower)
        
        # Biblical Man specific triggers
        pain_words = [
            'broken', 'shame', 'failed', 'struggle', 'wound', 'father',
            'marriage', 'porn', 'alone', 'empty', 'angry', 'lost'
        ]
        
        power_words = [
            'warrior', 'fight', 'stand', 'rise', 'conquer', 'victory',
            'brotherhood', 'legacy', 'covenant', 'kingdom'
        ]
        
        spiritual_words = [
            'god', 'jesus', 'faith', 'prayer', 'scripture', 'bible',
            'grace', 'salvation', 'worship', 'holy'
        ]
        
        # Count occurrences
        pain_count = sum(1 for word in words if word in pain_words)
        power_count = sum(1 for word in words if word in power_words)
        spiritual_count = sum(1 for word in words if word in spiritual_words)
        
        # Detect hooks
        first_sentence = content.split('.')[0] if '.' in content else content[:100]
        
        return {
            "metrics": {
                "word_count": len(words),
                "pain_density": (pain_count / len(words) * 100) if words else 0,
                "power_density": (power_count / len(words) * 100) if words else 0,
                "spiritual_density": (spiritual_count / len(words) * 100) if words else 0
            },
            "hook": first_sentence.strip(),
            "jake_triggers": [w for w in set(words) if w in pain_words],
            "marketing_angle": self.detect_angle(content)
        }
        
    def detect_angle(self, content):
        """Detect marketing angle"""
        angles = []
        
        if re.search(r'father|dad|son', content, re.I):
            angles.append("Father wound angle")
            
        if re.search(r'marriage|wife|divorce', content, re.I):
            angles.append("Marriage restoration")
            
        if re.search(r'porn|lust|addiction', content, re.I):
            angles.append("Sexual purity")
            
        if re.search(r'church|pastor|ministry', content, re.I):
            angles.append("Church wounds")
            
        return angles or ["Generic spiritual content"]
        
    def save_intel(self, data):
        """Save to intel folder"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        platform = data.get("platform", "unknown").lower().replace("/", "-")
        filename = f"tinyfish_{platform}_{timestamp}.json"
        
        os.makedirs("intel", exist_ok=True)
        filepath = os.path.join("intel", filename)
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
            
        print(f"💾 Saved to: {filepath}")
        
        # Also create markdown summary
        md_filename = filepath.replace('.json', '.md')
        with open(md_filename, 'w') as f:
            f.write(f"# {data.get('title', 'Intel Report')}\n\n")
            f.write(f"**URL:** {data.get('url')}\n")
            f.write(f"**Platform:** {data.get('platform')}\n")
            f.write(f"**Extracted:** {data.get('extracted_at')}\n\n")
            
            if 'analysis' in data:
                analysis = data['analysis']
                f.write("## Marketing Analysis\n\n")
                f.write(f"**Hook:** {analysis.get('hook')}\n")
                f.write(f"**Jake Triggers Found:** {', '.join(analysis.get('jake_triggers', []))}\n")
                f.write(f"**Marketing Angles:** {', '.join(analysis.get('marketing_angle', []))}\n\n")
                
                metrics = analysis.get('metrics', {})
                f.write("### Density Metrics\n")
                f.write(f"- Pain Density: {metrics.get('pain_density', 0):.1f}%\n")
                f.write(f"- Power Density: {metrics.get('power_density', 0):.1f}%\n")
                f.write(f"- Spiritual Density: {metrics.get('spiritual_density', 0):.1f}%\n\n")
                
            f.write("## Content\n\n")
            f.write(data.get('content', '')[:2000])
            
        print(f"📝 Summary at: {md_filename}")
        
def main():
    if len(sys.argv) < 2:
        print("TinyFish Web Scraper - Biblical Man Edition")
        print("\nUsage:")
        print("  python tinyfish-scraper.py <URL>")
        print("  python tinyfish-scraper.py batch <file>")
        print("\nSupported platforms:")
        print("  - X/Twitter")
        print("  - Substack")
        print("  - YouTube")
        print("  - Any website")
        print("\nExamples:")
        print("  python tinyfish-scraper.py https://x.com/user/status/123")
        print("  python tinyfish-scraper.py https://biblicalman.substack.com/p/article")
        return
        
    scraper = TinyFishScraper()
    
    if sys.argv[1] == "batch" and len(sys.argv) > 2:
        # Batch process
        with open(sys.argv[2], 'r') as f:
            urls = [line.strip() for line in f if line.strip()]
            
        for url in urls:
            print(f"\nProcessing: {url}")
            result = scraper.scrape_url(url)
            
            if "error" not in result:
                scraper.save_intel(result)
                print("✅ Success")
            else:
                print(f"❌ Error: {result['error']}")
                
    else:
        # Single URL
        url = sys.argv[1]
        result = scraper.scrape_url(url)
        
        if "error" not in result:
            scraper.save_intel(result)
            
            # Print summary
            print("\n=== Intel Summary ===")
            print(f"Platform: {result.get('platform')}")
            print(f"Type: {result.get('type')}")
            
            if 'analysis' in result:
                analysis = result['analysis']
                print(f"\nHook: {analysis.get('hook')}")
                print(f"Jake Triggers: {', '.join(analysis.get('jake_triggers', []))}")
                print(f"Angles: {', '.join(analysis.get('marketing_angle', []))}")
        else:
            print(f"❌ Error: {result['error']}")

if __name__ == "__main__":
    main()