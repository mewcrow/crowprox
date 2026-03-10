import type { IProxyStrategy } from "./IProxyStrategy";
import { getUrlHost } from "@/utils";
import { configStorage } from "@/core/ConfigStorage";

export class FixedServersStrategy implements IProxyStrategy {
  async toggleTabProxying(tabId: number) {
    const tab = await browser.tabs.get(tabId);
    const hostname = getUrlHost(tab.url!);
    if (!hostname) return;

    const newConfig = { ...configStorage.value };
    const existingIndex = newConfig.bypassedHosts.findIndex(
      (h) => h === hostname,
    );

    if (existingIndex !== -1) {
      newConfig.bypassedHosts.splice(existingIndex, 1);
    } else {
      newConfig.bypassedHosts.push(hostname);
    }

    configStorage.value = newConfig;
  }

  isHostProxied(hostname: string): boolean {
    if (!hostname) return false;
    return !configStorage.value.bypassedHosts.includes(hostname);
  }

  public async applyConfig() {
    const proxyServer = configStorage.value.proxyServer;

    const proxyConfig = {
      mode: "fixed_servers" as const,
      rules: {
        singleProxy: {
          scheme: proxyServer.protocol,
          host: proxyServer.host,
          port: proxyServer.port,
        },
        bypassList: ["<local>", ...configStorage.value.bypassedHosts],
      },
    };

    await browser.proxy.settings.set({
      value: proxyConfig,
      scope: "regular",
    });
  }
}
