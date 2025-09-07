<template>
  <div>
    <h2>Recipes List</h2>
    <client-only>
      <ul v-if="!$recipesStore.loading.value">
        <li
          v-for="scannedRecipe in $recipesStore.scannedRecipes.value"
          :key="scannedRecipe.id"
        >
          <nuxt-link :to="{ name: 'recipe-id', params: { id: scannedRecipe.id } }">
            <h3>{{ scannedRecipe.data?.name ?? 'Unprocessed recipe' }}</h3>
          </nuxt-link>
          <process-recipe-button
            v-if="!scannedRecipe.data"
            :scanned-recipe="scannedRecipe"
          />
          <button @click="$recipesStore.deleteRecipe(scannedRecipe.id)">
            delete
          </button>
        </li>
      </ul>
    </client-only>
  </div>
</template>
