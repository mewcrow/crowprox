import type { Browser } from "wxt/browser";

class ContextMenu {
  init() {
    browser.contextMenus.removeAll();

    browser.contextMenus.create({
      id: "proxy-config",
      title: "Proxy config",
      contexts: ["action"],
    });

    browser.contextMenus.onClicked.addListener((info) =>
      this.handleContextClick(info),
    );
  }

  private handleContextClick(info: Browser.contextMenus.OnClickData) {
    if (info.menuItemId === "proxy-config") {
      browser.tabs.create({
        url: browser.runtime.getURL("/proxy-config.html" as any),
      });
    }
  }
}

export const contextMenu = new ContextMenu();
