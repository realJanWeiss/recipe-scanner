<template>
  <UButton
    v-if="!$recipesStore.pendingProcessings.has(scannedRecipe.id)"
    icon="i-mdi-cog"
    @click="$recipesStore.processImage(scannedRecipe)"
  >
    process
  </UButton>
</template>

<script setup lang="ts">
defineProps<{
  scannedRecipe: ScannedRecipe;
}>();
</script>
