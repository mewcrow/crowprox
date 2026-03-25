<script setup lang="ts">
import { Plus, Globe } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import HostItem from "@/components/HostItem.vue";

const list = defineModel<string[]>({ required: true });

const props = defineProps<{
  label: string;
  action: "bypass" | "proxy";
}>();

const emit = defineEmits<{
  (e: "save"): void;
}>();

function addHost() {
  if (!list.value[0]) return;
  list.value.unshift("");
}

function handleUpdate(index: number, newUrl: string) {
  if (list.value && index >= 0) {
    list.value.splice(index, 1, newUrl);
    emit("save");
  }
}

function handleDelete(index: number) {
  if (!confirm("Are you sure you want to delete this host?")) return;

  if (list.value && index >= 0 && index < list.value.length) {
    list.value.splice(index, 1);
    emit("save");
  }
}

function handleCancel(index: number) {
  if (list.value && index >= 0 && index < list.value.length) {
    list.value.splice(index, 1);
    emit("save");
  }
}
</script>

<template>
  <div class="relative pb-6">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">
        {{ label }}
      </h3>
      <Button
        size="icon"
        class="h-8 w-8 rounded-full shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-transform hover:scale-105 active:scale-95"
        @click="addHost"
      >
        <Plus class="h-4 w-4" />
      </Button>
    </div>

    <div
      v-if="!list || list.length === 0"
      class="list-empty flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl"
    >
      <div class="bg-slate-100 dark:bg-slate-900 p-4 rounded-full mb-4">
        <Globe class="h-8 w-8 text-slate-400 dark:text-slate-600" />
      </div>
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
        No hosts configured
      </h3>
      <p class="text-slate-500 dark:text-slate-400 max-w-sm">
        Add a host to {{ action }}.
      </p>
    </div>

    <div v-else class="list space-y-3">
      <HostItem
        v-for="(host, index) in list"
        :key="host || `host-${index}`"
        :url="host"
        :is-new="!host"
        @update="(newUrl) => handleUpdate(index, newUrl)"
        @delete="() => handleDelete(index)"
        @cancel="() => handleCancel(index)"
      />
    </div>
  </div>
</template>
