import { on } from "@/utils/eventBus";
import { icon } from "./Icon";
import { proxy } from "./Proxy";

export class IconIndicator {
  public async init() {
    on("proxy:config-updated", () => this.refreshCurrentTabIcon());
    on("icon:clicked", (tabId) => this.setTabExtensionIcon(tabId));

    browser.tabs.onActivated.addListener(async (tabInfo) => {
      this.setTabExtensionIcon(tabInfo.tabId);
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.url) {
        this.setTabExtensionIcon(tabId);
      }
    });

    const actionApi = browser.action || browser.browserAction; // manifest v3 or v2
    actionApi.onClicked.addListener((tab) => emit("icon:clicked", tab.id!));
  }

  public async refreshCurrentTabIcon() {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tabs.length > 0 && tabs[0].id) {
      this.setTabExtensionIcon(tabs[0].id);
    }
  }

  public async setTabExtensionIcon(tabId: number) {
    const actionApi = browser.action || browser.browserAction; // manifest v3 or v2
    const tab = await browser.tabs.get(tabId);
    if (!tab.url) return;

    const isProxied = proxy.isHostProxied(getUrlHost(tab.url!) as string);
    const imageData = isProxied ? icon.colored : icon.grayscale;
    actionApi.setIcon({ imageData: imageData as any, tabId });
  }
}

export const iconIndicator = new IconIndicator();
