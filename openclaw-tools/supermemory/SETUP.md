# Supermemory Setup - OpenClaw Bot

## API Configuration

### 1. Set your API key

Create `.env.supermemory` in your workspace root:

```
SUPERMEMORY_API_KEY=sm_AWhaKSMSSEexvU3Z1LEBH9_QXiCXGDVNgCkxGDrhJhpdNtawycVfMBTmwTSaVjKACceQugFUlVymGHdgEyUsJnQ
```

Or export as environment variable:
```bash
export SUPERMEMORY_API_KEY="sm_AWhaKSMSSEexvU3Z1LEBH9_QXiCXGDVNgCkxGDrhJhpdNtawycVfMBTmwTSaVjKACceQugFUlVymGHdgEyUsJnQ"
```

### 2. API Details

| Setting | Value |
|---------|-------|
| Base URL | `https://api.supermemory.ai/v3` |
| Auth | `Authorization: Bearer {api_key}` |
| Add memory | `POST /v3/documents` |
| Search | `POST /v3/search` |
| List docs | `POST /v3/documents/list` |
| Get doc | `GET /v3/documents/{id}` |
| Delete doc | `DELETE /v3/documents/{id}` |

## Usage

### Node.js scripts (for OpenClaw bot skills)

Store a memory:
```bash
node supermemory/scripts/store_memory.js "Important thing to remember" '{"source":"chat"}'
```

Search memories:
```bash
node supermemory/scripts/query_memory.js "search query"
node supermemory/scripts/query_memory.js "search query" --tags openclaw --limit 5
```

### Python client

```bash
python supermemory/supermemory_client.py add "content to remember" openclaw,intel
python supermemory/supermemory_client.py search "what happened with TinyFish"
python supermemory/supermemory_client.py list openclaw
```

### From Python code

```python
from supermemory.supermemory_client import SupermemoryClient

client = SupermemoryClient()
client.add("TinyFish rebranded to AgentQL", container_tags=["openclaw", "intel"])
results = client.search("what API changes happened")
```

## Integration with OpenClaw Bot

### Best of both worlds approach

- **File-based (MEMORY.md)**: Core identity, daily logs, session history
- **Supermemory (cloud API)**: Semantic search across everything, survives file deletions

### When to use Supermemory

- Storing intel from scraping sessions
- Remembering conversations and insights
- Searching across months of accumulated knowledge
- Anything that needs to survive workspace resets

### containerTags convention

- `openclaw` - General bot memories
- `intel` - Scraped intelligence
- `chat` - Conversation memories
- `project_{name}` - Project-specific context

## Docs

- API overview: https://supermemory.ai/docs/memory-api/overview
- Adding memories: https://supermemory.ai/docs/memory-api/creation/adding-memories
- Search: https://supermemory.ai/docs/search/overview
- Console (manage keys): https://console.supermemory.ai
