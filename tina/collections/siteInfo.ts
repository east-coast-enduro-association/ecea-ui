export const siteInfoCollection = {
  name: 'siteInfo',
  label: 'Site Info',
  path: 'src/content/siteInfo',
  format: 'md' as const,
  ui: { allowedActions: { create: false, delete: false } },
  fields: [
    { type: 'string' as const, name: 'title', label: 'Title', required: true, isTitle: true },
    { type: 'rich-text' as const, name: 'body', label: 'Content', isBody: true },
  ],
};
