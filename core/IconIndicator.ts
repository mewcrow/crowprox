import { on } from "@/utils/eventBus";
import { icon } from "./Icon";
import { proxy } from "./Proxy";

export class IconIndicator {
  public async initListeners() {
    on("proxy:hosts-updated", () => this.refreshCurrentTabIcon());
    on("icon:clicked", (tabId) => this.setTabExtensionIcon(tabId));

    browser.tabs.onActivated.addListener(async (tabInfo) => {
      this.setTabExtensionIcon(tabInfo.tabId);
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.url) {
        this.setTabExtensionIcon(tabId);
      }
    });
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

    const isProxied = proxy.isHostProxied(tab.url!);
    const imageData = isProxied ? icon.colored : icon.grayscale;
    actionApi.setIcon({ imageData: imageData as any, tabId });
  }
}
