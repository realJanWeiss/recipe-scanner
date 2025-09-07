import { useRecipesDB } from './recipes-store/recipes-db';

export default defineNuxtPlugin({
  name: 'recipes-store',
  async setup() {
    const recipesDB = await useRecipesDB();
    return {
      provide: {
        recipesDB,
      },
    };
  },
});
