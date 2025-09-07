<template>
  <UCard
    as="li"
    class="max-w-md"
    :ui="{ footer: 'justify-end flex gap-2' }"
  >
    <template #header>
      <nuxt-link :to="{ name: 'recipe-id', params: { id: scannedRecipe.id } }">
        <h3 class="font-bold">{{ scannedRecipe.data?.name ?? 'Unprocessed recipe' }}</h3>
      </nuxt-link>
    </template>
    <nuxt-link :to="{ name: 'recipe-id', params: { id: scannedRecipe.id } }">
      <recipe-image :scanned-recipe="scannedRecipe" />
    </nuxt-link>
    <template #footer>
      <process-recipe-button
        v-if="!scannedRecipe.data"
        :scanned-recipe="scannedRecipe"
      />
      <UModal
        title="Delete this recipe?"
        description="This action cannot be undone. The image and the scanned data will remain on the server."
      >
        <UButton
          variant="outline"
          color="error"
          icon="i-mdi-delete"
        >
          Delete
        </UButton>
        <template #footer>
          <UButton
            color="error"
            @click="$recipesStore.deleteRecipe(scannedRecipe.id); $emit('close')"
          >
            Delete
          </UButton>
        </template>
      </UModal>
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  scannedRecipe: ScannedRecipe;
}>();
</script>
