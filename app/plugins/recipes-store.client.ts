import { useRecipesDB } from './recipes-store/recipes-db';

export default defineNuxtPlugin({
  name: 'recipes-store',
  async setup() {
    const recipesDB = await useRecipesDB();
    const uploadImage = async (files: File[]): Promise<void> => {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }
      const savedFiles = await $fetch('/api/recipes/image', {
        method: 'POST',
        body: formData,
      });
      for (const savedFile of savedFiles) {
        recipesDB.addRecipe({ imageFileName: savedFile });
      }
    };
    const processImage = async (scannedRecipes: ScannedRecipe) => {
      const processedImage = await $fetch('/api/recipes/process', {
        method: 'POST',
        body: { imageFileName: scannedRecipes.imageFileName },
      });
      recipesDB.updateRecipe({ ...scannedRecipes, data: processedImage });
    };
    return {
      provide: {
        recipesStore: {
          uploadImage,
          processImage,
          scannedRecipes: recipesDB.scannedRecipes,
          loading: recipesDB.loading,
          deleteRecipe: recipesDB.deleteRecipe,
        },
      },
    };
  },
});
