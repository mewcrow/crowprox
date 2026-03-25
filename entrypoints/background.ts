export default defineBackground(() => {
  import('@/core').then(async (modules: any) => {
    const moduleKeys = ['configStorage', 'proxy', 'contextMenu', 'icon', 'iconIndicator']
    for (const key of moduleKeys) {
      const module = modules[key]
      if (module && typeof module.init === 'function') {
        await module.init()
      } else {
        console.error(`Module ${key} not found or has no init function`)
      }
    }
  })
})
