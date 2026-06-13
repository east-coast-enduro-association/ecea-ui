import { imageUi, validateUrl } from '../helpers';

export const sponsorsCollection = {
  name: 'sponsors',
  label: 'Sponsors',
  path: 'src/content/sponsors',
  format: 'md' as const,
  ui: { allowedActions: { delete: false } },
  fields: [
    {
      type: 'string' as const,
      name: 'name',
      label: 'Sponsor Name',
      required: true,
      isTitle: true,
      description: 'Company or brand name',
    },
    {
      type: 'image' as const,
      name: 'logo',
      label: 'Logo',
      required: true,
      description:
        'Sponsor logo (PNG with transparent background works best). Avoid spaces in filenames — use hyphens.',
      uploadDir: () => 'assets/sponsors/logos',
      ui: imageUi(2),
    },
    {
      type: 'string' as const,
      name: 'url',
      label: 'Website URL',
      description: 'Link to sponsor website (clicking logo goes here)',
      ui: { validate: validateUrl },
    },
    {
      type: 'boolean' as const,
      name: 'isTitleSponsor',
      label: 'Title Sponsor',
      description: 'Check if this is a title/premier sponsor (shown larger)',
    },
    {
      type: 'number' as const,
      name: 'order',
      label: 'Display Order',
      description: 'Lower numbers appear first in the carousel',
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
      label: 'Description',
      isBody: true,
      description: 'Optional description of the sponsor or partnership',
    },
  ],
};
