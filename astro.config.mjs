// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ecea.org',
  trailingSlash: 'ignore',
  integrations: [tailwind(), sitemap(), react()],
  vite: {
    plugins: [
      {
        name: 'admin-redirect',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/admin' || req.url === '/admin/') {
              res.writeHead(302, { Location: '/admin/index.html' });
              res.end();
              return;
            }
            next();
          });
        },
      },
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  }
});
