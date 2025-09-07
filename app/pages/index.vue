<template>
  <div>
    <h1>Recipe Scanner</h1>
    <FilePicker @select="upload" />
    <DropZone />
    <RecipesList />
  </div>
</template>

<script setup lang="ts">
const upload = async (files: FileSystemFileHandle[] | FileList) => {
  const filesToUpload: File[] = files instanceof FileList
    ? Array.from(files)
    : await Promise.all(files.map(fileHandle => fileHandle.getFile()));

  useNuxtApp().$recipesStore.uploadImage(filesToUpload);
};
</script>
