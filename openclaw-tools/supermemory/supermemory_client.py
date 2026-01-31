#!/usr/bin/env python3
"""
Supermemory Client - OpenClaw Bot Integration
Cloud API client for https://api.supermemory.ai/v3

Docs: https://supermemory.ai/docs/memory-api/overview
"""

import os
import sys
import json
import requests

# Load API key
API_KEY = os.environ.get('SUPERMEMORY_API_KEY')
if not API_KEY:
    for env_file in ['.env.supermemory', '.env']:
        try:
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('SUPERMEMORY_API_KEY='):
                        API_KEY = line.split('=', 1)[1].strip().strip('"').strip("'")
                        break
            if API_KEY:
                break
        except FileNotFoundError:
            continue

BASE_URL = "https://api.supermemory.ai/v3"


class SupermemoryClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or API_KEY
        if not self.api_key:
            raise ValueError(
                "No API key. Set SUPERMEMORY_API_KEY env var or create .env.supermemory file."
            )
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def add(self, content, container_tags=None, metadata=None, custom_id=None):
        """Add a memory/document.

        Args:
            content: Text content, URL, or description to store.
            container_tags: List of tags to group memories (e.g. ["openclaw", "intel"]).
            metadata: Dict of arbitrary metadata (e.g. {"source": "chat", "type": "note"}).
            custom_id: Optional unique ID to prevent duplicates and enable updates.

        Returns:
            {"id": "...", "status": "queued"} on success.
        """
        payload = {"content": content}
        if container_tags:
            payload["containerTags"] = container_tags
        if metadata:
            payload["metadata"] = metadata
        if custom_id:
            payload["customId"] = custom_id

        resp = requests.post(
            f"{BASE_URL}/documents",
            headers=self.headers,
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()

    def search(self, query, limit=10, container_tags=None, filters=None,
               include_full_docs=False, include_summary=True):
        """Search memories by natural language query.

        Args:
            query: Natural language search string.
            limit: Max results to return.
            container_tags: Filter to specific groups.
            filters: Metadata filters with AND/OR logic.
            include_full_docs: Return full document content.
            include_summary: Return AI-generated summaries.

        Returns:
            {"results": [{"documentId": "...", "score": 0.89, "chunks": [...]}]}
        """
        payload = {
            "q": query,
            "limit": limit,
            "includeFullDocs": include_full_docs,
            "includeSummary": include_summary,
        }
        if container_tags:
            payload["containerTags"] = container_tags
        if filters:
            payload["filters"] = filters

        resp = requests.post(
            f"{BASE_URL}/search",
            headers=self.headers,
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()

    def get(self, document_id):
        """Retrieve a specific document by ID."""
        resp = requests.get(
            f"{BASE_URL}/documents/{document_id}",
            headers=self.headers,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()

    def list(self, container_tags=None, limit=20):
        """List stored documents."""
        payload = {"limit": limit}
        if container_tags:
            payload["containerTags"] = container_tags

        resp = requests.post(
            f"{BASE_URL}/documents/list",
            headers=self.headers,
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()

    def delete(self, document_id):
        """Delete a document by ID."""
        resp = requests.delete(
            f"{BASE_URL}/documents/{document_id}",
            headers=self.headers,
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()


def main():
    """CLI interface for supermemory."""
    if len(sys.argv) < 2:
        print("Supermemory Client - OpenClaw Bot")
        print("\nUsage:")
        print("  python supermemory_client.py add \"content to remember\" [tag1,tag2]")
        print("  python supermemory_client.py search \"query\" [tag1,tag2]")
        print("  python supermemory_client.py get <document_id>")
        print("  python supermemory_client.py list [tag1,tag2]")
        print("  python supermemory_client.py delete <document_id>")
        print("\nExamples:")
        print('  python supermemory_client.py add "TinyFish rebranded to AgentQL" openclaw,intel')
        print('  python supermemory_client.py search "what happened with TinyFish"')
        return

    client = SupermemoryClient()
    cmd = sys.argv[1]

    if cmd == "add" and len(sys.argv) >= 3:
        content = sys.argv[2]
        tags = sys.argv[3].split(",") if len(sys.argv) > 3 else ["openclaw"]
        metadata_str = sys.argv[4] if len(sys.argv) > 4 else None
        metadata = json.loads(metadata_str) if metadata_str else {"source": "cli"}

        result = client.add(content, container_tags=tags, metadata=metadata)
        print(json.dumps(result, indent=2))

    elif cmd == "search" and len(sys.argv) >= 3:
        query = sys.argv[2]
        tags = sys.argv[3].split(",") if len(sys.argv) > 3 else None
        result = client.search(query, container_tags=tags)

        for r in result.get("results", []):
            print(f"\n--- Score: {r.get('score', 'N/A')} ---")
            for chunk in r.get("chunks", []):
                print(chunk.get("content", "")[:500])

    elif cmd == "get" and len(sys.argv) >= 3:
        result = client.get(sys.argv[2])
        print(json.dumps(result, indent=2))

    elif cmd == "list":
        tags = sys.argv[2].split(",") if len(sys.argv) > 2 else None
        result = client.list(container_tags=tags)
        print(json.dumps(result, indent=2))

    elif cmd == "delete" and len(sys.argv) >= 3:
        result = client.delete(sys.argv[2])
        print(json.dumps(result, indent=2))

    else:
        print(f"Unknown command: {cmd}")
        print("Run without arguments for usage help.")


if __name__ == "__main__":
    main()
