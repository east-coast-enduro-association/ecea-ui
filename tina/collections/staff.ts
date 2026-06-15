import { validateEmail } from '../helpers';
import { STAFF_CATEGORIES } from '../../src/utils/constants';

export const staffCollection = {
  name: 'staff',
  label: 'Staff Contacts',
  path: 'src/content/staff',
  format: 'md' as const,
  ui: { allowedActions: { delete: false } },
  fields: [
    {
      type: 'string' as const,
      name: 'name',
      label: 'Name',
      required: true,
      isTitle: true,
      description: 'Full name of the staff member',
    },
    {
      type: 'string' as const,
      name: 'email',
      label: 'Email',
      description: 'Contact email',
      ui: { validate: validateEmail },
    },
    {
      type: 'string' as const,
      name: 'phone',
      label: 'Phone',
      description: 'Contact phone number',
    },
    {
      type: 'string' as const,
      name: 'category',
      label: 'Category',
      // Canonical source: src/utils/constants.ts → STAFF_CATEGORIES
      options: [...STAFF_CATEGORIES],
      required: true,
      description: 'Which department/series they work with',
    },
    {
      type: 'string' as const,
      name: 'role',
      label: 'Role/Title',
      description: 'Their specific role (e.g., "Series Director", "Chief Referee")',
    },
    {
      type: 'number' as const,
      name: 'order',
      label: 'Display Order',
      description: 'Order within their category (lower numbers first)',
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
