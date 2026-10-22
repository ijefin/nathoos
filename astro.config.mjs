// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Domínio e subpasta vêm do ambiente: GitHub Pages usa SITE_URL=https://ijefin.github.io e
  // BASE_PATH=/nathan-augusto-tattoo; num domínio próprio ou VPS basta deixar BASE_PATH vazio.
  site: process.env.SITE_URL || 'https://nathanaugusto.com.br',
  base: process.env.BASE_PATH || '/',
  compressHTML: true,
  build: { inlineStylesheets: 'always' },
  image: { layout: 'constrained' },
  vite: { plugins: [tailwindcss()] },
});
