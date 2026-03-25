export interface IProxyStrategy {
  applyConfig(): Promise<void>
  toggleTabProxying(tabId: number): Promise<void>
  isHostProxied(hostname: string): boolean
}
