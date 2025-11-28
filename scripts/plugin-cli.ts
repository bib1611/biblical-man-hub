#!/usr/bin/env npx tsx

/**
 * Plugin CLI for Biblical Man Hub
 *
 * Usage:
 *   npx tsx scripts/plugin-cli.ts marketplace add <owner/repo>
 *   npx tsx scripts/plugin-cli.ts marketplace list
 *   npx tsx scripts/plugin-cli.ts marketplace remove <owner/repo>
 *   npx tsx scripts/plugin-cli.ts plugin install <plugin-name>
 *   npx tsx scripts/plugin-cli.ts plugin list
 *   npx tsx scripts/plugin-cli.ts plugin uninstall <plugin-name>
 */

import { promises as fs } from 'fs';
import path from 'path';

const PLUGINS_DIR = path.join(process.cwd(), '.plugins');
const MARKETPLACE_CONFIG = path.join(PLUGINS_DIR, 'marketplace.json');
const INSTALLED_CONFIG = path.join(PLUGINS_DIR, 'installed.json');
const SOURCES_DIR = path.join(PLUGINS_DIR, 'sources');

interface PluginMarketplaceSource {
  id: string;
  owner: string;
  repo: string;
  url: string;
  addedAt: string;
}

interface PluginResource {
  name: string;
  type: string;
  path: string;
  description?: string;
}

interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  license?: string;
  main?: string;
  type: string;
  config?: Record<string, unknown>;
  dependencies?: Record<string, string>;
  resources?: PluginResource[];
}

interface InstalledPlugin {
  id: string;
  name: string;
  version: string;
  source: string;
  installedAt: string;
  enabled: boolean;
  manifest: PluginManifest;
  localPath: string;
}

interface MarketplaceConfig {
  version: string;
  sources: PluginMarketplaceSource[];
  lastUpdated: string | null;
}

interface InstalledPluginsConfig {
  version: string;
  plugins: InstalledPlugin[];
  lastUpdated: string | null;
}

async function ensureDirectories(): Promise<void> {
  await fs.mkdir(PLUGINS_DIR, { recursive: true });
  await fs.mkdir(SOURCES_DIR, { recursive: true });
}

async function getMarketplaceConfig(): Promise<MarketplaceConfig> {
  try {
    const content = await fs.readFile(MARKETPLACE_CONFIG, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { version: '1.0.0', sources: [], lastUpdated: null };
  }
}

async function saveMarketplaceConfig(config: MarketplaceConfig): Promise<void> {
  await ensureDirectories();
  await fs.writeFile(MARKETPLACE_CONFIG, JSON.stringify(config, null, 2));
}

async function getInstalledPlugins(): Promise<InstalledPluginsConfig> {
  try {
    const content = await fs.readFile(INSTALLED_CONFIG, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { version: '1.0.0', plugins: [], lastUpdated: null };
  }
}

async function saveInstalledPlugins(config: InstalledPluginsConfig): Promise<void> {
  await ensureDirectories();
  await fs.writeFile(INSTALLED_CONFIG, JSON.stringify(config, null, 2));
}

async function addMarketplaceSource(source: string): Promise<void> {
  const parts = source.split('/');
  if (parts.length !== 2) {
    console.error('Error: Invalid source format. Use: owner/repo');
    process.exit(1);
  }

  const [owner, repo] = parts;
  const config = await getMarketplaceConfig();

  const id = `${owner}/${repo}`;
  const existingIndex = config.sources.findIndex(s => s.id === id);

  const newSource: PluginMarketplaceSource = {
    id,
    owner,
    repo,
    url: `https://github.com/${owner}/${repo}`,
    addedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    config.sources[existingIndex] = newSource;
    console.log(`Updated marketplace source: ${id}`);
  } else {
    config.sources.push(newSource);
    console.log(`Added marketplace source: ${id}`);
  }

  config.lastUpdated = new Date().toISOString();
  await saveMarketplaceConfig(config);
  console.log(`Source URL: ${newSource.url}`);
}

async function listMarketplaceSources(): Promise<void> {
  const config = await getMarketplaceConfig();

  if (config.sources.length === 0) {
    console.log('No marketplace sources configured.');
    return;
  }

  console.log('Marketplace Sources:');
  console.log('-------------------');
  for (const source of config.sources) {
    console.log(`  ${source.id}`);
    console.log(`    URL: ${source.url}`);
    console.log(`    Added: ${source.addedAt}`);
    console.log('');
  }
}

async function removeMarketplaceSource(source: string): Promise<void> {
  const config = await getMarketplaceConfig();
  const initialLength = config.sources.length;
  config.sources = config.sources.filter(s => s.id !== source);

  if (config.sources.length < initialLength) {
    config.lastUpdated = new Date().toISOString();
    await saveMarketplaceConfig(config);
    console.log(`Removed marketplace source: ${source}`);
  } else {
    console.error(`Source not found: ${source}`);
    process.exit(1);
  }
}

async function fetchPluginManifest(owner: string, repo: string): Promise<PluginManifest | null> {
  try {
    const manifestUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/plugin.json`;
    console.log(`Fetching manifest from: ${manifestUrl}`);

    let response = await fetch(manifestUrl);

    if (!response.ok) {
      const altUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/plugin.json`;
      console.log(`Trying alternate URL: ${altUrl}`);
      response = await fetch(altUrl);

      if (!response.ok) {
        console.error(`Failed to fetch manifest from ${owner}/${repo}`);
        return null;
      }
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching plugin manifest:`, error);
    return null;
  }
}

async function downloadPluginFiles(
  owner: string,
  repo: string,
  targetDir: string,
  manifest: PluginManifest
): Promise<void> {
  const manifestPath = path.join(targetDir, 'plugin.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  Saved: plugin.json`);

  if (manifest.resources) {
    for (const resource of manifest.resources) {
      try {
        let resourceUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${resource.path}`;
        let response = await fetch(resourceUrl);

        if (!response.ok) {
          resourceUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${resource.path}`;
          response = await fetch(resourceUrl);
        }

        if (response.ok) {
          const content = await response.text();
          const targetPath = path.join(targetDir, resource.path);
          await fs.mkdir(path.dirname(targetPath), { recursive: true });
          await fs.writeFile(targetPath, content);
          console.log(`  Saved: ${resource.path}`);
        } else {
          console.warn(`  Warning: Could not download ${resource.path}`);
        }
      } catch (error) {
        console.warn(`  Warning: Error downloading ${resource.path}:`, error);
      }
    }
  }

  try {
    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    let response = await fetch(readmeUrl);

    if (!response.ok) {
      response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
    }

    if (response.ok) {
      const content = await response.text();
      await fs.writeFile(path.join(targetDir, 'README.md'), content);
      console.log(`  Saved: README.md`);
    }
  } catch {
    // README is optional
  }
}

async function installPlugin(pluginName: string): Promise<void> {
  const config = await getMarketplaceConfig();

  if (config.sources.length === 0) {
    console.error('No marketplace sources configured. Add a source first.');
    console.error('Usage: npx tsx scripts/plugin-cli.ts marketplace add owner/repo');
    process.exit(1);
  }

  let foundSource: PluginMarketplaceSource | null = null;
  let manifest: PluginManifest | null = null;

  console.log(`Searching for plugin "${pluginName}"...`);

  for (const source of config.sources) {
    if (source.repo === pluginName || source.id.endsWith(`/${pluginName}`)) {
      console.log(`Found in source: ${source.id}`);
      foundSource = source;
      manifest = await fetchPluginManifest(source.owner, source.repo);
      if (manifest) break;
    }
  }

  if (!foundSource || !manifest) {
    console.error(`Plugin "${pluginName}" not found in any marketplace source.`);
    console.log('\nAvailable sources:');
    for (const source of config.sources) {
      console.log(`  - ${source.id}`);
    }
    process.exit(1);
  }

  console.log(`\nInstalling ${manifest.name} v${manifest.version}...`);
  console.log(`Description: ${manifest.description}`);
  console.log(`Author: ${manifest.author}`);
  console.log(`Type: ${manifest.type}`);

  const installed = await getInstalledPlugins();
  const existingIndex = installed.plugins.findIndex(p => p.name === manifest!.name);

  const pluginDir = path.join(SOURCES_DIR, manifest.name);
  await fs.mkdir(pluginDir, { recursive: true });

  console.log(`\nDownloading files to: ${pluginDir}`);
  await downloadPluginFiles(foundSource.owner, foundSource.repo, pluginDir, manifest);

  const installedPlugin: InstalledPlugin = {
    id: `${foundSource.id}:${manifest.name}`,
    name: manifest.name,
    version: manifest.version,
    source: foundSource.id,
    installedAt: new Date().toISOString(),
    enabled: true,
    manifest,
    localPath: pluginDir,
  };

  if (existingIndex >= 0) {
    installed.plugins[existingIndex] = installedPlugin;
    console.log(`\nUpdated plugin: ${manifest.name}`);
  } else {
    installed.plugins.push(installedPlugin);
    console.log(`\nInstalled plugin: ${manifest.name}`);
  }

  installed.lastUpdated = new Date().toISOString();
  await saveInstalledPlugins(installed);

  console.log('\nPlugin installation complete!');
}

async function listInstalledPlugins(): Promise<void> {
  const config = await getInstalledPlugins();

  if (config.plugins.length === 0) {
    console.log('No plugins installed.');
    return;
  }

  console.log('Installed Plugins:');
  console.log('-----------------');
  for (const plugin of config.plugins) {
    console.log(`  ${plugin.name} v${plugin.version}`);
    console.log(`    Source: ${plugin.source}`);
    console.log(`    Type: ${plugin.manifest.type}`);
    console.log(`    Enabled: ${plugin.enabled}`);
    console.log(`    Installed: ${plugin.installedAt}`);
    console.log(`    Path: ${plugin.localPath}`);
    console.log('');
  }
}

async function uninstallPlugin(pluginName: string): Promise<void> {
  const installed = await getInstalledPlugins();
  const pluginIndex = installed.plugins.findIndex(p => p.name === pluginName);

  if (pluginIndex < 0) {
    console.error(`Plugin not found: ${pluginName}`);
    process.exit(1);
  }

  const plugin = installed.plugins[pluginIndex];

  try {
    await fs.rm(plugin.localPath, { recursive: true, force: true });
    console.log(`Removed plugin files from: ${plugin.localPath}`);
  } catch (error) {
    console.warn(`Warning: Could not remove plugin files:`, error);
  }

  installed.plugins.splice(pluginIndex, 1);
  installed.lastUpdated = new Date().toISOString();
  await saveInstalledPlugins(installed);

  console.log(`Uninstalled plugin: ${pluginName}`);
}

function showHelp(): void {
  console.log(`
Plugin CLI for Biblical Man Hub

Usage:
  npx tsx scripts/plugin-cli.ts <command> <subcommand> [options]

Commands:
  marketplace add <owner/repo>     Add a marketplace source
  marketplace list                 List all marketplace sources
  marketplace remove <owner/repo>  Remove a marketplace source

  plugin install <name>            Install a plugin from marketplace
  plugin list                      List installed plugins
  plugin uninstall <name>          Uninstall a plugin

Examples:
  npx tsx scripts/plugin-cli.ts marketplace add glittercowboy/taches-cc-resources
  npx tsx scripts/plugin-cli.ts plugin install taches-cc-resources
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const [command, subcommand, ...rest] = args;

  try {
    if (command === 'marketplace') {
      switch (subcommand) {
        case 'add':
          if (!rest[0]) {
            console.error('Error: Source required (format: owner/repo)');
            process.exit(1);
          }
          await addMarketplaceSource(rest[0]);
          break;
        case 'list':
          await listMarketplaceSources();
          break;
        case 'remove':
          if (!rest[0]) {
            console.error('Error: Source required');
            process.exit(1);
          }
          await removeMarketplaceSource(rest[0]);
          break;
        default:
          console.error(`Unknown subcommand: ${subcommand}`);
          showHelp();
          process.exit(1);
      }
    } else if (command === 'plugin') {
      switch (subcommand) {
        case 'install':
          if (!rest[0]) {
            console.error('Error: Plugin name required');
            process.exit(1);
          }
          await installPlugin(rest[0]);
          break;
        case 'list':
          await listInstalledPlugins();
          break;
        case 'uninstall':
          if (!rest[0]) {
            console.error('Error: Plugin name required');
            process.exit(1);
          }
          await uninstallPlugin(rest[0]);
          break;
        default:
          console.error(`Unknown subcommand: ${subcommand}`);
          showHelp();
          process.exit(1);
      }
    } else {
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
