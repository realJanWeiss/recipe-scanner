<template>
  <div>
    <h1 class="text-3xl font-bold mb-2">
      Recipe Scanner
    </h1>
    <p class="mb-4">
      Digitalize your printed-out or hand-written recipes.
    </p>
    <drop-zone
      class="mb-8"
      @select="upload"
    />
    <recipe-list />
  </div>
</template>

<script setup lang="ts">
const upload = async (files: File[]) => {
  useNuxtApp().$recipesStore.uploadImage(files);
};
</script>
