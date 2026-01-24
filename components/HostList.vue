<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Plus, Globe } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

import HostItem from "@/components/HostItem.vue";
import { hostsStorage } from "@/utils/storage";

const hosts = ref<string[]>([]);

onMounted(async () => {
  hosts.value = await hostsStorage.getValue();

  hostsStorage.watch((newHosts) => {
    hosts.value = newHosts;
  });
});

async function addHostItem() {
  hosts.value.push("");
}

async function handleUpdate(index: number, newUrl: string) {
  if (index >= 0 && index < hosts.value.length) {
    hosts.value[index] = newUrl;
    await hostsStorage.setValue([...hosts.value]);
  }
}

async function handleDelete(index: number) {
  if (!confirm("Are you sure you want to delete this host?")) return;
  if (index >= 0 && index < hosts.value.length) {
    hosts.value.splice(index, 1);
    await hostsStorage.setValue([...hosts.value]);
  }
}

function handleCancel(index: number) {
  if (index >= 0 && index < hosts.value.length) {
    hosts.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="relative pb-24">
    <div
      v-if="hosts.length === 0"
      class="list-empty flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500"
    >
      <div class="bg-slate-100 dark:bg-slate-900 p-4 rounded-full mb-4">
        <Globe class="h-8 w-8 text-slate-400 dark:text-slate-600" />
      </div>
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
        No hosts configured
      </h3>
      <p class="text-slate-500 dark:text-slate-400 max-w-sm">
        Add a proxy host to get started.
      </p>
    </div>

    <div v-else class="list space-y-3">
      <HostItem
        v-for="(host, index) in hosts"
        :key="index"
        :url="host"
        :is-new="!host"
        @update="(newUrl) => handleUpdate(index, newUrl)"
        @delete="() => handleDelete(index)"
        @cancel="() => handleCancel(index)"
      />
    </div>

    <div class="add-host fixed bottom-8 right-8 z-40">
      <Button
        size="icon"
        class="h-14 w-14 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-transform hover:scale-105 active:scale-95"
        @click="addHostItem"
      >
        <Plus class="h-6 w-6" />
      </Button>
    </div>
  </div>
</template>
