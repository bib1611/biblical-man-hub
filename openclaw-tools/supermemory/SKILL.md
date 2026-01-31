# Supermemory Skill - OpenClaw Bot

## Overview
Cloud-based semantic memory via Supermemory API. Complements file-based MEMORY.md with persistent, searchable, semantic memory that survives workspace resets.

## API
- **Base URL**: `https://api.supermemory.ai/v3`
- **Auth**: `Authorization: Bearer $SUPERMEMORY_API_KEY`
- **Key env var**: `SUPERMEMORY_API_KEY`

## Commands

### Store a memory
```bash
node store_memory.js "content" '{"source":"chat","tags":["openclaw"]}'
```

### Search memories
```bash
node query_memory.js "search query"
node query_memory.js "search query" --tags openclaw --limit 5
```

## When to Use

| Use File-based (MEMORY.md) | Use Supermemory |
|---|---|
| Core identity facts | Scraped intel and research |
| Daily session logs | Cross-session search |
| Quick reference notes | Large content storage |
| Private/sensitive context | Anything needing semantic search |

## containerTags Convention
- `openclaw` - General memories
- `intel` - Scraped intelligence
- `chat` - Conversation history
- `project_{name}` - Per-project context

## API Endpoints Quick Reference

| Action | Method | Path |
|--------|--------|------|
| Add memory | POST | `/v3/documents` |
| Search | POST | `/v3/search` |
| List | POST | `/v3/documents/list` |
| Get by ID | GET | `/v3/documents/{id}` |
| Delete | DELETE | `/v3/documents/{id}` |
