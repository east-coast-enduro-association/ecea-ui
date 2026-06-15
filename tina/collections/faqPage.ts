/**
 * Singleton collection for the FAQ page.
 * Points to src/content/pages/faq/ (contains a single index.md).
 * Only shows fields relevant to this page — editors won't see Get Started fields here.
 */
export const faqPageCollection = {
  name: 'faqPage',
  label: 'Page: FAQ',
  path: 'src/content/faqPage',
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
    {
      type: 'rich-text' as const,
      name: 'body',
      label: 'FAQ Content',
      isBody: true,
      description: 'All FAQ questions and answers. Use ## for section headings, #### for individual questions.',
    },
  ],
};
