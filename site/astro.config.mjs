import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages as a *project* site, so the build is served from
// https://innocious.github.io/portfolio/ and every asset/link must carry
// that base path.
//
// If you later move to a custom domain or a user page (innocious.github.io),
// set `base` to '/' and `site` to the new origin.
export default defineConfig({
  site: 'https://innocious.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
});
