import { defineConfig, type Template } from 'tinacms';

// =============================================================================
// Shared Field Definitions (DRY)
// =============================================================================

/**
 * Common event fields used across all year collections
 */
const eventFields: Template['fields'] = [
  { type: 'string', name: 'title', label: 'Event Title', required: true, isTitle: true },
  { type: 'string', name: 'summary', label: 'Summary', required: true, ui: { component: 'textarea' } },
  { type: 'datetime', name: 'date', label: 'Event Date', required: true },
  { type: 'datetime', name: 'endDate', label: 'End Date (multi-day events)' },
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
  {
    type: 'object',
    name: 'downloads',
    label: 'Downloadable Files',
    list: true,
    fields: [
      { type: 'string', name: 'label', label: 'Label' },
      { type: 'string', name: 'url', label: 'URL' },
    ],
  },
  { type: 'string', name: 'tags', label: 'Tags', list: true },
  { type: 'boolean', name: 'draft', label: 'Draft' },
  { type: 'rich-text', name: 'body', label: 'Additional Details', isBody: true },
];

/**
 * Create an events collection for a specific year
 */
function createEventsCollection(year: number) {
  return {
    name: `events${year}`,
    label: `Events (${year})`,
    path: `src/content/events/${year}`,
    format: 'md' as const,
    fields: eventFields,
  };
}

// =============================================================================
// TinaCMS Configuration
// =============================================================================

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'cms-setup',

  // Local development mode - set these via environment variables for production
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },


  media: {
    tina: {
      mediaRoot: '',  // Empty = entire public folder is media root
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      // =========================================================================
      // Blog Posts
      // =========================================================================
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        defaultItem: () => ({
          pubDate: new Date().toISOString(),
          author: 'ECEA',
          category: 'news',
          draft: false,
        }),
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              const date = values?.pubDate
                ? new Date(values.pubDate).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10);
              const title = values?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'untitled';
              return `${date}-${title}`;
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

      // =========================================================================
      // Events by Year
      // =========================================================================
      createEventsCollection(2026),
      createEventsCollection(2025),
      createEventsCollection(2024),
      createEventsCollection(2023),

      // =========================================================================
      // Clubs
      // =========================================================================
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

      // =========================================================================
      // Racing Series
      // =========================================================================
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

      // =========================================================================
      // Board Members (Executive Board and Board of Trustees)
      // =========================================================================
      {
        name: 'board',
        label: 'Board Members',
        path: 'src/content/board',
        format: 'md',
        fields: [
          { type: 'string', name: 'name', label: 'Name', required: true, isTitle: true },
          { type: 'string', name: 'title', label: 'Title/Position', required: true },
          {
            type: 'string',
            name: 'boardType',
            label: 'Board Type',
            options: ['executive', 'trustees'],
            required: true,
          },
          { type: 'string', name: 'image', label: 'Photo URL' },
          { type: 'string', name: 'email', label: 'Email' },
          { type: 'string', name: 'phone', label: 'Phone' },
          { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
          { type: 'number', name: 'order', label: 'Display Order' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Additional Info', isBody: true },
        ],
      },

      // =========================================================================
      // Staff Contacts (Series Directors, Referees, etc.)
      // =========================================================================
      {
        name: 'staff',
        label: 'Staff Contacts',
        path: 'src/content/staff',
        format: 'md',
        fields: [
          { type: 'string', name: 'name', label: 'Name', required: true, isTitle: true },
          { type: 'string', name: 'email', label: 'Email' },
          { type: 'string', name: 'phone', label: 'Phone' },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: [
              'ECEA Referee',
              'Enduro Series',
              'Hare Scramble / FastKIDZ',
              'Marketing & Sponsorships',
              'Web Masters',
            ],
            required: true,
          },
          { type: 'string', name: 'role', label: 'Role/Title' },
          { type: 'number', name: 'order', label: 'Display Order (within category)' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Additional Info', isBody: true },
        ],
      },

      // =========================================================================
      // Sponsors
      // =========================================================================
      {
        name: 'sponsors',
        label: 'Sponsors',
        path: 'src/content/sponsors',
        format: 'md',
        fields: [
          { type: 'string', name: 'name', label: 'Sponsor Name', required: true, isTitle: true },
          { type: 'image', name: 'logo', label: 'Logo', required: true },
          { type: 'string', name: 'url', label: 'Website URL' },
          { type: 'boolean', name: 'isTitleSponsor', label: 'Title Sponsor' },
          { type: 'number', name: 'order', label: 'Display Order' },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          { type: 'rich-text', name: 'body', label: 'Description', isBody: true },
        ],
      },

      // =========================================================================
      // Pages
      // =========================================================================
      {
        name: 'pages',
        label: 'Pages',
        path: 'src/content/pages',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Page Title', required: true, isTitle: true },
          { type: 'string', name: 'subtitle', label: 'Subtitle' },
          { type: 'string', name: 'description', label: 'SEO Description', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'draft', label: 'Draft' },
          // Get Started page fields
          { type: 'string', name: 'welcomeTitle', label: 'Welcome Title' },
          { type: 'string', name: 'welcomeContent', label: 'Welcome Content', ui: { component: 'textarea' } },
          { type: 'string', name: 'welcomeBookUrl', label: 'Welcome Book URL' },
          { type: 'string', name: 'amaUrl', label: 'AMA URL' },
          { type: 'string', name: 'seriesTitle', label: 'Series Section Title' },
          { type: 'string', name: 'seriesDescription', label: 'Series Section Description', ui: { component: 'textarea' } },
          { type: 'string', name: 'stepsTitle', label: 'Steps Section Title' },
          {
            type: 'object',
            name: 'steps',
            label: 'Steps',
            list: true,
            fields: [
              { type: 'string', name: 'title', label: 'Step Title', required: true },
              { type: 'string', name: 'description', label: 'Step Description', required: true },
            ],
          },
          { type: 'string', name: 'faqTitle', label: 'FAQ Section Title' },
          { type: 'string', name: 'faqDescription', label: 'FAQ Section Description', ui: { component: 'textarea' } },
          // Body for FAQ and other simple pages
          { type: 'rich-text', name: 'body', label: 'Page Content', isBody: true },
        ],
      },

      // =========================================================================
      // Site Info (Sponsors, etc.)
      // =========================================================================
      {
        name: 'siteInfo',
        label: 'Site Info',
        path: 'src/content/siteInfo',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          { type: 'rich-text', name: 'body', label: 'Content', isBody: true },
        ],
      },

      // =========================================================================
      // Team Results (JSON data files)
      // =========================================================================
      {
        name: 'teamResults',
        label: 'Team Results',
        path: 'src/content/teamResults',
        format: 'json',
        fields: [
          { type: 'number', name: 'year', label: 'Year', required: true },
          { type: 'string', name: 'series', label: 'Series', required: true },
          { type: 'string', name: 'lastUpdated', label: 'Last Updated', required: true },
          {
            type: 'object',
            name: 'events',
            label: 'Events',
            list: true,
            fields: [
              { type: 'string', name: 'abbr', label: 'Abbreviation', required: true },
              { type: 'string', name: 'name', label: 'Event Name', required: true },
              { type: 'string', name: 'date', label: 'Date (YYYY-MM-DD)', required: true },
              { type: 'boolean', name: 'completed', label: 'Completed' },
            ],
          },
          {
            type: 'object',
            name: 'standings',
            label: 'Standings',
            list: true,
            fields: [
              { type: 'number', name: 'place', label: 'Place', required: true },
              { type: 'string', name: 'club', label: 'Club Abbreviation', required: true },
              { type: 'number', name: 'total', label: 'Total Points', required: true },
              {
                type: 'object',
                name: 'results',
                label: 'Event Results',
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item?.event || 'Result' }),
                },
                fields: [
                  { type: 'string', name: 'event', label: 'Event Abbr', required: true },
                  { type: 'string', name: 'points', label: 'Points (number, W for host, or empty)' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
