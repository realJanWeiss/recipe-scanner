<script setup lang="ts">
import { openFilePicker } from '~/helpers/file-picker';

const emits = defineEmits<{
  select: [FileSystemFileHandle[] | FileList];
}>();

const debugOutput = ref<HTMLPreElement | null>(null);

const onClick = async () => {
  const files = await openFilePicker();
  if (!files) {
    return;
  }
  emits('select', files);
  for (const file of files) {
    debugOutput.value!.textContent += `${file.name}\n`;
  }
};
</script>

<template>
  <button @click="onClick">
    Select multiple files
  </button>
  <pre ref="debugOutput" />
</template>
