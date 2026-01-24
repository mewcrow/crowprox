import { contextMenu } from "@/core";
import { icon } from "@/core/Icon";
import { IconIndicator } from "@/core/IconIndicator";
import { proxy } from "@/core/Proxy";
import { hostsStorage } from "@/utils/storage";

export default defineBackground(() => {
  // Warns if called async directly
  (async () => {
    const proxiedHosts = await hostsStorage.getValue();

    await icon.prepare();

    const iconIndicator = new IconIndicator();
    iconIndicator.initListeners();
    proxy.initListeners();

    proxy.hosts = proxiedHosts;

    hostsStorage.watch((hosts) => emit("proxy:hosts-updated", hosts));

    const actionApi = browser.action || browser.browserAction; // manifest v3 or v2
    actionApi.onClicked.addListener((tab) => emit("icon:clicked", tab.id!));

    contextMenu.update();
  })();
});
