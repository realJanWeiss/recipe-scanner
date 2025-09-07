import { Mistral } from '@mistralai/mistralai';
import type { UploadFileOut } from '@mistralai/mistralai/models/components';

export const useMistral = () => {
  const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY || '',
  });

  async function uploadRecipe(file: File): Promise<UploadFileOut> {
    const result = await mistral.files.upload({
      file,
    });

    console.log(result);
    return result;
  }

  return {
    uploadRecipe,
  };
};
