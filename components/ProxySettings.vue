<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { configStorage } from "@/core/ConfigStorage";

const config = configStorage.ref;
</script>

<template>
  <div
    :class="[
      'space-y-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800',
      'shadow-sm mb-6',
    ]"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Global Settings
      </h2>
      <div class="flex items-center gap-2">
        <div
          class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
        >
          {{ config.proxyStrategy }} mode
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-slate-700 dark:text-slate-300"
        >Strategy</label
      >
      <select
        v-model="config.proxyStrategy"
        :class="[
          'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2',
          'focus:ring-indigo-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50 transition-colors',
        ]"
      >
        <option value="FixedServers">
          Fixed Servers (Proxy All except ...)
        </option>
        <option value="OnRequest">Firefox/Request (Proxy Only ...)</option>
      </select>
      <p class="text-xs text-slate-500">
        {{
          config.proxyStrategy === "FixedServers"
            ? "Proxy ALL traffic except hosts in the list below (Bypass List)."
            : "Proxy ONLY hosts in the list below (Allowlist)."
        }}
      </p>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Scheme</label
        >
        <select
          v-model="config.proxyServer.protocol"
          :class="[
            'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2',
            'focus:ring-indigo-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-50 transition-colors',
          ]"
        >
          <option value="http">http</option>
          <option value="https">https</option>
          <option value="socks4">socks4</option>
          <option value="socks5">socks5</option>
          <option value="quic">quic</option>
        </select>
      </div>
      <div class="col-span-2 space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Proxy Host</label
        >
        <Input v-model="config.proxyServer.host" placeholder="127.0.0.1" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300"
          >Port</label
        >
        <Input
          v-model.number="config.proxyServer.port"
          type="number"
          placeholder="12334"
        />
      </div>
    </div>
  </div>
</template>
