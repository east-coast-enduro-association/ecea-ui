import { defineConfig, type Template } from 'tinacms';

// =============================================================================
// Shared Field Definitions (DRY)
// =============================================================================

/**
 * URL validation helper - returns error message if invalid, undefined if valid
 */
const validateUrl = (value: string): string | undefined => {
  if (!value) return undefined;
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return 'URL must start with http:// or https://';
  }
  return undefined;
};

/**
 * Common event fields used across all year collections
 */
const eventFields: Template['fields'] = [
  // -------------------------------------------------------------------------
  // Basic Info
  // -------------------------------------------------------------------------
  {
    type: 'string',
    name: 'title',
    label: 'Event Title',
    required: true,
    isTitle: true,
    description: 'The name of the event (e.g., "Ice Breaker", "High Steaks")',
  },
  {
    type: 'string',
    name: 'summary',
    label: 'Summary',
    required: true,
    ui: { component: 'textarea' },
    description: 'A short tagline or description shown on event cards (1-2 sentences)',
  },

  // -------------------------------------------------------------------------
  // Date & Time
  // -------------------------------------------------------------------------
  {
    type: 'datetime',
    name: 'date',
    label: 'Event Date',
    required: true,
    description: 'The start date of the event',
  },
  {
    type: 'datetime',
    name: 'endDate',
    label: 'End Date',
    description: 'Only needed for multi-day events (e.g., 2-day enduros)',
  },
  {
    type: 'string',
    name: 'keyTime',
    label: 'Key/Start Time (EST)',
    description: 'Enter time in EST (e.g., "9:00 AM", "1:30 PM")',
  },
  {
    type: 'string',
    name: 'checkInTime',
    label: 'Check-in Time (EST)',
    description: 'Enter time in EST (e.g., "7:00 AM", "8:30 AM")',
  },

  // -------------------------------------------------------------------------
  // Location & Hosting
  // -------------------------------------------------------------------------
  {
    type: 'string',
    name: 'location',
    label: 'Location',
    required: true,
    description: 'Venue name and address (e.g., "BBB Hunting Club, Pemberton, NJ")',
  },
  {
    type: 'string',
    name: 'hostingClubs',
    label: 'Hosting Clubs',
    list: true,
    description: 'Club abbreviations (e.g., SJER, DVTR). Add one club per item.',
  },

  // -------------------------------------------------------------------------
  // Event Classification
  // -------------------------------------------------------------------------
  {
    type: 'string',
    name: 'eventType',
    label: 'Event Type',
    required: true,
    options: ['Enduro', 'Hare Scramble', 'FastKIDZ', 'Dual Sport', 'ECEA', 'Special'],
    description: 'The type of event - determines calendar color and filtering',
  },
  {
    type: 'string',
    name: 'format',
    label: 'Format',
    description: 'Race format (e.g., "Sprint Enduro", "2-Hour", "Time Keeping"). Leave blank for non-race events.',
  },
  {
    type: 'string',
    name: 'series',
    label: 'Series',
    description: 'Which series this counts toward (e.g., "Enduro Series", "Hare Scramble Series")',
  },

  // -------------------------------------------------------------------------
  // Race Details (for racing events)
  // -------------------------------------------------------------------------
  {
    type: 'boolean',
    name: 'closedCourse',
    label: 'Closed Course',
    description: 'Check if the course is closed to the public during the event',
  },
  {
    type: 'boolean',
    name: 'gasAway',
    label: 'Gas Away',
    description: 'Check if gas is available at the venue (gas away = no need to carry extra fuel)',
  },
  {
    type: 'string',
    name: 'gateFee',
    label: 'Gate Fee',
    description: 'Entry fee for spectators/non-riders (e.g., "$10 per vehicle")',
  },

  // -------------------------------------------------------------------------
  // Media
  // -------------------------------------------------------------------------
  {
    type: 'image',
    name: 'image',
    label: 'Event Image',
    description: 'Optional hero image (not the flyer). Used for event detail page header.',
  },
  {
    type: 'image',
    name: 'flyer',
    label: 'Event Flyer',
    description: 'The promotional flyer image (JPG or PNG). Will be displayed on the event page.',
    uploadDir: () => 'assets/events',
    ui: {
      // Store as relative path for Astro's image() optimization
      parse: (media: string) => {
        if (!media) return '';
        // Convert /assets/events/file.jpg -> ../../../assets/events/file.jpg
        if (media.startsWith('/assets/')) {
          return `../../..${media}`;
        }
        return media;
      },
      // Preview with absolute path for TinaCMS
      previewSrc: (value: string) => {
        if (!value) return '';
        // Convert ../../../assets/events/file.jpg -> /assets/events/file.jpg
        if (value.startsWith('../../../assets/')) {
          return value.replace('../../..', '');
        }
        return value;
      },
    },
  },
  {
    type: 'string',
    name: 'flyerPdf',
    label: 'Flyer PDF URL',
    description: 'Link to a downloadable PDF version of the flyer (optional)',
    ui: { validate: validateUrl },
  },

  // -------------------------------------------------------------------------
  // Registration & Results
  // -------------------------------------------------------------------------
  {
    type: 'number',
    name: 'motoTallyId',
    label: 'Moto-Tally ID',
    description: 'The event ID from Moto-Tally (for automatic registration links)',
  },
  {
    type: 'string',
    name: 'registrationLink',
    label: 'Registration Link',
    description: 'Direct link to sign up (e.g., Moto-Tally or MotorsportReg URL)',
    ui: { validate: validateUrl },
  },
  {
    type: 'string',
    name: 'startGridLink',
    label: 'Start Grid Link',
    description: 'Link to the start order/grid (usually posted before the event)',
    ui: { validate: validateUrl },
  },
  {
    type: 'string',
    name: 'resultsLink',
    label: 'Results Link',
    description: 'Link to official results (added after the event)',
    ui: { validate: validateUrl },
  },

  // -------------------------------------------------------------------------
  // Additional Files
  // -------------------------------------------------------------------------
  {
    type: 'object',
    name: 'downloads',
    label: 'Downloadable Files',
    list: true,
    description: 'Additional files like supplemental rules, maps, or entry forms',
    ui: {
      itemProps: (item) => ({ label: item?.label || 'New Download' }),
    },
    fields: [
      {
        type: 'string',
        name: 'label',
        label: 'Label',
        required: true,
        description: 'Display name (e.g., "Supplemental Rules", "Course Map")',
      },
      {
        type: 'string',
        name: 'url',
        label: 'URL',
        required: true,
        description: 'Link to the file',
        ui: { validate: validateUrl },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Metadata
  // -------------------------------------------------------------------------
  {
    type: 'string',
    name: 'tags',
    label: 'Tags',
    list: true,
    description: 'Optional keywords for searching (e.g., "youth", "beginner-friendly")',
  },
  {
    type: 'boolean',
    name: 'draft',
    label: 'Draft',
    description: 'Check to hide this event from the public site (uncheck to publish)',
  },

  // -------------------------------------------------------------------------
  // Content
  // -------------------------------------------------------------------------
  {
    type: 'rich-text',
    name: 'body',
    label: 'Additional Details',
    isBody: true,
    description: 'Additional info, directions, or notes about the event',
  },
];

/**
 * Event type abbreviations for filenames
 */
const eventTypeAbbreviations: Record<string, string> = {
  'Enduro': 'en',
  'Hare Scramble': 'hs',
  'FastKIDZ': 'fk',
  'Dual Sport': 'ds',
  'ECEA': 'ecea',
  'Special': 'sp',
};

/**
 * Create an events collection for a specific year
 */
function createEventsCollection(year: number) {
  return {
    name: `events${year}`,
    label: `Events (${year})`,
    path: `src/content/events/${year}`,
    format: 'md' as const,
    defaultItem: () => ({
      date: new Date().toISOString(),
      draft: true,
      closedCourse: false,
      gasAway: false,
    }),
    ui: {
      filename: {
        slugify: (values: Record<string, unknown>) => {
          // Year (2 digits)
          const yr = year.toString().slice(2);

          // Event type abbreviation
          const eventType = values?.eventType as string || '';
          const typeAbbr = eventTypeAbbreviations[eventType] || 'event';

          // Event name (slugified)
          const title = (values?.title as string)?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'untitled';

          // For ECEA events, skip the club (hosted by sanctioning body)
          if (eventType === 'ECEA') {
            return `${yr}-${typeAbbr}-${title}`;
          }

          // First hosting club (lowercase) - omit if not specified
          const clubs = values?.hostingClubs as string[] || [];
          const club = clubs[0]?.toLowerCase();

          if (club) {
            return `${yr}-${typeAbbr}-${club}-${title}`;
          }
          return `${yr}-${typeAbbr}-${title}`;
        },
        description: 'Auto-generated: year-type-club-name (e.g., 26-en-sjer-ice-breaker)',
      },
    },
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
            description: 'Auto-generated from date and title. Used in the URL.',
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            required: true,
            isTitle: true,
            description: 'The headline of your blog post',
          },
          {
            type: 'datetime',
            name: 'pubDate',
            label: 'Publication Date',
            required: true,
            description: 'When this post should be published (can be future-dated)',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            required: true,
            ui: { component: 'textarea' },
            description: 'A short summary shown in previews and search results (1-2 sentences)',
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
            description: 'Who wrote this post (defaults to "ECEA")',
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            options: ['announcement', 'news', 'recap', 'article'],
            description: 'announcement = important updates, news = general news, recap = event recaps, article = educational content',
          },
          {
            type: 'object',
            name: 'image',
            label: 'Featured Image',
            description: 'The main image shown at the top of the post and in previews',
            fields: [
              {
                type: 'image',
                name: 'src',
                label: 'Image',
                description: 'Upload a JPG or PNG image (recommended: 1200x630px for social sharing)',
                uploadDir: () => 'assets/blog',
                ui: {
                  parse: (media: string) => {
                    if (!media) return '';
                    if (media.startsWith('/assets/')) {
                      return `../..${media}`;
                    }
                    return media;
                  },
                  previewSrc: (value: string) => {
                    if (!value) return '';
                    if (value.startsWith('../../assets/')) {
                      return value.replace('../..', '');
                    }
                    return value;
                  },
                },
              },
              {
                type: 'string',
                name: 'alt',
                label: 'Alt Text',
                description: 'Describe the image for accessibility (e.g., "Riders at the start line")',
              },
            ],
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
            description: 'Keywords for filtering and search (e.g., "enduro", "results", "youth")',
          },
          {
            type: 'boolean',
            name: 'pinned',
            label: 'Pinned (Featured)',
            description: 'Check to show this post at the top of the blog page',
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Check to hide from the public site (uncheck to publish)',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
            description: 'The main content of your blog post. Use headings, bold, links, and images.',
          },
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
          {
            type: 'string',
            name: 'name',
            label: 'Club Name',
            required: true,
            isTitle: true,
            description: 'Full club name (e.g., "South Jersey Enduro Riders")',
          },
          {
            type: 'string',
            name: 'abbreviatedName',
            label: 'Abbreviation',
            required: true,
            description: 'Short form used on the schedule (e.g., "SJER")',
          },
          {
            type: 'image',
            name: 'logo',
            label: 'Club Logo',
            uploadDir: () => 'assets/clubs/logos',
            description: 'Club logo image (PNG with transparent background preferred)',
          },
          {
            type: 'string',
            name: 'summary',
            label: 'Summary',
            ui: { component: 'textarea' },
            description: 'A brief description of the club (1-2 sentences)',
          },
          {
            type: 'string',
            name: 'website',
            label: 'Website URL',
            description: 'Club website or Facebook page URL',
            ui: { validate: validateUrl },
          },
          {
            type: 'string',
            name: 'contact',
            label: 'Contact Email',
            description: 'Public contact email for the club',
          },
          {
            type: 'string',
            name: 'phone',
            label: 'Phone',
            description: 'Contact phone number (optional)',
          },
          {
            type: 'string',
            name: 'president',
            label: 'President/Contact Name',
            description: 'Club president or main contact person',
          },
          {
            type: 'string',
            name: 'location',
            label: 'Location',
            description: 'Club location (e.g., "Southern New Jersey" or "Pemberton, NJ")',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Display Order',
            description: 'Lower numbers appear first on the clubs page',
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Check to hide from the public site',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Club Description',
            isBody: true,
            description: 'Detailed club info, history, or membership details',
          },
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
          {
            type: 'string',
            name: 'name',
            label: 'Series Name',
            required: true,
            isTitle: true,
            description: 'Name of the racing series (e.g., "Enduro Series", "Hare Scramble Series")',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: { component: 'textarea' },
            description: 'Brief overview of the series',
          },
          {
            type: 'string',
            name: 'facebookGroup',
            label: 'Facebook Group URL',
            description: 'Link to the series Facebook group',
            ui: { validate: validateUrl },
          },
          {
            type: 'object',
            name: 'documents',
            label: 'Documents',
            list: true,
            description: 'Official series documents (rules, entry forms, etc.)',
            ui: {
              itemProps: (item) => ({ label: item?.label || 'New Document' }),
            },
            fields: [
              {
                type: 'string',
                name: 'label',
                label: 'Label',
                required: true,
                description: 'Document name (e.g., "2026 Series Rules")',
              },
              {
                type: 'string',
                name: 'url',
                label: 'URL',
                required: true,
                description: 'Link to the document',
                ui: { validate: validateUrl },
              },
            ],
          },
          {
            type: 'object',
            name: 'faqLinks',
            label: 'FAQ Links',
            list: true,
            description: 'Helpful links for newcomers',
            ui: {
              itemProps: (item) => ({ label: item?.label || 'New Link' }),
            },
            fields: [
              {
                type: 'string',
                name: 'label',
                label: 'Label',
                required: true,
                description: 'Link text (e.g., "What to Bring to Your First Enduro")',
              },
              {
                type: 'string',
                name: 'url',
                label: 'URL',
                required: true,
                ui: { validate: validateUrl },
              },
            ],
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Check to hide from the public site',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Series Details',
            isBody: true,
            description: 'Detailed series information, rules overview, or class structure',
          },
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
          {
            type: 'string',
            name: 'name',
            label: 'Name',
            required: true,
            isTitle: true,
            description: 'Full name of the board member',
          },
          {
            type: 'string',
            name: 'title',
            label: 'Title/Position',
            required: true,
            description: 'Their role (e.g., "President", "Vice President", "Trustee")',
          },
          {
            type: 'string',
            name: 'boardType',
            label: 'Board Type',
            options: ['executive', 'trustees'],
            required: true,
            description: 'executive = officers (President, VP, etc.), trustees = club representatives',
          },
          {
            type: 'string',
            name: 'image',
            label: 'Photo URL',
            description: 'Link to their photo (optional)',
          },
          {
            type: 'string',
            name: 'email',
            label: 'Email',
            description: 'Public contact email (optional)',
          },
          {
            type: 'string',
            name: 'phone',
            label: 'Phone',
            description: 'Contact phone (optional)',
          },
          {
            type: 'string',
            name: 'bio',
            label: 'Bio',
            ui: { component: 'textarea' },
            description: 'Short biography or background (optional)',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Display Order',
            description: 'Lower numbers appear first (e.g., President = 1, VP = 2)',
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Check to hide from the public site',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Additional Info',
            isBody: true,
          },
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
          {
            type: 'string',
            name: 'name',
            label: 'Name',
            required: true,
            isTitle: true,
            description: 'Full name of the staff member',
          },
          {
            type: 'string',
            name: 'email',
            label: 'Email',
            description: 'Contact email',
          },
          {
            type: 'string',
            name: 'phone',
            label: 'Phone',
            description: 'Contact phone number',
          },
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
            description: 'Which department/series they work with',
          },
          {
            type: 'string',
            name: 'role',
            label: 'Role/Title',
            description: 'Their specific role (e.g., "Series Director", "Chief Referee")',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Display Order',
            description: 'Order within their category (lower numbers first)',
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Check to hide from the public site',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Additional Info',
            isBody: true,
          },
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
          {
            type: 'string',
            name: 'name',
            label: 'Sponsor Name',
            required: true,
            isTitle: true,
            description: 'Company or brand name',
          },
          {
            type: 'image',
            name: 'logo',
            label: 'Logo',
            required: true,
            description: 'Sponsor logo (PNG with transparent background works best)',
          },
          {
            type: 'string',
            name: 'url',
            label: 'Website URL',
            description: 'Link to sponsor website (clicking logo goes here)',
            ui: { validate: validateUrl },
          },
          {
            type: 'boolean',
            name: 'isTitleSponsor',
            label: 'Title Sponsor',
            description: 'Check if this is a title/premier sponsor (shown larger)',
          },
          {
            type: 'number',
            name: 'order',
            label: 'Display Order',
            description: 'Lower numbers appear first in the carousel',
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Check to hide from the public site',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Description',
            isBody: true,
            description: 'Optional description of the sponsor or partnership',
          },
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
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Page Title',
            required: true,
            isTitle: true,
            description: 'Main heading shown on the page',
          },
          {
            type: 'string',
            name: 'subtitle',
            label: 'Subtitle',
            description: 'Secondary text below the title (optional)',
          },
          {
            type: 'string',
            name: 'description',
            label: 'SEO Description',
            ui: { component: 'textarea' },
            description: 'Description shown in search results (150-160 characters ideal)',
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Check to hide from the public site',
          },
          // Get Started page fields
          {
            type: 'string',
            name: 'welcomeTitle',
            label: 'Welcome Title',
            description: '(Get Started page) Header for the welcome section',
          },
          {
            type: 'string',
            name: 'welcomeContent',
            label: 'Welcome Content',
            ui: { component: 'textarea' },
            description: '(Get Started page) Welcome message text',
          },
          {
            type: 'string',
            name: 'welcomeBookUrl',
            label: 'Welcome Book URL',
            description: 'Link to newcomer guide PDF',
            ui: { validate: validateUrl },
          },
          {
            type: 'string',
            name: 'amaUrl',
            label: 'AMA URL',
            description: 'Link to AMA membership page',
            ui: { validate: validateUrl },
          },
          {
            type: 'string',
            name: 'seriesTitle',
            label: 'Series Section Title',
            description: '(Get Started page) Header for the series overview',
          },
          {
            type: 'string',
            name: 'seriesDescription',
            label: 'Series Section Description',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'stepsTitle',
            label: 'Steps Section Title',
            description: '(Get Started page) Header for the steps section',
          },
          {
            type: 'object',
            name: 'steps',
            label: 'Steps',
            list: true,
            description: '(Get Started page) Step-by-step guide for newcomers',
            ui: {
              itemProps: (item) => ({ label: item?.title || 'New Step' }),
            },
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Step Title',
                required: true,
                description: 'e.g., "Step 1: Get an AMA Card"',
              },
              {
                type: 'string',
                name: 'description',
                label: 'Step Description',
                required: true,
                ui: { component: 'textarea' },
              },
            ],
          },
          {
            type: 'string',
            name: 'faqTitle',
            label: 'FAQ Section Title',
          },
          {
            type: 'string',
            name: 'faqDescription',
            label: 'FAQ Section Description',
            ui: { component: 'textarea' },
          },
          // Body for FAQ and other simple pages
          {
            type: 'rich-text',
            name: 'body',
            label: 'Page Content',
            isBody: true,
            description: 'Main content area for simple pages',
          },
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
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'number',
            name: 'year',
            label: 'Year',
            required: true,
            description: 'The season year (e.g., 2026)',
          },
          {
            type: 'string',
            name: 'series',
            label: 'Series',
            required: true,
            description: 'Which series (e.g., "Enduro", "Hare Scramble")',
          },
          {
            type: 'string',
            name: 'lastUpdated',
            label: 'Last Updated',
            required: true,
            description: 'Date of last update (YYYY-MM-DD format)',
          },
          {
            type: 'object',
            name: 'events',
            label: 'Events',
            list: true,
            description: 'List of events in the series for the year',
            ui: {
              itemProps: (item) => ({ label: item?.name || item?.abbr || 'New Event' }),
            },
            fields: [
              {
                type: 'string',
                name: 'abbr',
                label: 'Abbreviation',
                required: true,
                description: 'Short code (e.g., "SJER", "DVTR")',
              },
              {
                type: 'string',
                name: 'name',
                label: 'Event Name',
                required: true,
              },
              {
                type: 'string',
                name: 'date',
                label: 'Date',
                required: true,
                description: 'Format: YYYY-MM-DD',
              },
              {
                type: 'boolean',
                name: 'completed',
                label: 'Completed',
                description: 'Check after the event has been run',
              },
            ],
          },
          {
            type: 'object',
            name: 'standings',
            label: 'Standings',
            list: true,
            description: 'Club standings in order of points',
            ui: {
              itemProps: (item) => ({
                label: item?.club ? `#${item.place} ${item.club} (${item.total} pts)` : 'New Entry',
              }),
            },
            fields: [
              {
                type: 'number',
                name: 'place',
                label: 'Place',
                required: true,
                description: 'Current position (1, 2, 3...)',
              },
              {
                type: 'string',
                name: 'club',
                label: 'Club',
                required: true,
                description: 'Club abbreviation (e.g., "SJER")',
              },
              {
                type: 'number',
                name: 'total',
                label: 'Total Points',
                required: true,
              },
              {
                type: 'object',
                name: 'results',
                label: 'Event Results',
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item?.event ? `${item.event}: ${item.points || '-'}` : 'Result' }),
                },
                fields: [
                  {
                    type: 'string',
                    name: 'event',
                    label: 'Event',
                    required: true,
                    description: 'Event abbreviation (must match Events list)',
                  },
                  {
                    type: 'string',
                    name: 'points',
                    label: 'Points',
                    description: 'Number, "W" for host club, or leave empty if not yet run',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
