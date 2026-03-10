export class PacScriptStrategy {
  constructor() {
    console.error("PacScriptStrategy not implemented");
  }

  applyConfig(config: TConfig) {
    if (config.proxiedHosts.length === 0) {
      browser.proxy.settings.clear({ scope: "regular" });
      return;
    }

    const pacScriptData = `
      function FindProxyForURL(url, host) {
        const proxiedHosts = ${JSON.stringify(config.proxiedHosts)};

        for (const h of proxiedHosts) {
           if (host === h || host.endsWith("." + h)) {
              return "PROXY 127.0.0.1:12334";
           }
        }
        return "DIRECT";
      }
    `;

    const proxyConfig = {
      mode: "pac_script" as const,
      pacScript: {
        data: pacScriptData,
      },
    };

    browser.proxy.settings.set({ value: proxyConfig, scope: "regular" });
  }
}
