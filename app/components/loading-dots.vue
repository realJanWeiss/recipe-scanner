<template>
  <span>{{ text }}{{ '.'.repeat(dots) }}</span>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();

const dots = ref(0);
onMounted(() => {
  setInterval(() => {
    dots.value = (dots.value + 1) % 4;
  }, 500);
});
</script>
