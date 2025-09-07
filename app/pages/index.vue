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
  const formData = new FormData();
  if (files instanceof FileList) {
    for (const file of files) {
      formData.append('files', file);
    }
  }
  else {
    for (const fileHandle of files) {
      await fileHandle.getFile().then((file) => {
        formData.append('files', file);
      });
    }
  }
  await $fetch('/api/image', {
    method: 'POST',
    body: formData,
  });
};
</script>
