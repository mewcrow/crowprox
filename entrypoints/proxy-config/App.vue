<script setup lang="ts">
import { computed } from "vue";
import HostList from "@/components/HostList.vue";
import ProxySettings from "@/components/ProxySettings.vue";
import { configStorage } from "@/core/ConfigStorage";

const config = configStorage.ref;

const activeList = computed(() => {
  if (config.value.proxyStrategy === "FixedServers") {
    return config.value.bypassedHosts;
  }
  return config.value.proxiedHosts;
});

const listLabel = computed(() => {
  if (config.value.proxyStrategy === "FixedServers") {
    return "Bypassed Hosts";
  }
  return "Proxied Hosts";
});

const listAction = computed(() => {
  if (config.value.proxyStrategy === "FixedServers") {
    return "bypass";
  }
  return "proxy";
});

function saveConfig() {
  configStorage.value = toRaw(config.value);
}
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-700 dark:selection:text-indigo-300"
  >
    <div
      class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm"
    >
      <div class="container max-w-3xl flex items-center h-16 px-4 sm:px-6">
        <h1
          class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
        >
          Proxy config
        </h1>
      </div>
    </div>

    <main class="container max-w-3xl py-24 px-4 sm:px-6">
      <Suspense>
        <template #default>
          <div>
            <ProxySettings />
            <HostList
              v-model="activeList"
              :label="listLabel"
              :action="listAction"
              @save="saveConfig"
            />
          </div>
        </template>
        <template #fallback>
          <div class="flex items-center justify-center py-12">
            Loading configuration...
          </div>
        </template>
      </Suspense>
    </main>
  </div>
</template>
