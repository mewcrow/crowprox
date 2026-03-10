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
    const lvl1domain = hostname.split(".").slice(-2).join(".");
    return !configStorage.value.bypassedHosts.includes(lvl1domain);
  }

  public async applyConfig() {
    const proxyServer = configStorage.value.proxyServer;
    const bypassedHosts = configStorage.value.bypassedHosts.reduce(
      (acc, host) => {
        acc.push(host);
        acc.push(`.${host}`);
        return acc;
      },
      [] as string[],
    );

    const proxyConfig = {
      mode: "fixed_servers" as const,
      rules: {
        singleProxy: {
          scheme: proxyServer.protocol,
          host: proxyServer.host,
          port: proxyServer.port,
        },
        bypassList: ["<local>", ...bypassedHosts],
      },
    };

    await browser.proxy.settings.set({
      value: proxyConfig,
      scope: "regular",
    });
  }
}
