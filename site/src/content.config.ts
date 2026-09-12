import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One case study per past project. Markdown lives in src/data/projects/*.md;
// the filename becomes the URL slug.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    timeframe: z.string(),
    stack: z.array(z.string()),
    // When the backend is online the live demo is offered; otherwise the site
    // gracefully falls back to the recorded walkthrough.
    demoUrl: z.string().url().optional(),
    walkthroughUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { projects };
