<template>
  <div v-if="scannedRecipe">
    <template v-if="scannedRecipe.data">
      <h1>{{ scannedRecipe.data.name }}</h1>
      <p v-if="scannedRecipe.data.cookTime">
        Cook time: {{ scannedRecipe.data.cookTime }}
      </p>
      <p v-if="scannedRecipe.data.prepTime">
        Preparation time: {{ scannedRecipe.data.prepTime }}
      </p>
      <p v-if="scannedRecipe.data.totalTime">
        Total time: {{ scannedRecipe.data.totalTime }}
      </p>
      <p v-if="scannedRecipe.data.recipeYield">
        Yield: {{ scannedRecipe.data.recipeYield }}
      </p>
      <h2>Ingredients</h2>
      <ul>
        <li
          v-for="ingredient in scannedRecipe.data.recipeIngredient"
          :key="ingredient"
        >
          {{ ingredient }}
        </li>
      </ul>
      <h2>Preparation</h2>
      <ol>
        <li
          v-for="(step, index) in scannedRecipe.data.recipeInstructions"
          :key="index"
        >
          {{ step }}
        </li>
      </ol>
    </template>
    <p v-else>
      Recipe not processed yet.
    </p>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import type { ScannedRecipe } from '~~/shared/types/recipe';

const route = useRoute();
const recipeId = Number(route.params.id);
const { $recipesStore } = useNuxtApp();
const { data: scannedRecipe } = useAsyncData<ScannedRecipe>('recipe', () => {
  return new Promise<ScannedRecipe>((resolve) => {
    const unwatch = watch($recipesStore.loading, (newValue) => {
      if (newValue) return;

      nextTick(() => unwatch());
      const foundRecipe = ($recipesStore.scannedRecipes.value.find(r => r.id === recipeId));
      if (!foundRecipe) {
        throw createError({ statusCode: 404, message: 'Recipe not found' });
      }
      resolve(foundRecipe);
    },
    { immediate: true },
    );
  });
},
{ server: false });
</script>
