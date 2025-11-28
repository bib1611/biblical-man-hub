import { promises as fs } from 'fs';
import path from 'path';
import type {
  PluginMarketplaceSource,
  PluginManifest,
  InstalledPlugin,
  MarketplaceConfig,
  InstalledPluginsConfig,
} from '@/types';

const PLUGINS_DIR = path.join(process.cwd(), '.plugins');
const MARKETPLACE_CONFIG = path.join(PLUGINS_DIR, 'marketplace.json');
const INSTALLED_CONFIG = path.join(PLUGINS_DIR, 'installed.json');
const SOURCES_DIR = path.join(PLUGINS_DIR, 'sources');

export class PluginManager {
  private static instance: PluginManager;

  private constructor() {}

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  async ensureDirectories(): Promise<void> {
    await fs.mkdir(PLUGINS_DIR, { recursive: true });
    await fs.mkdir(SOURCES_DIR, { recursive: true });
  }

  async getMarketplaceConfig(): Promise<MarketplaceConfig> {
    try {
      const content = await fs.readFile(MARKETPLACE_CONFIG, 'utf-8');
      return JSON.parse(content);
    } catch {
      return { version: '1.0.0', sources: [], lastUpdated: null };
    }
  }

  async saveMarketplaceConfig(config: MarketplaceConfig): Promise<void> {
    await this.ensureDirectories();
    await fs.writeFile(MARKETPLACE_CONFIG, JSON.stringify(config, null, 2));
  }

  async getInstalledPlugins(): Promise<InstalledPluginsConfig> {
    try {
      const content = await fs.readFile(INSTALLED_CONFIG, 'utf-8');
      return JSON.parse(content);
    } catch {
      return { version: '1.0.0', plugins: [], lastUpdated: null };
    }
  }

  async saveInstalledPlugins(config: InstalledPluginsConfig): Promise<void> {
    await this.ensureDirectories();
    await fs.writeFile(INSTALLED_CONFIG, JSON.stringify(config, null, 2));
  }

  async addMarketplaceSource(owner: string, repo: string): Promise<PluginMarketplaceSource> {
    const config = await this.getMarketplaceConfig();

    const id = `${owner}/${repo}`;
    const existingIndex = config.sources.findIndex(s => s.id === id);

    const source: PluginMarketplaceSource = {
      id,
      owner,
      repo,
      url: `https://github.com/${owner}/${repo}`,
      addedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      config.sources[existingIndex] = source;
    } else {
      config.sources.push(source);
    }

    config.lastUpdated = new Date().toISOString();
    await this.saveMarketplaceConfig(config);

    return source;
  }

  async removeMarketplaceSource(id: string): Promise<boolean> {
    const config = await this.getMarketplaceConfig();
    const initialLength = config.sources.length;
    config.sources = config.sources.filter(s => s.id !== id);

    if (config.sources.length < initialLength) {
      config.lastUpdated = new Date().toISOString();
      await this.saveMarketplaceConfig(config);
      return true;
    }
    return false;
  }

  async fetchPluginManifest(owner: string, repo: string): Promise<PluginManifest | null> {
    try {
      const manifestUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/plugin.json`;
      const response = await fetch(manifestUrl);

      if (!response.ok) {
        const altUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/plugin.json`;
        const altResponse = await fetch(altUrl);
        if (!altResponse.ok) {
          console.error(`Failed to fetch manifest from ${owner}/${repo}`);
          return null;
        }
        return await altResponse.json();
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching plugin manifest:`, error);
      return null;
    }
  }

  async installPlugin(pluginName: string): Promise<InstalledPlugin | null> {
    const config = await this.getMarketplaceConfig();

    let foundSource: PluginMarketplaceSource | null = null;
    let manifest: PluginManifest | null = null;

    for (const source of config.sources) {
      if (source.repo === pluginName || source.id.endsWith(`/${pluginName}`)) {
        foundSource = source;
        manifest = await this.fetchPluginManifest(source.owner, source.repo);
        if (manifest) break;
      }
    }

    if (!foundSource || !manifest) {
      console.error(`Plugin "${pluginName}" not found in any marketplace source`);
      return null;
    }

    const installed = await this.getInstalledPlugins();
    const existingIndex = installed.plugins.findIndex(p => p.name === manifest!.name);

    const pluginDir = path.join(SOURCES_DIR, manifest.name);
    await fs.mkdir(pluginDir, { recursive: true });

    await this.downloadPluginFiles(foundSource.owner, foundSource.repo, pluginDir, manifest);

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
    } else {
      installed.plugins.push(installedPlugin);
    }

    installed.lastUpdated = new Date().toISOString();
    await this.saveInstalledPlugins(installed);

    return installedPlugin;
  }

  async downloadPluginFiles(
    owner: string,
    repo: string,
    targetDir: string,
    manifest: PluginManifest
  ): Promise<void> {
    const manifestPath = path.join(targetDir, 'plugin.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    if (manifest.resources) {
      for (const resource of manifest.resources) {
        try {
          const resourceUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${resource.path}`;
          const response = await fetch(resourceUrl);

          if (!response.ok) {
            const altUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${resource.path}`;
            const altResponse = await fetch(altUrl);
            if (altResponse.ok) {
              const content = await altResponse.text();
              const targetPath = path.join(targetDir, resource.path);
              await fs.mkdir(path.dirname(targetPath), { recursive: true });
              await fs.writeFile(targetPath, content);
            }
          } else {
            const content = await response.text();
            const targetPath = path.join(targetDir, resource.path);
            await fs.mkdir(path.dirname(targetPath), { recursive: true });
            await fs.writeFile(targetPath, content);
          }
        } catch (error) {
          console.error(`Error downloading resource ${resource.path}:`, error);
        }
      }
    }

    try {
      const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
      const response = await fetch(readmeUrl);
      if (response.ok) {
        const content = await response.text();
        await fs.writeFile(path.join(targetDir, 'README.md'), content);
      }
    } catch {
      // README is optional
    }
  }

  async uninstallPlugin(pluginName: string): Promise<boolean> {
    const installed = await this.getInstalledPlugins();
    const pluginIndex = installed.plugins.findIndex(p => p.name === pluginName);

    if (pluginIndex < 0) {
      return false;
    }

    const plugin = installed.plugins[pluginIndex];

    try {
      await fs.rm(plugin.localPath, { recursive: true, force: true });
    } catch (error) {
      console.error(`Error removing plugin files:`, error);
    }

    installed.plugins.splice(pluginIndex, 1);
    installed.lastUpdated = new Date().toISOString();
    await this.saveInstalledPlugins(installed);

    return true;
  }

  async listMarketplaceSources(): Promise<PluginMarketplaceSource[]> {
    const config = await this.getMarketplaceConfig();
    return config.sources;
  }

  async listInstalledPlugins(): Promise<InstalledPlugin[]> {
    const config = await this.getInstalledPlugins();
    return config.plugins;
  }

  async togglePlugin(pluginName: string, enabled: boolean): Promise<boolean> {
    const installed = await this.getInstalledPlugins();
    const plugin = installed.plugins.find(p => p.name === pluginName);

    if (!plugin) {
      return false;
    }

    plugin.enabled = enabled;
    installed.lastUpdated = new Date().toISOString();
    await this.saveInstalledPlugins(installed);

    return true;
  }

  async getPlugin(pluginName: string): Promise<InstalledPlugin | null> {
    const installed = await this.getInstalledPlugins();
    return installed.plugins.find(p => p.name === pluginName) || null;
  }
}

export const pluginManager = PluginManager.getInstance();
