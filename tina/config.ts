import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: 'cms-setup',
  clientId: null, // For local mode
  token: null, // For local mode

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'assets/images/uploads',
      publicFolder: 'src',
    },
  },

  schema: {
    collections: [
      // Blog Posts
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.title?.toLowerCase().replace(/ /g, '-') || '';
            },
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          { type: 'datetime', name: 'pubDate', label: 'Publication Date', required: true },
          { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
          { type: 'string', name: 'author', label: 'Author' },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: ['announcement', 'news', 'recap', 'article'],
          },
          {
            type: 'object',
            name: 'image',
            label: 'Featured Image',
            fields: [
              { type: 'image', name: 'src', label: 'Image' },
              { type: 'string', name: 'alt', label: 'Alt Text' },
            ],
          },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'boolean', name: 'pinned', label: 'Pinned (Featured)' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Content', isBody: true },
        ],
      },

      // Events 2025
      {
        name: 'events2025',
        label: 'Events (2025)',
        path: 'src/content/events/2025',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Event Title', required: true, isTitle: true },
          { type: 'string', name: 'summary', label: 'Summary', required: true, ui: { component: 'textarea' } },
          { type: 'datetime', name: 'date', label: 'Event Date', required: true },
          { type: 'datetime', name: 'endDate', label: 'End Date (multi-day)' },
          { type: 'datetime', name: 'keyTime', label: 'Key/Start Time' },
          { type: 'datetime', name: 'checkInTime', label: 'Check-in Time' },
          { type: 'string', name: 'location', label: 'Location', required: true },
          { type: 'string', name: 'hostingClubs', label: 'Hosting Clubs', list: true },
          {
            type: 'string',
            name: 'eventType',
            label: 'Event Type',
            options: ['Enduro', 'Hare Scramble', 'FastKIDZ', 'Dual Sport', 'Fun Ride', 'ECEA', 'Special', 'Meeting'],
          },
          { type: 'string', name: 'format', label: 'Format' },
          { type: 'string', name: 'series', label: 'Series' },
          { type: 'boolean', name: 'closedCourse', label: 'Closed Course' },
          { type: 'boolean', name: 'gasAway', label: 'Gas Away' },
          { type: 'string', name: 'gateFee', label: 'Gate Fee' },
          { type: 'image', name: 'image', label: 'Event Image' },
          { type: 'image', name: 'flyer', label: 'Event Flyer' },
          { type: 'string', name: 'flyerPdf', label: 'Flyer PDF URL' },
          { type: 'number', name: 'motoTallyId', label: 'Moto-Tally ID' },
          { type: 'string', name: 'registrationLink', label: 'Registration Link' },
          { type: 'string', name: 'startGridLink', label: 'Start Grid Link' },
          { type: 'string', name: 'resultsLink', label: 'Results Link' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Additional Details', isBody: true },
        ],
      },

      // Events 2026
      {
        name: 'events2026',
        label: 'Events (2026)',
        path: 'src/content/events/2026',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Event Title', required: true, isTitle: true },
          { type: 'string', name: 'summary', label: 'Summary', required: true, ui: { component: 'textarea' } },
          { type: 'datetime', name: 'date', label: 'Event Date', required: true },
          { type: 'datetime', name: 'endDate', label: 'End Date (multi-day)' },
          { type: 'datetime', name: 'keyTime', label: 'Key/Start Time' },
          { type: 'datetime', name: 'checkInTime', label: 'Check-in Time' },
          { type: 'string', name: 'location', label: 'Location', required: true },
          { type: 'string', name: 'hostingClubs', label: 'Hosting Clubs', list: true },
          {
            type: 'string',
            name: 'eventType',
            label: 'Event Type',
            options: ['Enduro', 'Hare Scramble', 'FastKIDZ', 'Dual Sport', 'Fun Ride', 'ECEA', 'Special', 'Meeting'],
          },
          { type: 'string', name: 'format', label: 'Format' },
          { type: 'string', name: 'series', label: 'Series' },
          { type: 'boolean', name: 'closedCourse', label: 'Closed Course' },
          { type: 'boolean', name: 'gasAway', label: 'Gas Away' },
          { type: 'string', name: 'gateFee', label: 'Gate Fee' },
          { type: 'image', name: 'image', label: 'Event Image' },
          { type: 'image', name: 'flyer', label: 'Event Flyer' },
          { type: 'string', name: 'flyerPdf', label: 'Flyer PDF URL' },
          { type: 'number', name: 'motoTallyId', label: 'Moto-Tally ID' },
          { type: 'string', name: 'registrationLink', label: 'Registration Link' },
          { type: 'string', name: 'startGridLink', label: 'Start Grid Link' },
          { type: 'string', name: 'resultsLink', label: 'Results Link' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Additional Details', isBody: true },
        ],
      },

      // Clubs
      {
        name: 'clubs',
        label: 'Clubs',
        path: 'src/content/clubs',
        format: 'md',
        fields: [
          { type: 'string', name: 'name', label: 'Club Name', required: true, isTitle: true },
          { type: 'string', name: 'abbreviatedName', label: 'Abbreviation', required: true },
          { type: 'image', name: 'logo', label: 'Club Logo' },
          { type: 'string', name: 'summary', label: 'Summary', ui: { component: 'textarea' } },
          { type: 'string', name: 'website', label: 'Website URL' },
          { type: 'string', name: 'contact', label: 'Contact Email' },
          { type: 'string', name: 'phone', label: 'Phone' },
          { type: 'string', name: 'president', label: 'President/Contact Name' },
          { type: 'string', name: 'location', label: 'Location (City, State)' },
          { type: 'number', name: 'order', label: 'Display Order' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Club Description', isBody: true },
        ],
      },

      // Racing Series
      {
        name: 'series',
        label: 'Racing Series',
        path: 'src/content/series',
        format: 'md',
        fields: [
          { type: 'string', name: 'name', label: 'Series Name', required: true, isTitle: true },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
          { type: 'string', name: 'facebookGroup', label: 'Facebook Group URL' },
          {
            type: 'object',
            name: 'documents',
            label: 'Documents',
            list: true,
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
            ],
          },
          {
            type: 'object',
            name: 'faqLinks',
            label: 'FAQ Links',
            list: true,
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
            ],
          },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Series Details', isBody: true },
        ],
      },

      // Board Members
      {
        name: 'board',
        label: 'Board Members',
        path: 'src/content/board',
        format: 'md',
        fields: [
          { type: 'string', name: 'name', label: 'Name', required: true, isTitle: true },
          { type: 'string', name: 'title', label: 'Title/Position', required: true },
          { type: 'string', name: 'image', label: 'Photo URL' },
          { type: 'string', name: 'email', label: 'Email' },
          { type: 'string', name: 'phone', label: 'Phone' },
          { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
          { type: 'number', name: 'order', label: 'Display Order' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Additional Info', isBody: true },
        ],
      },

      // Pages
      {
        name: 'pages',
        label: 'Pages',
        path: 'src/content/pages',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Page Title', required: true, isTitle: true },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Page Content', isBody: true },
        ],
      },
    ],
  },
});
