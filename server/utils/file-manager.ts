import type { MultiPartData } from 'h3';

enum MimeType {
  Jpeg = 'image/jpeg',
}

const extensionMap: Record<MimeType, string> = {
  [MimeType.Jpeg]: '.jpg',
};

type SupportedMimeType = keyof typeof extensionMap;
type ImageMultiPartData = MultiPartData & { type: MimeType };

const isSupportedMimeType = (type: string): type is SupportedMimeType =>
  type in extensionMap;

export const isImageMultiPartData = (data: MultiPartData): data is ImageMultiPartData =>
  data.type !== undefined && isSupportedMimeType(data.type);

export const saveImageFile = async (file: ImageMultiPartData): Promise<string | undefined> => {
  const extension = extensionMap[file.type];
  const fileName = `${crypto.randomUUID()}-${extension}`;
  const storage = useStorage('uploads');
  await storage.setItemRaw(fileName, file.data);
  return fileName;
};

export const saveRecipeData = async (id: string, recipe: Recipe): Promise<string> => {
  const textFileName = id + '.json';
  const storage = useStorage('uploads');
  await storage.setItem(textFileName, JSON.stringify(recipe));
  return textFileName;
};

export const getRecipeData = async (fileName: string): Promise<Recipe | null> => {
  const data = await useStorage('uploads').getItem<string>(fileName);
  if (!data) return null;
  try {
    return JSON.parse(data) as Recipe;
  }
  catch {
    return null;
  }
};

export const hasFile = async (fileName: string): Promise<boolean> => {
  return useStorage('uploads').hasItem(fileName);
};
