# site

Static portfolio front end (Astro), deployed to GitHub Pages. Always-on and
decoupled from the intermittent cloud backend.

## Develop

```bash
cd site
npm install
npm run dev      # http://localhost:4321/Portfolio-Site
npm run build    # outputs to site/dist
npm run preview
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/pages/index.astro` | Portfolio home + project grid |
| `src/pages/status.astro` | Public status page (renders `status.json`) |
| `src/pages/projects/[...slug].astro` | Case-study pages from the content collection |
| `src/data/projects/*.md` | One markdown file per case study (the template) |
| `src/data/status.json` | Backend/service status; refreshed by the status cron |
| `src/components/DemoLink.astro` | Swaps live demo ↔ recorded walkthrough by status |
| `src/content.config.ts` | Typed schema for case studies |

## Adding a case study

Drop a markdown file in `src/data/projects/`. The filename is the URL slug; the
frontmatter must satisfy the schema in `src/content.config.ts` (`title`,
`summary`, `role`, `timeframe`, `stack`, optional `demoUrl` / `walkthroughUrl` /
`repoUrl`, `order`).

## Deployment

`.github/workflows/deploy-site.yml` builds and publishes to GitHub Pages on any
push to `main` touching `site/**`. Enable Pages once under **Settings → Pages →
Build and deployment → Source: GitHub Actions**.

## Base path

Configured as a project site (`base: '/Portfolio-Site'` in `astro.config.mjs`).
For a custom domain or a user page, set `base` to `/` and `site` to the domain.
Always build internal links with the `withBase()` helper so they survive either
setting.
