<template>
  <div
    ref="dropZoneRef"
    :style="{ border: isOverDropZone ? '2px solid green' : '2px solid gray', height: '200px' }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  select: [File[]];
}>();

const dropZoneRef = ref<HTMLDivElement>();

function onDrop(files: File[] | null) {
  if (!Array.isArray(files) || !files.length) return;
  emits('select', files);
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['image/jpeg'],
  multiple: true,
  preventDefaultForUnhandled: false,
});
</script>
