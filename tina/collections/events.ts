import { type Template } from 'tinacms';
import { DatePickerField, TimePickerField, endurosOnlyToggle } from '../components';
import { imageUi, validateUrl } from '../helpers';
import { CLUB_ABBREVIATIONS, SCHEDULABLE_EVENT_TYPES } from '../../src/utils/constants';

// =============================================================================
// Event Type → filename abbreviation map
// =============================================================================

const eventTypeAbbreviations: Record<string, string> = {
  Enduro: 'en',
  'Hare Scramble': 'hs',
  FastKIDZ: 'fk',
  'Dual Sport': 'ds',
  ECEA: 'ecea',
  Special: 'sp',
};

// =============================================================================
// Shared event fields (used across all year collections)
// =============================================================================

export const eventFields: Template['fields'] = [
  // ---------------------------------------------------------------------------
  // Basic Info
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Date & Time
  // ---------------------------------------------------------------------------
  {
    type: 'datetime',
    name: 'date',
    label: 'Event Date',
    required: true,
    description: 'The start date of the event',
    ui: { component: DatePickerField },
  },
  {
    type: 'datetime',
    name: 'endDate',
    label: 'End Date',
    description: 'Only needed for multi-day events',
    ui: { component: DatePickerField },
  },
  {
    type: 'string',
    name: 'keyTime',
    label: 'Key/Start Time (EST)',
    ui: { component: TimePickerField },
  },
  {
    type: 'string',
    name: 'checkInTime',
    label: 'Check-in Time (EST)',
    ui: { component: TimePickerField },
  },

  // ---------------------------------------------------------------------------
  // Location & Hosting
  // ---------------------------------------------------------------------------
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
    options: CLUB_ABBREVIATIONS,
    description: 'Select the club(s) hosting this event. Add one entry per club.',
  },

  // ---------------------------------------------------------------------------
  // Event Classification
  // ---------------------------------------------------------------------------
  {
    type: 'string',
    name: 'eventType',
    label: 'Event Type',
    required: true,
    options: [...SCHEDULABLE_EVENT_TYPES],
    description: 'The type of event — determines calendar color and filtering',
  },
  {
    type: 'string',
    name: 'format',
    label: 'Format',
    options: [
      'Time Keeping',
      'Restart',
      'Hare Scramble',
      'Sprint Enduro',
      'National Enduro',
      'Dual Sport',
      'Extreme Enduro',
      'Family Fun Ride',
      'Special',
    ],
    description: 'Race format. Leave blank for non-race events.',
  },
  {
    type: 'string',
    name: 'series',
    label: 'Series',
    options: [
      'ECEA Enduro Championship Series',
      'ECEA Youth Series',
      'Hare Scramble Series',
      'Dual Sport Series',
      'Special Series',
      'ECEA Events',
    ],
    description: 'Which championship series this event counts toward',
  },

  // ---------------------------------------------------------------------------
  // Race Details (Enduro only)
  // ---------------------------------------------------------------------------
  {
    type: 'boolean',
    name: 'closedCourse',
    label: 'Closed Course',
    description: 'Check if the course is closed to the public during the event',
    ui: {
      component: endurosOnlyToggle(
        'Closed Course',
        'Check if the course is closed to the public during the event'
      ),
    },
  },
  {
    type: 'boolean',
    name: 'gasAway',
    label: 'Gas Away',
    description:
      "Check if there is a gas stop during the event (riders don't need to carry all their fuel for the full course)",
    ui: {
      component: endurosOnlyToggle(
        'Gas Away',
        "Riders don't need to carry all their fuel — there's a gas stop on course"
      ),
    },
  },
  {
    type: 'string',
    name: 'gateFee',
    label: 'Gate Fee',
    description: 'Entry fee for spectators/non-riders (e.g., "$10 per vehicle")',
  },

  // ---------------------------------------------------------------------------
  // Media
  // ---------------------------------------------------------------------------
  {
    type: 'image',
    name: 'image',
    label: 'Event Image',
    description:
      'Optional hero image (not the flyer). Used for event detail page header. Avoid spaces in filenames — use hyphens (e.g., my-photo.jpg).',
    uploadDir: () => 'assets/events/images',
    ui: imageUi(3),
  },
  {
    type: 'image',
    name: 'flyer',
    label: 'Event Flyer',
    description:
      'The promotional flyer image (JPG or PNG). Will be displayed on the event page. Avoid spaces in filenames — use hyphens (e.g., ice-breaker-flyer.jpg).',
    uploadDir: () => 'assets/events/flyers',
    ui: imageUi(3),
  },
  {
    type: 'string',
    name: 'flyerPdf',
    label: 'Flyer PDF URL',
    description: 'Link to a downloadable PDF version of the flyer (optional)',
    ui: { validate: validateUrl },
  },

  // ---------------------------------------------------------------------------
  // Registration & Results
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Additional Files
  // ---------------------------------------------------------------------------
  {
    type: 'object',
    name: 'downloads',
    label: 'Downloadable Files',
    list: true,
    description: 'Additional files like supplemental rules, maps, or entry forms',
    ui: {
      itemProps: (item: Record<string, unknown>) => ({ label: (item?.label as string) || 'New Download' }),
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
        type: 'image',
        name: 'url',
        label: 'File',
        required: true,
        description: 'Upload a file (PDF, image, etc.)',
        uploadDir: () => 'attachments/events',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------
  {
    type: 'rich-text',
    name: 'body',
    label: 'Additional Details',
    isBody: true,
    description: 'Additional info, directions, or notes about the event',
  },
];

// =============================================================================
// Year-based collection factory
// =============================================================================

/**
 * Create an events collection for a specific year.
 * Pass `locked: true` for past years to prevent creating or deleting events.
 */
export function createEventsCollection(year: number, { locked = false } = {}) {
  return {
    name: `events${year}`,
    label: `Events (${year})`,
    path: `src/content/events/${year}`,
    format: 'md' as const,
    defaultItem: () => ({ draft: true }),
    ui: {
      ...(locked && { allowedActions: { create: false, delete: false } }),
      itemProps: (item: Record<string, unknown>) => ({
        label: `${item.draft ? '[DRAFT] ' : ''}${(item.title as string) || 'Untitled'}`,
      }),
      filename: {
        slugify: (values: Record<string, unknown>) => {
          const yr = year.toString().slice(2);
          const eventType = (values?.eventType as string) || '';
          const typeAbbr = eventTypeAbbreviations[eventType] || 'event';
          const title =
            (values?.title as string)
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') || 'untitled';

          if (eventType === 'ECEA') {
            return `${yr}-${typeAbbr}-${title}`;
          }

          const clubs = (values?.hostingClubs as string[]) || [];
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
