# TinyFish API Status - January 31, 2026

## Issue
- TinyFish rebranded to **AgentQL**
- Old API at `api.tinyfish.io` and `tinyfish.ai` no longer serves the original endpoints
- `POST /v1/scrape` and `GET /v1/extract` returned 405 (Method Not Allowed)
- Auth via `Authorization: Bearer` header was also rejected

## Root Cause
TinyFish migrated their entire API to the AgentQL platform:
- **Old base URL**: `https://api.tinyfish.io/v1` / `https://tinyfish.ai/v1`
- **New base URL**: `https://api.agentql.com/v1`
- **Old endpoints**: `POST /scrape`, `GET /extract`
- **New endpoint**: `POST /query-data`
- **Old auth**: `Authorization: Bearer {key}`
- **New auth**: `X-API-Key: {key}` header
- **New body format**: Requires `query` field with AgentQL query language instead of simple options

## What Was Fixed
1. Updated base URL from `https://tinyfish.ai/v1` to `https://api.agentql.com/v1`
2. Changed auth header from `Authorization: Bearer` to `X-API-Key`
3. Replaced `/scrape` + `/extract` endpoints with single `POST /query-data`
4. Added AgentQL query templates for each platform (Twitter, Substack, YouTube, generic)
5. Updated response processing to handle AgentQL's `{"data": {...}, "metadata": {...}}` format
6. Updated env var loading to support both `AGENTQL_API_KEY` and legacy `TINYFISH_API_KEY`
7. Removed hardcoded API key fallback (use env var or `.env.agentql` file instead)

## Current Status
- Scraper updated to use AgentQL REST API
- Existing API key may need to be migrated — generate a new one at https://dev.agentql.com
- Set key via: `export AGENTQL_API_KEY=your-key-here` or add to `.env.agentql` file

## AgentQL API Reference
- Docs: https://docs.agentql.com/rest-api/api-reference
- Scraping guide: https://docs.agentql.com/scraping/scraping-data-api
- Dev portal (API keys): https://dev.agentql.com

## Alternative Scrapers Available
- `marketing-intel.sh` - Works for Substack, attempts X via Nitter
- `extract-intel` - Quick extractor for various platforms
- `web_fetch` tool - OpenClaw's built-in fetcher
- Browser tool with Chrome extension - Most reliable for X/Twitter
