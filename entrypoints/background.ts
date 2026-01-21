export default defineBackground(() => {
  browser.contextMenus.create({
    id: "open-options",
    title: "Proxy config",
    contexts: ["action"],
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "open-options") {
      browser.tabs.create({
        url: browser.runtime.getURL("/options.html"),
      });
    }
  });
});
