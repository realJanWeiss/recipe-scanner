<template>
  <div>
    <UFileUpload
      v-model="value"
      class="w-full min-h-48"
      multiple
      accept="image/jpeg"
      label="Drag & drop images here, or click to select"
    />
    <UButton
      v-if="value"
      class="mt-4"
      color="primary"
      @click="$emit('select', value)"
    >
      Upload
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  select: [File[]];
}>();

const value = ref<null | File[]>(null);
</script>
