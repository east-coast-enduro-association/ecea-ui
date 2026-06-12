import { validateUrl } from '../helpers';

/**
 * Singleton collection for the Get Started page.
 * Points to src/content/pages/get-started/ (contains a single index.md).
 * Only shows fields relevant to this page — editors won't see FAQ fields here.
 */
export const getStartedPageCollection = {
  name: 'getStartedPage',
  label: 'Page: Get Started',
  path: 'src/content/getStartedPage',
  format: 'md' as const,
  ui: {
    allowedActions: { create: false, delete: false },
  },
  fields: [
    {
      type: 'string' as const,
      name: 'title',
      label: 'Page Title',
      required: true,
      isTitle: true,
      description: 'Main heading shown on the page',
    },
    {
      type: 'string' as const,
      name: 'subtitle',
      label: 'Subtitle',
      description: 'Secondary text below the title (optional)',
    },
    {
      type: 'string' as const,
      name: 'description',
      label: 'SEO Description',
      ui: { component: 'textarea' },
      description: 'Description shown in search results (150-160 characters ideal)',
    },
    {
      type: 'boolean' as const,
      name: 'draft',
      label: 'Draft',
      description: 'Check to hide from the public site',
    },
    // Welcome Section
    {
      type: 'string' as const,
      name: 'welcomeTitle',
      label: 'Welcome Title',
      description: 'Header for the welcome section',
    },
    {
      type: 'string' as const,
      name: 'welcomeContent',
      label: 'Welcome Content',
      ui: { component: 'textarea' },
      description: 'Welcome message text',
    },
    {
      type: 'string' as const,
      name: 'welcomeBookUrl',
      label: 'Welcome Book URL',
      description: 'Link to newcomer guide PDF',
      ui: { validate: validateUrl },
    },
    {
      type: 'string' as const,
      name: 'amaUrl',
      label: 'AMA URL',
      description: 'Link to AMA membership page',
      ui: { validate: validateUrl },
    },
    // Series Section
    {
      type: 'string' as const,
      name: 'seriesTitle',
      label: 'Series Section Title',
      description: 'Header for the series overview',
    },
    {
      type: 'string' as const,
      name: 'seriesDescription',
      label: 'Series Section Description',
      ui: { component: 'textarea' },
    },
    // Steps Section
    {
      type: 'string' as const,
      name: 'stepsTitle',
      label: 'Steps Section Title',
      description: 'Header for the steps section',
    },
    {
      type: 'object' as const,
      name: 'steps',
      label: 'Steps',
      list: true,
      description: 'Step-by-step guide for newcomers',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({ label: (item?.title as string) || 'New Step' }),
      },
      fields: [
        {
          type: 'string' as const,
          name: 'title',
          label: 'Step Title',
          required: true,
          description: 'e.g., "Step 1: Get an AMA Card"',
        },
        {
          type: 'string' as const,
          name: 'description',
          label: 'Step Description',
          required: true,
          ui: { component: 'textarea' },
        },
      ],
    },
    // FAQ Teaser Section
    {
      type: 'string' as const,
      name: 'faqTitle',
      label: 'FAQ Teaser Title',
      description: 'Header for the FAQ call-to-action at the bottom of this page',
    },
    {
      type: 'string' as const,
      name: 'faqDescription',
      label: 'FAQ Teaser Description',
      ui: { component: 'textarea' },
    },
  ],
};
