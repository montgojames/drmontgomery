import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared by During Your Stay, Decisions & Next Steps, and Medical Conditions
// articles. `section` is intentionally not part of this schema — it's
// redundant with which collection an entry lives in, and would be a second
// source of truth that could drift. It's harmless to leave in the raw
// frontmatter (Zod silently ignores unrecognized keys); it's just not
// enforced or read here.
const articleSchema = z.object({
  title: z.string(),
  order: z.number(),
  draft: z.boolean().default(false),
  teaser: z.string().optional(),
});

const duringYourStay = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/during-your-stay' }),
  schema: articleSchema,
});

const decisionsNextSteps = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/decisions-next-steps' }),
  schema: articleSchema,
});

const medicalConditions = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/medical-conditions' }),
  schema: articleSchema,
});

const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  duringYourStay,
  decisionsNextSteps,
  medicalConditions,
  about,
};
