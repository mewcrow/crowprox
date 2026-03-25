import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUrlHost(url: string) {
  try {
    return new URL(url).hostname
  } catch (error) {
    return false
  }
}

export function getTabHost(tab: Browser.tabs.Tab) {
  if (!tab.url) return false
  return getUrlHost(tab.url)
}

export function realTypeOf(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
