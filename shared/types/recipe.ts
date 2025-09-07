export interface Recipe {
  name: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeIngredient: string[];
  recipeInstructions: string[];
}

export interface ScannedRecipe {
  id: string;
  imageFileName: string;
  data?: Recipe;
}
