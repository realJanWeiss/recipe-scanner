<template>
  <div>
    <h1 class="text-3xl font-bold mb-2">
      Recipe Scanner
    </h1>
    <p class="mb-4">
      Digitalize your printed-out or hand-written recipes.
    </p>
    <drop-zone
      ref="dropZoneRef"
      class="mb-8"
      @select="upload"
    />
    <recipe-list />
  </div>
</template>

<script setup lang="ts">
import type DropZone from '../components/drop-zone.vue';

const dropZoneRef = ref<InstanceType<typeof DropZone> | null>(null);
const upload = async (files: File[]) => {
  const { $recipesStore } = useNuxtApp();
  const scannedImages = await $recipesStore.uploadImage(files);
  dropZoneRef.value?.clear();
  for (const scannedImage of scannedImages) {
    $recipesStore.processImage(scannedImage);
  }
};
</script>
