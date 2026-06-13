import { imageUi, validateEmail } from '../helpers';

export const boardCollection = {
  name: 'board',
  label: 'Board Members',
  path: 'src/content/board',
  format: 'md' as const,
  ui: { allowedActions: { delete: false } },
  fields: [
    {
      type: 'string' as const,
      name: 'name',
      label: 'Name',
      required: true,
      isTitle: true,
      description: 'Full name of the board member',
    },
    {
      type: 'string' as const,
      name: 'title',
      label: 'Title/Position',
      required: true,
      description: 'Their role (e.g., "President", "Vice President", "Trustee")',
    },
    {
      type: 'string' as const,
      name: 'boardType',
      label: 'Board Type',
      options: ['executive', 'trustees'],
      required: true,
      description:
        'executive = officers (President, VP, etc.), trustees = club representatives',
    },
    {
      type: 'image' as const,
      name: 'image',
      label: 'Photo',
      description:
        'Board member photo (optional). Avoid spaces in filenames — use hyphens.',
      uploadDir: () => 'assets/board/photos',
      ui: imageUi(2),
    },
    {
      type: 'string' as const,
      name: 'email',
      label: 'Email',
      description: 'Public contact email (optional)',
      ui: { validate: validateEmail },
    },
    {
      type: 'string' as const,
      name: 'phone',
      label: 'Phone',
      description: 'Contact phone (optional)',
    },
    {
      type: 'string' as const,
      name: 'bio',
      label: 'Bio',
      ui: { component: 'textarea' },
      description: 'Short biography or background (optional)',
    },
    {
      type: 'number' as const,
      name: 'order',
      label: 'Display Order',
      description: 'Lower numbers appear first (e.g., President = 1, VP = 2)',
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
      label: 'Additional Info',
      isBody: true,
    },
  ],
};
