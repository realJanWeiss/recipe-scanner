export interface Recipe {
  name: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeIngredient: string[];
  recipeInstructions: string[];
}

export interface StoredRecipe extends Recipe {
  id: number;
}
