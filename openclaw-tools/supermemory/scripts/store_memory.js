#!/usr/bin/env node
/**
 * Store a memory in Supermemory - OpenClaw Bot
 *
 * Usage:
 *   node store_memory.js "content to remember" '{"source":"chat"}'
 *   node store_memory.js "content" '{"source":"chat","tags":["openclaw"]}'
 *
 * Env: SUPERMEMORY_API_KEY
 * API: POST https://api.supermemory.ai/v3/documents
 * Docs: https://supermemory.ai/docs/memory-api/creation/adding-memories
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Load API key from env or .env.supermemory file
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

async function storeMemory(content, options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Error: No SUPERMEMORY_API_KEY found");
    process.exit(1);
  }

  const payload = { content };

  // Support containerTags from options
  if (options.tags) {
    payload.containerTags = Array.isArray(options.tags) ? options.tags : [options.tags];
  } else {
    payload.containerTags = ["openclaw"];
  }

  // Support metadata
  if (options.source || options.metadata) {
    payload.metadata = options.metadata || {};
    if (options.source) payload.metadata.source = options.source;
  }

  // Support customId for dedup
  if (options.customId) {
    payload.customId = options.customId;
  }

  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.supermemory.ai",
        port: 443,
        path: "/v3/documents",
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

// CLI
async function main() {
  const content = process.argv[2];
  if (!content) {
    console.log("Usage: node store_memory.js \"content\" '{\"source\":\"chat\"}'");
    process.exit(1);
  }

  let options = {};
  if (process.argv[3]) {
    try {
      options = JSON.parse(process.argv[3]);
    } catch (e) {
      console.error("Invalid JSON options:", e.message);
      process.exit(1);
    }
  }

  try {
    const result = await storeMemory(content, options);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Failed to store memory:", err.message);
    process.exit(1);
  }
}

main();
