import { defineConfig } from 'tinacms';

// TinaCMS admin panel for Brett to edit article content — see
// content-migration/feature-tinacms-setup.md for the decision record.
//
// Deliberately the STANDARD admin-panel setup, NOT TinaCMS's "visual/
// contextual editing" mode (that requires an SSR Astro output + adapter +
// wiring every page with <TinaIsland>, and is still noted as experimental
// specifically on Astro — out of scope per that doc). This is the plain
// "log into /admin, pick an article, edit a form" flow, fully compatible
// with the site staying `output: 'static'` on Cloudflare Pages.
//
// Schema mirrors src/content.config.ts's Zod schema field-for-field, so
// Tina reads/writes the exact same files without changing their structure.
// `section` isn't in the Zod schema (Astro doesn't read it — see that
// file's comment) but DOES exist in the raw frontmatter of every article
// file. It's included here anyway, read-only in spirit (label says so),
// specifically so Tina doesn't silently drop it from a file's frontmatter
// the first time Brett saves through the CMS.

const articleFields = [
  {
    type: 'string' as const,
    name: 'title',
    label: 'Title',
    isTitle: true,
    required: true,
  },
  {
    type: 'string' as const,
    name: 'section',
    label: 'Section (do not change — set by where this article lives in the site, not by this field)',
  },
  {
    type: 'number' as const,
    name: 'order',
    label: 'Order (position within its section)',
    required: true,
  },
  {
    type: 'string' as const,
    name: 'teaser',
    label: 'Teaser (short summary shown on the homepage card)',
  },
  {
    type: 'boolean' as const,
    name: 'draft',
    label: 'Draft (checked = hidden from the live site)',
  },
  {
    type: 'rich-text' as const,
    name: 'body',
    label: 'Body',
    isBody: true,
  },
];

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'duringYourStay',
        label: 'During Your Stay',
        path: 'src/content/during-your-stay',
        format: 'md',
        fields: articleFields,
      },
      {
        name: 'decisionsNextSteps',
        label: 'Decisions & Next Steps',
        path: 'src/content/decisions-next-steps',
        format: 'md',
        fields: articleFields,
      },
      {
        name: 'medicalConditions',
        label: 'Medical Conditions',
        path: 'src/content/medical-conditions',
        format: 'md',
        fields: articleFields,
      },
      {
        name: 'about',
        label: 'About',
        path: 'src/content/about',
        format: 'md',
        fields: [
          {
            type: 'string' as const,
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'number' as const,
            name: 'order',
            label: 'Order',
          },
          {
            type: 'rich-text' as const,
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
