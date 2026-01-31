#!/usr/bin/env node
/**
 * Search/query memories from Supermemory - OpenClaw Bot
 *
 * Usage:
 *   node query_memory.js "search query"
 *   node query_memory.js "search query" --tags openclaw,intel
 *   node query_memory.js "search query" --limit 5
 *
 * Env: SUPERMEMORY_API_KEY
 * API: POST https://api.supermemory.ai/v3/search
 * Docs: https://supermemory.ai/docs/search/overview
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Load API key
function getApiKey() {
  if (process.env.SUPERMEMORY_API_KEY) return process.env.SUPERMEMORY_API_KEY;

  const envFiles = [".env.supermemory", ".env"];
  for (const envFile of envFiles) {
    try {
      const envPath = path.resolve(process.cwd(), envFile);
      const content = fs.readFileSync(envPath, "utf8");
      for (const line of content.split("\n")) {
        if (line.startsWith("SUPERMEMORY_API_KEY=")) {
          return line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    } catch (_) {}
  }
  return null;
}

async function queryMemory(query, options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Error: No SUPERMEMORY_API_KEY found");
    process.exit(1);
  }

  const payload = {
    q: query,
    limit: options.limit || 10,
    includeSummary: true,
    includeFullDocs: options.fullDocs || false,
  };

  if (options.tags) {
    payload.containerTags = Array.isArray(options.tags) ? options.tags : options.tags.split(",");
  }

  if (options.filters) {
    payload.filters = options.filters;
  }

  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.supermemory.ai",
        port: 443,
        path: "/v3/search",
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`API ${res.statusCode}: ${data}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// Parse CLI args
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  let query = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--tags" && args[i + 1]) {
      options.tags = args[++i];
    } else if (args[i] === "--limit" && args[i + 1]) {
      options.limit = parseInt(args[++i], 10);
    } else if (args[i] === "--full") {
      options.fullDocs = true;
    } else if (!query) {
      query = args[i];
    }
  }

  return { query, options };
}

async function main() {
  const { query, options } = parseArgs();

  if (!query) {
    console.log("Usage: node query_memory.js \"search query\" [--tags tag1,tag2] [--limit N] [--full]");
    process.exit(1);
  }

  try {
    const result = await queryMemory(query, options);
    const results = result.results || [];

    if (results.length === 0) {
      console.log("No memories found.");
      return;
    }

    console.log(`Found ${results.length} result(s):\n`);
    for (const r of results) {
      const score = r.score ? `(score: ${r.score.toFixed(2)})` : "";
      console.log(`--- ${r.documentId || "?"} ${score} ---`);
      if (r.title) console.log(`Title: ${r.title}`);
      for (const chunk of r.chunks || []) {
        console.log(chunk.content ? chunk.content.substring(0, 500) : "(empty)");
      }
      console.log();
    }

    // Also output raw JSON for piping
    if (process.stdout.isTTY === false) {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error("Search failed:", err.message);
    process.exit(1);
  }
}

main();
