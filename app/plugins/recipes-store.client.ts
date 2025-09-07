import { useRecipesDB } from './recipes-store/recipes-db';

export default defineNuxtPlugin({
  name: 'recipes-store',
  async setup() {
    const recipesDB = await useRecipesDB();

    const pendingProcessings = reactive<Map<string, Promise<ScannedRecipe>>>(new Map());

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
        recipesDB.addRecipe({ id: savedFile.recipeId, imageFileName: savedFile.fileName });
      }
    };
    const processImage = async (scannedRecipe: ScannedRecipe): Promise<ScannedRecipe> => {
      const foundPendingProcessing = pendingProcessings.get(scannedRecipe.id);
      if (foundPendingProcessing) {
        return await foundPendingProcessing;
      }
      const processing = $fetch('/api/recipes/process', {
        method: 'POST',
        body: { recipeId: scannedRecipe.id, imageFileName: scannedRecipe.imageFileName },
      }).then((processedImage) => {
        const newScannedRecipe = { ...scannedRecipe, data: processedImage };
        recipesDB.updateRecipe(newScannedRecipe);
        return newScannedRecipe;
      });
      pendingProcessings.set(scannedRecipe.id, processing);
      const result = await processing.finally(() => {
        pendingProcessings.delete(scannedRecipe.id);
      });
      return result;
    };
    return {
      provide: {
        recipesStore: {
          uploadImage,
          processImage,
          pendingProcessings,
          scannedRecipes: recipesDB.scannedRecipes,
          loading: recipesDB.loading,
          deleteRecipe: recipesDB.deleteRecipe,
        },
      },
    };
  },
});
