<script setup lang="ts">
import { openFilePicker } from '~/helpers/file-picker';

const emits = defineEmits<{
  select: [FileSystemFileHandle[] | FileList];
}>();

const debugOutput = ref<HTMLPreElement | null>(null);

const onClickSingle = async () => {
  const file = await openFilePicker();
  if (!file) {
    return;
  }
  emits('select', file);
  debugOutput.value!.textContent += `${file[0]!.name}\n`;
};
const onClickMultiple = async () => {
  const files = await openFilePicker(true);
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
  <button @click="onClickSingle">
    Select a file
  </button>
  <button @click="onClickMultiple">
    Select multiple files
  </button>
  <pre ref="debugOutput" />
</template>
