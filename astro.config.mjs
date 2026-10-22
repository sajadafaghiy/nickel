import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import { remarkObsidianLinks } from './src/plugins/remarkObsidianLinks.mjs';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://username.github.io',
  base,
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkObsidianLinks, { collection: 'books', base }]],
    }),
  },
  output: 'static',
  trailingSlash: 'always',
});
