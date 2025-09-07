<template>
  <div>
    <h2>Recipes List</h2>
    <ul v-if="!$recipesDB.loading.value">
      <li
        v-for="recipe in $recipesDB.storedRecipes.value"
        :key="recipe.id"
      >
        <nuxt-link :to="{ name: 'recipe-id', params: { id: recipe.id } }">
          <h3>{{ recipe.name }}</h3>
        </nuxt-link>
        <button @click="$recipesDB.deleteRecipe(recipe.id)">
          delete
        </button>
      </li>
    </ul>
  </div>
</template>
