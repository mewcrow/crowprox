<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Plus, Globe } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import HostItem from "@/components/HostItem.vue";
import { hostsStorage, type Host } from "@/utils/storage";

const hosts = ref<Host[]>([]);

onMounted(async () => {
  hosts.value = await hostsStorage.getValue();

  hostsStorage.watch((newHosts) => {
    hosts.value = newHosts;
  });
});

async function updateHost(updatedHost: Host) {
  const index = hosts.value.findIndex((h) => h.id === updatedHost.id);
  if (index !== -1) {
    hosts.value[index] = updatedHost;
    await hostsStorage.setValue([...hosts.value]);
  }
}

async function addHostItem() {
  const newHost: Host = {
    id: crypto.randomUUID(),
    name: "",
    url: "",
  };
  hosts.value.push(newHost);
}

async function handleUpdate(updatedHost: Host) {
  const index = hosts.value.findIndex((h) => h.id === updatedHost.id);
  if (index !== -1) {
    hosts.value[index] = updatedHost;
    await hostsStorage.setValue([...hosts.value]);
  }
}

async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this host?")) return;
  hosts.value = hosts.value.filter((h) => h.id !== id);
  await hostsStorage.setValue([...hosts.value]);
}

function handleCancel(id: string) {
  hosts.value = hosts.value.filter((h) => h.id !== id);
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
        v-for="host in hosts"
        :key="host.id"
        :host="host"
        :is-new="!host.url && !host.name"
        @update="handleUpdate"
        @delete="handleDelete"
        @cancel="handleCancel"
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
