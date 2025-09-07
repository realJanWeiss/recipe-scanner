import path from 'path';
import { z } from 'zod';
import { getRecipeData, hasFile, saveRecipeData } from '~~/server/utils/file-manager';
import { LMStudioClient } from '@lmstudio/sdk';
import type { Recipe } from '~~/shared/types/recipe';

const userSchema = z.object({
  recipeId: z.string(),
  imageFileName: z.string(),
});

const prompt = `You are a helpful assistant that extracts and formats recipe information from images into JSON format. Respond ONLY with the JSON - no other text, no markdown (don't start start your response with "\`\`\`json")!
The JSON should include the following fields:
- name: The name of the recipe.
- recipeIngredient: A list of ingredients required for the recipe.
- recipeInstructions: A list of the preparation steps.
- prepTime: Preparation time in minutes.
- cookTime: Cooking time in minutes.
- totalTime: Total time in minutes (prepTime + cookTime).
- recipeYield: Number of servings the recipe yields.
If any of this information is not available in the image, use null for that field.`;

export default defineEventHandler(async (event): Promise<Recipe> => {
  const result = await readValidatedBody(event, body => userSchema.safeParse(body));
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
  }

  const storedRecipe = await getRecipeData(result.data.recipeId);
  if (storedRecipe) return storedRecipe;

  const fileExists = await hasFile(result.data.imageFileName);
  if (!fileExists) throw createError({ statusCode: 404, statusMessage: 'Image not found' });

  const client = new LMStudioClient();

  const model = await client.llm.model();
  const filePath = path.resolve('./public/uploads', result.data.imageFileName);
  const image = await client.files.prepareImage(filePath);
  const response = await model.respond([
    { role: 'user', content: prompt, images: [image] },
  ]);

  const parsedResponse = parseResponse(response.content);
  if (!parsedResponse) throw createError({ statusCode: 500, statusMessage: 'Failed to scan recipe. Sorry!' });

  saveRecipeData(result.data.imageFileName, parsedResponse);
  return parsedResponse;
});

const parseResponse = (response: string): Recipe | undefined => {
  let parsedJson: Record<string, unknown>;
  try {
    parsedJson = JSON.parse(response);
  }
  catch (e) {
    return;
  }
  if (!isRecord(parsedJson)) return;
  const recipe: Recipe = {
    name: typeof parsedJson.name === 'string' ? parsedJson.name : 'Not detected',
    prepTime: typeof parsedJson.prepTime === 'string' ? parsedJson.prepTime : undefined,
    cookTime: typeof parsedJson.cookTime === 'string' ? parsedJson.cookTime : undefined,
    totalTime: typeof parsedJson.totalTime === 'string' ? parsedJson.totalTime : undefined,
    recipeYield: typeof parsedJson.recipeYield === 'string' ? parsedJson.recipeYield : undefined,
    recipeIngredient: Array.isArray(parsedJson.recipeIngredient) ? parsedJson.recipeIngredient.filter((item: unknown) => typeof item === 'string') : [],
    recipeInstructions: Array.isArray(parsedJson.recipeInstructions) ? parsedJson.recipeInstructions.filter((item: unknown) => typeof item === 'string') : [],
  };
  return recipe;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object'
  && value !== null
  && !Array.isArray(value);
