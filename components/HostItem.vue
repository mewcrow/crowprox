<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { Pencil, Trash2, Check, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const props = defineProps<{
  url: string;
  isNew?: boolean;
}>();

const emit = defineEmits<{
  (e: "update", newUrl: string): void;
  (e: "delete"): void;
  (e: "cancel"): void;
}>();

const isEditing = ref(props.isNew || false);
const editValue = ref(props.url);
const containerRef = ref<HTMLDivElement | null>(null);

function startEditing() {
  editValue.value = props.url;
  isEditing.value = true;
}

function save() {
  if (!editValue.value.trim()) return;
  emit("update", editValue.value);
  isEditing.value = false;
}

function cancel() {
  if (props.isNew) {
    emit("cancel");
  } else {
    isEditing.value = false;
    editValue.value = props.url;
  }
}

onMounted(() => {
  if (props.isNew) {
    nextTick(() => {
      containerRef.value?.querySelector("input")?.focus();
    });
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 group"
  >
    <div
      v-if="isEditing"
      class="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200"
    >
      <div class="flex-1">
        <Input
          v-model="editValue"
          class="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
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
          class="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
        >
          <Check class="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          @click="cancel"
          class="h-9 w-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
        >
          <X class="h-5 w-5" />
        </Button>
      </div>
    </div>

    <div v-else class="flex items-center justify-between">
      <div
        class="flex-1 font-medium text-slate-700 dark:text-slate-300 truncate mr-4"
      >
        {{ url }}
      </div>

      <div
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Button
          size="icon"
          variant="ghost"
          @click="startEditing"
          class="h-9 w-9 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
        >
          <Pencil class="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          @click="$emit('delete')"
          class="h-9 w-9 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
        >
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
