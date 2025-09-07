<template>
  <div v-if="scannedRecipe">
    <template v-if="!scannedRecipe.data">
      <h1>Unprocessed recipe</h1>
      <recipe-image
        :scanned-recipe="scannedRecipe"
      />
      <process-recipe-button
        :scanned-recipe="scannedRecipe"
      />
    </template>
    <template v-else>
      <h1 class="text-3xl font-bold mb-4">
        {{ scannedRecipe.data.name }}
      </h1>
      <recipe-image
        class="max-w-80"
        :scanned-recipe="scannedRecipe"
      />
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
      <h2 class="font-bold mb-2">
        Ingredients
      </h2>
      <ul class="mb-4">
        <li
          v-for="ingredient in scannedRecipe.data.recipeIngredient"
          :key="ingredient"
        >
          {{ ingredient }}
        </li>
      </ul>
      <h2 class="font-bold mb-2">
        Preparation
      </h2>
      <ol class="list-decimal list-inside">
        <li
          v-for="(step, index) in scannedRecipe.data.recipeInstructions"
          :key="index"
        >
          {{ step }}
        </li>
      </ol>
    </template>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import type { ScannedRecipe } from '~~/shared/types/recipe';

const route = useRoute();
const recipeId = route.params.id as string;
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
