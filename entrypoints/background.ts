import { hostsStorage, type Host } from "@/utils/storage";

export default defineBackground(() => {
  if (browser.contextMenus) {
    browser.contextMenus.removeAll();
    browser.contextMenus.create({
      id: "open-configurations",
      title: "Proxy config",
      contexts: ["action"],
    });

    browser.contextMenus.onClicked.addListener((info) => {
      if (info.menuItemId === "open-configurations") {
        browser.tabs.create({
          url: browser.runtime.getURL("/proxy-config.html" as any),
        });
      }
    });
  }

  const actionApi = browser.action || browser.browserAction;

  if (actionApi && actionApi.onClicked) {
    actionApi.onClicked.addListener(async (tab) => {
      if (!tab.url || !tab.id) return;
      const url = new URL(tab.url);
      const hostname = url.hostname;

      const currentHosts = await hostsStorage.getValue();
      const existingIndex = currentHosts.findIndex((h) => h.url === hostname);

      if (existingIndex !== -1) {
        currentHosts.splice(existingIndex, 1);
        if (actionApi.setBadgeText)
          await actionApi.setBadgeText({ text: "OFF", tabId: tab.id });
        if (actionApi.setBadgeBackgroundColor)
          await actionApi.setBadgeBackgroundColor({
            color: "#6b7280",
            tabId: tab.id,
          });
      } else {
        currentHosts.push({
          id: crypto.randomUUID(),
          name: hostname,
          url: hostname,
        });
        if (actionApi.setBadgeText)
          await actionApi.setBadgeText({ text: "ON", tabId: tab.id });
        if (actionApi.setBadgeBackgroundColor)
          await actionApi.setBadgeBackgroundColor({
            color: "#4f46e5",
            tabId: tab.id,
          });
      }

      await hostsStorage.setValue(currentHosts);
    });
  }

  const applyProxySettings = async () => {
    if (!browser.proxy || !browser.proxy.settings) return;

    const hosts = await hostsStorage.getValue();
    const hostList = hosts.map((h) => h.url);

    if (hostList.length === 0) {
      browser.proxy.settings.clear({ scope: "regular" });
      return;
    }

    const pacScriptData = `
      function FindProxyForURL(url, host) {
        const proxiedHosts = ${JSON.stringify(hostList)};

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
  };

  hostsStorage.watch(applyProxySettings);

  applyProxySettings();

  const updateBadge = async (tabId: number, url?: string) => {
    if (!url) return;
    try {
      const u = new URL(url);
      const hostname = u.hostname;
      const hosts = await hostsStorage.getValue();
      const isProxied = hosts.some((h) => h.url === hostname);

      const actionApi = browser.action || browser.browserAction;
      if (actionApi) {
        if (isProxied) {
          if (actionApi.setBadgeText)
            await actionApi.setBadgeText({ text: "ON", tabId });
          if (actionApi.setBadgeBackgroundColor)
            await actionApi.setBadgeBackgroundColor({
              color: "#4f46e5",
              tabId,
            });
        } else {
          if (actionApi.setBadgeText)
            await actionApi.setBadgeText({ text: "", tabId });
        }
      }
    } catch (e) {}
  };

  if (browser.tabs) {
    if (browser.tabs.onActivated) {
      browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId);
        updateBadge(activeInfo.tabId, tab.url);
      });
    }

    if (browser.tabs.onUpdated) {
      browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete" && tab.url) {
          updateBadge(tabId, tab.url);
        }
      });
    }
  }
});
