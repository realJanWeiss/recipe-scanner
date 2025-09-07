<template>
  <button
    v-if="!$recipesStore.pendingProcessings.has(scannedRecipe.id)"
    @click="$recipesStore.processImage(scannedRecipe)"
  >
    process
  </button>
  <loading-dots
    v-else
    text="Processing"
  />
</template>

<script setup lang="ts">
defineProps<{
  scannedRecipe: ScannedRecipe;
}>();
</script>
