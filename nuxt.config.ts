// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@vueuse/nuxt'],
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  nitro: {
    storage: {
      uploads: {
        driver: 'fs',
        base: './public/uploads',
      },
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['@types/wicg-file-system-access'],
      },
    },
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
});
