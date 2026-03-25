<script setup lang="ts">
import { Plus, Globe } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import HostItem from '@/components/HostItem.vue'

const list = defineModel<string[]>({ required: true })

const props = defineProps<{
  label: string
  action: 'bypass' | 'proxy'
}>()

const emit = defineEmits<{
  (e: 'save'): void
}>()

function addHost() {
  if (!list.value[0]) return
  list.value.unshift('')
}

function handleUpdate(index: number, newUrl: string) {
  if (list.value && index >= 0) {
    list.value.splice(index, 1, newUrl)
    emit('save')
  }
}

function handleDelete(index: number) {
  if (!confirm('Are you sure you want to delete this host?')) return

  if (list.value && index >= 0 && index < list.value.length) {
    list.value.splice(index, 1)
    emit('save')
  }
}

function handleCancel(index: number) {
  if (list.value && index >= 0 && index < list.value.length) {
    list.value.splice(index, 1)
    emit('save')
  }
}
</script>

<template>
  <div class="relative pb-6">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
        {{ label }}
      </h3>
      <Button
        size="icon"
        class="h-8 w-8 rounded-full bg-sky-600 text-white shadow-sm transition-transform hover:scale-105
          hover:bg-sky-700 active:scale-95"
        @click="addHost"
      >
        <Plus class="h-4 w-4" />
      </Button>
    </div>

    <div
      v-if="!list || list.length === 0"
      class="list-empty animate-in fade-in flex flex-col items-center justify-center rounded-xl border-2 border-dashed
        border-slate-200 py-16 text-center duration-500 dark:border-slate-800"
    >
      <div class="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-900">
        <Globe class="h-8 w-8 text-slate-400 dark:text-slate-600" />
      </div>
      <h3 class="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-200">No hosts configured</h3>
      <p class="max-w-sm text-slate-500 dark:text-slate-400">Add a host to {{ action }}.</p>
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
