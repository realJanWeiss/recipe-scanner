import type { ScannedRecipe } from '~~/shared/types/recipe';

export const useRecipesDB = async () => {
  const scannedRecipes = ref<ScannedRecipe[]>([]);
  const loading = ref(true);
  let db: IDBDatabase | null = null;

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const request = window.indexedDB.open('RecipesDatabase', 1);
      request.onupgradeneeded = () => {
        const dbInstance = request.result;
        if (!dbInstance.objectStoreNames.contains('Recipe')) {
          dbInstance.createObjectStore('Recipe', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const dbMutation = async <T>(fn: (store: IDBObjectStore) => Promise<T>): Promise<T> => {
    const dbInstance = await openDB();
    const tx = dbInstance.transaction('Recipe', 'readwrite');
    const store = tx.objectStore('Recipe');
    return fn(store).then(async (result) => {
      scannedRecipes.value = await getAllRecipes();
      return result;
    });
  };

  const addRecipe = async (scannedRecipe: ScannedRecipe): Promise<ScannedRecipe> => {
    return dbMutation((store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(scannedRecipe);
        request.onsuccess = () => {
          resolve(scannedRecipe);
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  };

  const updateRecipe = async (scannedRecipe: ScannedRecipe): Promise<void> => {
    return dbMutation((store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(scannedRecipe);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  const deleteRecipe = async (id: string): Promise<void> => {
    return dbMutation((store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  const getAllRecipes = async (): Promise<ScannedRecipe[]> => {
    const dbInstance = await openDB();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction('Recipe', 'readonly');
      const store = tx.objectStore('Recipe');
      const request = store.getAll();
      request.onsuccess = (ev) => {
        resolve((ev.target as IDBRequest).result as ScannedRecipe[]);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const _getRecipeById = async (id: number): Promise<ScannedRecipe | undefined> => {
    const dbInstance = await openDB();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction('Recipe', 'readonly');
      const store = tx.objectStore('Recipe');
      const request = store.get(id);
      request.onsuccess = (ev) => {
        resolve((ev.target as IDBRequest).result as ScannedRecipe | undefined);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  await openDB();
  scannedRecipes.value = await getAllRecipes();
  loading.value = false;

  return {
    loading,
    scannedRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
