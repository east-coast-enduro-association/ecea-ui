import { imageUi } from '../helpers';
import { BLOG_CATEGORIES } from '../../src/utils/constants';

export const blogCollection = {
  name: 'blog',
  label: 'Blog Posts',
  path: 'src/content/blog',
  format: 'md' as const,
  defaultItem: () => ({
    pubDate: new Date().toISOString(),
    author: 'ECEA',
    category: 'news',
    draft: true,
  }),
  ui: {
    beforeSubmit: async ({ values }: { values: Record<string, unknown> }) => ({
      ...values,
      title: typeof values.title === 'string' ? values.title.trim() : values.title,
      author: typeof values.author === 'string' ? values.author.trim() : values.author,
      description: typeof values.description === 'string' ? values.description.trim() : values.description,
      pubDate: values.pubDate || new Date().toISOString(),
    }),
    itemProps: (item: Record<string, unknown>) => ({
      label: `${item.draft ? '[DRAFT] ' : ''}${item.title || 'Untitled'}`,
    }),
    filename: {
      readonly: false,
      slugify: (values: Record<string, unknown>) => {
        const date = values?.pubDate
          ? new Date(values.pubDate as string).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);
        const title =
          (values?.title as string)
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'untitled';
        return `${date}-${title}`;
      },
      description: 'Auto-generated from date and title. Used in the URL.',
    },
  },
  fields: [
    {
      type: 'string' as const,
      name: 'title',
      label: 'Title',
      required: true,
      isTitle: true,
      description: 'The headline of your blog post',
    },
    {
      type: 'datetime' as const,
      name: 'pubDate',
      label: 'Publication Date',
      required: true,
      description: 'When this post should be published (can be future-dated)',
    },
    {
      type: 'string' as const,
      name: 'description',
      label: 'Description',
      required: true,
      ui: { component: 'textarea' },
      description: 'A short summary shown in previews and search results (1-2 sentences)',
    },
    {
      type: 'string' as const,
      name: 'author',
      label: 'Author',
      description: 'Who wrote this post (defaults to "ECEA")',
    },
    {
      type: 'string' as const,
      name: 'category',
      label: 'Category',
      options: [...BLOG_CATEGORIES],
      description:
        'announcement = important updates, news = general news, recap = event recaps, article = educational content',
    },
    {
      type: 'object' as const,
      name: 'image',
      label: 'Featured Image',
      description: 'The main image shown at the top of the post and in previews',
      fields: [
        {
          type: 'image' as const,
          name: 'src',
          label: 'Image',
          description:
            'Upload a JPG or PNG image (recommended: 1200x630px for social sharing). Avoid spaces in filenames — use hyphens (e.g., my-photo.jpg).',
          uploadDir: () => 'assets/blog',
          ui: imageUi(2),
        },
        {
          type: 'string' as const,
          name: 'alt',
          label: 'Alt Text',
          description: 'Describe the image for accessibility (e.g., "Riders at the start line")',
        },
      ],
    },
    {
      type: 'string' as const,
      name: 'tags',
      label: 'Tags',
      list: true,
      description:
        'Keywords for filtering and search. Common tags: enduro, hare-scramble, dual-sport, results, youth, registration, announcement, recap, schedule, points, awards',
    },
    {
      type: 'boolean' as const,
      name: 'pinned',
      label: 'Pinned (Featured)',
      description: 'Check to show this post at the top of the blog page',
    },
    {
      type: 'boolean' as const,
      name: 'draft',
      label: 'Draft',
      description: 'Check to hide from the public site (uncheck to publish)',
    },
    {
      type: 'rich-text' as const,
      name: 'body',
      label: 'Content',
      isBody: true,
      description: 'The main content of your blog post. Use headings, bold, links, and images.',
    },
  ],
};
