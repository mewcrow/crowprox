<script setup lang="ts">
import { computed } from 'vue'
import HostList from '@/components/HostList.vue'
import ProxySettings from '@/components/ProxySettings.vue'
import { configStorage } from '@/core/ConfigStorage'

const config = configStorage.ref

const activeList = computed(() => {
  if (config.value.proxyStrategy === 'FixedServers') {
    return config.value.bypassedHosts
  }
  return config.value.proxiedHosts
})

const listLabel = computed(() => {
  if (config.value.proxyStrategy === 'FixedServers') {
    return 'Bypassed Hosts'
  }
  return 'Proxied Hosts'
})

const listAction = computed(() => {
  if (config.value.proxyStrategy === 'FixedServers') {
    return 'bypass'
  }
  return 'proxy'
})

function saveConfig() {
  configStorage.value = toRaw(config.value)
}
</script>

<template>
  <div
    :class="[
      `min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-700 dark:bg-slate-950
      dark:text-slate-50 dark:selection:bg-sky-900 dark:selection:text-sky-300`,
    ]"
  >
    <div
      class="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md
        dark:border-slate-800/60 dark:bg-slate-900/80"
    >
      <div class="container flex h-16 max-w-3xl items-center px-4 sm:px-6">
        <h1 class="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <span class="inline-block h-2 w-2 rounded-full bg-sky-500"></span>
          CrowProx
        </h1>
      </div>
    </div>

    <main class="container max-w-3xl px-4 py-24 sm:px-6">
      <Suspense>
        <template #default>
          <div>
            <ProxySettings />
            <HostList v-model="activeList" :label="listLabel" :action="listAction" @save="saveConfig" />
          </div>
        </template>
        <template #fallback>
          <div class="flex items-center justify-center py-12">Loading configuration...</div>
        </template>
      </Suspense>
    </main>
  </div>
</template>
