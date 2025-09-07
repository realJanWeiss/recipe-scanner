import type { Recipe, StoredRecipe } from '~/types/recipe';

export const useRecipesDB = async () => {
  const recipes = ref<StoredRecipe[]>([]);
  const loading = ref(true);
  let db: IDBDatabase | null = null;

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const request = window.indexedDB.open('RecipesDatabase', 1);
      request.onupgradeneeded = () => {
        const dbInstance = request.result;
        if (!dbInstance.objectStoreNames.contains('Recipe')) {
          dbInstance.createObjectStore('Recipe', { keyPath: 'id', autoIncrement: true });
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
      recipes.value = await getAllRecipes();
      return result;
    });
  };

  const addRecipe = async (recipe: Recipe): Promise<StoredRecipe> => {
    return dbMutation((store) => {
      return new Promise((resolve, reject) => {
        const request = store.add(recipe);
        request.onsuccess = (ev) => {
          const id = (ev.target as IDBRequest).result as number;
          resolve({ ...recipe, id });
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  };

  const updateRecipe = async (recipe: Recipe): Promise<void> => {
    return dbMutation((store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(recipe);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  const deleteRecipe = async (id: number): Promise<void> => {
    return dbMutation((store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  };

  const getAllRecipes = async (): Promise<StoredRecipe[]> => {
    const dbInstance = await openDB();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction('Recipe', 'readonly');
      const store = tx.objectStore('Recipe');
      const request = store.getAll();
      request.onsuccess = (ev) => {
        resolve((ev.target as IDBRequest).result as StoredRecipe[]);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const _getRecipeById = async (id: number): Promise<StoredRecipe | undefined> => {
    const dbInstance = await openDB();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction('Recipe', 'readonly');
      const store = tx.objectStore('Recipe');
      const request = store.get(id);
      request.onsuccess = (ev) => {
        resolve((ev.target as IDBRequest).result as StoredRecipe | undefined);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  await openDB();
  recipes.value = await getAllRecipes();
  loading.value = false;

  return {
    loading,
    storedRecipes: recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
