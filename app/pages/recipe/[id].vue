<template>
  <div v-if="recipe">
    <h1>{{ recipe.name }}</h1>
    <p v-if="recipe.cookTime">
      Cook time: {{ recipe.cookTime }}
    </p>
    <p v-if="recipe.prepTime">
      Preparation time: {{ recipe.prepTime }}
    </p>
    <p v-if="recipe.totalTime">
      Total time: {{ recipe.totalTime }}
    </p>
    <p v-if="recipe.recipeYield">
      Yield: {{ recipe.recipeYield }}
    </p>
    <h2>Ingredients</h2>
    <ul>
      <li
        v-for="ingredient in recipe.recipeIngredient"
        :key="ingredient"
      >
        {{ ingredient }}
      </li>
    </ul>
    <h2>Preparation</h2>
    <ol>
      <li
        v-for="(step, index) in recipe.recipeInstructions"
        :key="index"
      >
        {{ step }}
      </li>
    </ol>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import type { StoredRecipe } from '~/types/recipe';

const route = useRoute();
const recipeId = Number(route.params.id);
const { $recipesDB } = useNuxtApp();
const { data: recipe } = useAsyncData<StoredRecipe>('recipe', () => {
  return new Promise<StoredRecipe>((resolve) => {
    const unwatch = watch($recipesDB.loading, (newValue) => {
      if (newValue) return;

      nextTick(() => unwatch());
      const foundRecipe = ($recipesDB.storedRecipes.value.find(r => r.id === recipeId));
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
