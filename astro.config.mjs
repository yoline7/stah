import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://im-stah.ch',
  integrations: [
    sitemap({ filter: (page) => !/\/(anmeldung|agb|teilnahmebedingungen|impressum|datenschutz)\/?$/.test(page) })
  ],
  build: { format: 'directory' }
});
