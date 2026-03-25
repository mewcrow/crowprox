<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { Pencil, Trash2, Check, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
const props = defineProps<{
  url: string
  isNew?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', newUrl: string): void
  (e: 'delete'): void
  (e: 'cancel'): void
}>()

const isEditing = ref(props.isNew || false)
const editValue = ref(props.url)
const rootEl = ref<HTMLDivElement | null>(null)

function startEditing() {
  editValue.value = props.url
  isEditing.value = true
}

function save() {
  if (!editValue.value.trim()) return
  emit('update', editValue.value)
  isEditing.value = false
}

function cancel() {
  if (props.isNew) {
    emit('cancel')
  } else {
    isEditing.value = false
    editValue.value = props.url
  }
}

onMounted(() => {
  if (props.isNew) {
    nextTick(() => {
      rootEl.value?.querySelector('input')?.focus()
    })
  }
})
</script>

<template>
  <div
    ref="rootEl"
    class="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-sky-200
      hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-500/30"
  >
    <div v-if="isEditing" class="animate-in fade-in zoom-in-95 flex items-center gap-3 duration-200">
      <div class="flex-1">
        <Input
          v-model="editValue"
          class="w-full border-slate-200 bg-slate-50 focus:border-sky-500 focus:ring-sky-500/20 dark:border-slate-800
            dark:bg-slate-950 dark:text-slate-200"
          placeholder="example.com"
          @keydown.enter="save"
          @keydown.esc="cancel"
        />
      </div>
      <div class="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          @click="save"
          class="h-9 w-9 rounded-full text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
        >
          <Check class="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          @click="cancel"
          class="h-9 w-9 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800
            dark:hover:text-slate-300"
        >
          <X class="h-5 w-5" />
        </Button>
      </div>
    </div>

    <div v-else class="flex items-center justify-between">
      <div class="mr-4 flex-1 truncate font-medium text-slate-700 dark:text-slate-300">
        {{ url }}
      </div>

      <div class="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          @click="startEditing"
          class="h-9 w-9 rounded-full text-slate-400 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-900/20
            dark:hover:text-sky-400"
        >
          <Pencil class="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          @click="$emit('delete')"
          class="h-9 w-9 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20
            dark:hover:text-red-400"
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
