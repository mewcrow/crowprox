import { emit, on } from '@/utils/eventBus'
import type { IProxyStrategy } from './proxy-strategies/IProxyStrategy'
import { configStorage } from './ConfigStorage'
import { OnRequestStrategy } from './proxy-strategies/OnRequestStrategy'
import { PacScriptStrategy } from './proxy-strategies/PacScriptStrategy'
import { FixedServersStrategy } from './proxy-strategies/FixedServersStrategy'

export class Proxy {
  private strategy?: IProxyStrategy

  public init() {
    this.initListeners()
    this.applyConfig()
  }

  public isHostProxied(hostname: string) {
    if (!configStorage.value.isEnabled) return false
    return this.strategy!.isHostProxied(hostname)
  }

  public async applyConfig() {
    if (!configStorage.value.isEnabled) {
      await browser.proxy.settings.clear({})
      return
    }

    this.setStrategy()

    this.strategy?.applyConfig()
  }

  private initListeners() {
    on('icon:clicked', async (tabId) => this.strategy!.toggleTabProxying(tabId))
    on('proxy:config-updated', () => {
      this.applyConfig()
    })
  }

  private setStrategy() {
    if (configStorage.value.proxyStrategy === 'OnRequest') {
      this.strategy = new OnRequestStrategy() as unknown as IProxyStrategy
    } else if (configStorage.value.proxyStrategy === 'PacScript') {
      this.strategy = new PacScriptStrategy() as unknown as IProxyStrategy
    } else {
      this.strategy = new FixedServersStrategy()
    }
  }
}

export const proxy = new Proxy()
