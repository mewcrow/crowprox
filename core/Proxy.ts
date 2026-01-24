import { hostsStorage } from "@/utils/storage";
import { getUrlHost } from "@/utils";
import { emit, on } from "@/utils/eventBus";

export class Proxy {
  private proxiedHosts: string[] = [];

  public initListeners() {
    on("proxy:hosts-updated", (hosts) => (this.hosts = hosts));
    on("icon:clicked", async (tabId) => {
      const tab = await browser.tabs.get(tabId);
      this.toggleHostProxying(tab.url!);
    });
  }

  set hosts(hosts: string[]) {
    this.proxiedHosts = hosts;
    this.applySettings();
  }

  public isHostProxied(hostname: string) {
    return this.proxiedHosts.some((h) => h === getUrlHost(hostname));
  }

  public async toggleHostProxying(url: string) {
    const hostname = getUrlHost(url);
    if (!hostname) return;

    const existingIndex = this.proxiedHosts.findIndex((h) => h === hostname);
    if (existingIndex !== -1) {
      this.proxiedHosts.splice(existingIndex, 1);
    } else {
      this.proxiedHosts.push(hostname);
    }

    await hostsStorage.setValue(this.proxiedHosts);
  }

  private async applySettings() {
    if (this.proxiedHosts.length === 0) {
      browser.proxy.settings.clear({ scope: "regular" });
      return;
    }

    const pacScriptData = `
      function FindProxyForURL(url, host) {
        const proxiedHosts = ${JSON.stringify(this.proxiedHosts)};

        for (const h of proxiedHosts) {
           if (host === h || host.endsWith("." + h)) {
              return "PROXY 127.0.0.1:12334";
           }
        }
        return "DIRECT";
      }
    `;

    const config = {
      mode: "pac_script" as const,
      pacScript: {
        data: pacScriptData,
      },
    };

    browser.proxy.settings.set({ value: config, scope: "regular" });
  }
}

export const proxy = new Proxy();
