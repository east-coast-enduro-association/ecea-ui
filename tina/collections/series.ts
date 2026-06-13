import { validateUrl } from '../helpers';

export const seriesCollection = {
  name: 'series',
  label: 'Racing Series',
  path: 'src/content/series',
  format: 'md' as const,
  ui: {
    allowedActions: { delete: false },
  },
  fields: [
    {
      type: 'string' as const,
      name: 'name',
      label: 'Series Name',
      required: true,
      isTitle: true,
      description: 'Name of the racing series (e.g., "Enduro Series", "Hare Scramble Series")',
    },
    {
      type: 'string' as const,
      name: 'description',
      label: 'Description',
      ui: { component: 'textarea' },
      description: 'Brief overview of the series',
    },
    {
      type: 'string' as const,
      name: 'facebookGroup',
      label: 'Facebook Group URL',
      description: 'Link to the series Facebook group',
      ui: { validate: validateUrl },
    },
    {
      type: 'object' as const,
      name: 'documents',
      label: 'Documents',
      list: true,
      description: 'Official series documents (rules, entry forms, etc.)',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({ label: (item?.label as string) || 'New Document' }),
      },
      fields: [
        {
          type: 'string' as const,
          name: 'label',
          label: 'Label',
          required: true,
          description: 'Document name (e.g., "2026 Series Rules")',
        },
        {
          type: 'string' as const,
          name: 'url',
          label: 'URL',
          required: true,
          description: 'Link to the document',
          ui: { validate: validateUrl },
        },
      ],
    },
    {
      type: 'object' as const,
      name: 'faqLinks',
      label: 'FAQ Links',
      list: true,
      description: 'Helpful links for newcomers',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({ label: (item?.label as string) || 'New Link' }),
      },
      fields: [
        {
          type: 'string' as const,
          name: 'label',
          label: 'Label',
          required: true,
          description: 'Link text (e.g., "What to Bring to Your First Enduro")',
        },
        {
          type: 'string' as const,
          name: 'url',
          label: 'URL',
          required: true,
          ui: { validate: validateUrl },
        },
      ],
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
      label: 'Series Details',
      isBody: true,
      description: 'Detailed series information, rules overview, or class structure',
    },
  ],
};
