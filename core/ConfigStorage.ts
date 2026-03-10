import { ref, toRaw } from "vue";

class ConfigStorage {
  public default = {
    isEnabled: true,
    proxyStrategy: "FixedServers" as "FixedServers" | "OnRequest" | "PacScript",
    proxyServer: {
      host: "127.0.0.1",
      port: 12334,
      protocol: "http" as "http" | "https" | "quic" | "socks4" | "socks5",
    },
    bypassedHosts: [] as string[],
    proxiedHosts: [] as string[],
  };

  private refValue = ref(this.default);
  private persisted = storage.defineItem<TConfig>("local:config", {
    defaultValue: this.default,
  });

  public get value() {
    return toRaw(this.refValue.value);
  }

  public set value(v: TConfig) {
    this.persisted.setValue(v);
    this.refValue.value = v;
  }

  public get ref() {
    return this.refValue;
  }

  public async init() {
    const stored = await this.persisted.getValue();
    this.refValue.value = stored;

    this.persisted.watch((config) => {
      this.value = config;
      emit("proxy:config-updated", config);
    });

    this.validateConfig();
  }

  private async validateConfig() {
    const isValid = Object.keys(this.value).every((key) => {
      return (
        realTypeOf((this.value as any)[key]) ===
        realTypeOf((this.default as any)[key])
      );
    });

    if (!isValid) {
      const newConfig = { ...this.default };
      newConfig.proxyStrategy = this.recommendedStrategy();
      this.value = newConfig;
    }
  }

  private recommendedStrategy(): ProxyStrategyType {
    // TODO: implement request strategy
    if (false && browser.proxy && (browser.proxy as any).onRequest)
      return "OnRequest";

    return "FixedServers";
  }
}

export const configStorage = new ConfigStorage();
export type TConfig = typeof configStorage.default;
export type ProxyStrategyType = TConfig["proxyStrategy"];
