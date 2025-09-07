import { isImageMultiPartData, saveImageFile } from '../../utils/file-manager';

export default defineEventHandler(async (event): Promise<string[]> => {
  const form = await readMultipartFormData(event);
  if (!form) throw createError({ statusCode: 400, statusMessage: 'No form data' });
  const imageMultiPartData = form
    .filter(item => isImageMultiPartData(item));
  if (imageMultiPartData.length === 0) throw createError({ statusCode: 400, statusMessage: 'No image files with the correct mime type' });

  return (await Promise.all(
    imageMultiPartData
      .map(async item => saveImageFile(item)),
  )).filter(fileName => fileName !== undefined);
});
