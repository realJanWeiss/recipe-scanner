<template>
  <div class="relative">
    <img
      :src="`/uploads/${scannedRecipe.imageFileName}`"
      alt="Recipe Image"
      class="w-full"
    >
    <UProgress
      v-if="$recipesStore.pendingProcessings.has(scannedRecipe.id) "
      class="absolute top-0 bottom-0"
      animation="swing"
      :ui="{ base: 'h-full bg-transparent rounded-none', indicator: 'rounded-none bg-gradient-to-r from-white/1 via-white/60 to-white/1' }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scannedRecipe: ScannedRecipe;
}>();
</script>
