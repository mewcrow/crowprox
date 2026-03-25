import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'CrowProx',
    permissions: ['contextMenus', 'proxy', 'storage', 'activeTab', 'tabs'],
    action: {},
  },
  autoIcons: {
    developmentIndicator: false,
  },
})
