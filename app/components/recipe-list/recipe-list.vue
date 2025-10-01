<template>
  <client-only>
    <div v-if="$recipesStore.scannedRecipes.value.length > 0">
      <h2 class="text-2xl font-bold mb-4">
        Recipes List
      </h2>
      <UPageGrid
        as="ul"
        class="items-start"
      >
        <recipe-list-item
          v-for="scannedRecipe in $recipesStore.scannedRecipes.value"
          :key="scannedRecipe.id"
          :scanned-recipe="scannedRecipe"
        />
      </UPageGrid>
    </div>
  </client-only>
</template>
