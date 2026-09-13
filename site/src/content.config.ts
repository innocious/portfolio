import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One case study per project. Markdown lives in src/data/projects/*.md; the
// filename becomes the URL slug.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    timeframe: z.string(),
    stack: z.array(z.string()),
    // First category is primary (used for grouping); rest are secondary tags.
    categories: z.array(z.string()).default([]),
    // Punchy wins, reused on the card and in the category PDF export.
    highlights: z.array(z.string()).default([]),
    // Downloads / external references. Relative paths are resolved against the
    // site base; absolute http(s) URLs are used as-is.
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    course: z.string().optional(),
    demoUrl: z.string().url().optional(),
    walkthroughUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    articleUrl: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { projects };
