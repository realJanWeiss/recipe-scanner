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
