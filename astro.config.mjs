// @ts-check
import {defineConfig, envField} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: false
    },
    edgeMiddleware: false,
  }),
  env: {
    schema: {
      API_URL: envField.string({context: "client", access: "public", })
    }
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@nanostores/react', 'nanostores']
    }
  },
});
