import { isImageMultiPartData, saveImageFile } from '../../utils/file-manager';

interface ImageUploadResult {
  recipeId: `${string}-${string}-${string}-${string}-${string}`;
  fileName: string;
}

export default defineEventHandler(async (event): Promise<ImageUploadResult[]> => {
  const form = await readMultipartFormData(event);
  if (!form) throw createError({ statusCode: 400, statusMessage: 'No form data' });
  const imageMultiPartData = form
    .filter(item => isImageMultiPartData(item));
  if (imageMultiPartData.length === 0) throw createError({ statusCode: 400, statusMessage: 'No image files with the correct mime type' });

  const uploads = (await Promise.all(
    imageMultiPartData
      .map(async (item) => {
        const recipeId = crypto.randomUUID();
        return { recipeId, fileName: await saveImageFile(recipeId, item) };
      }),
  ));

  return uploads.filter((upload): upload is ImageUploadResult => upload.fileName !== undefined);
});
