import { imageUi, validateUrl, validateEmail } from '../helpers';

export const clubsCollection = {
  name: 'clubs',
  label: 'Clubs',
  path: 'src/content/clubs',
  format: 'md' as const,
  ui: {
    allowedActions: { delete: false },
  },
  fields: [
    {
      type: 'string' as const,
      name: 'name',
      label: 'Club Name',
      required: true,
      isTitle: true,
      description: 'Full club name (e.g., "South Jersey Enduro Riders")',
    },
    {
      type: 'string' as const,
      name: 'abbreviatedName',
      label: 'Abbreviation',
      required: true,
      description: 'Short form used on the schedule (e.g., "SJER")',
    },
    {
      type: 'image' as const,
      name: 'logo',
      label: 'Club Logo',
      uploadDir: () => 'assets/clubs/logos',
      description:
        'Club logo image (PNG with transparent background preferred). Avoid spaces in filenames — use hyphens.',
      ui: imageUi(2),
    },
    {
      type: 'string' as const,
      name: 'summary',
      label: 'Summary',
      ui: { component: 'textarea' },
      description: 'A brief description of the club (1-2 sentences)',
    },
    {
      type: 'string' as const,
      name: 'website',
      label: 'Website URL',
      description: 'Club website or Facebook page URL',
      ui: { validate: validateUrl },
    },
    {
      type: 'string' as const,
      name: 'contact',
      label: 'Contact Email',
      description: 'Public contact email for the club',
      ui: { validate: validateEmail },
    },
    {
      type: 'string' as const,
      name: 'phone',
      label: 'Phone',
      description: 'Contact phone number (optional)',
    },
    {
      type: 'string' as const,
      name: 'president',
      label: 'President/Contact Name',
      description: 'Club president or main contact person',
    },
    {
      type: 'string' as const,
      name: 'location',
      label: 'Location',
      description: 'Club location (e.g., "Southern New Jersey" or "Pemberton, NJ")',
    },
    {
      type: 'number' as const,
      name: 'order',
      label: 'Display Order',
      description: 'Lower numbers appear first on the clubs page',
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
      label: 'Club Description',
      isBody: true,
      description: 'Detailed club info, history, or membership details',
    },
  ],
};
