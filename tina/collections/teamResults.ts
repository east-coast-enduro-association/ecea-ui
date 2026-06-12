import { DatePickerField } from '../components';

/**
 * Legacy team results collection (2025 and prior).
 * Read-only in TinaCMS — no create or delete allowed.
 */
export const teamResultsCollection = {
  name: 'teamResults',
  label: 'Team Results (Legacy — 2025)',
  path: 'src/content/teamResults',
  format: 'json' as const,
  ui: {
    allowedActions: { create: false, delete: false },
    beforeSubmit: async ({ values }: { values: Record<string, unknown> }) => ({
      ...values,
      lastUpdated: new Date().toISOString().slice(0, 10),
    }),
  },
  fields: [
    {
      type: 'number' as const,
      name: 'year',
      label: 'Year',
      required: true,
      description: 'The season year (e.g., 2025)',
    },
    {
      type: 'string' as const,
      name: 'series',
      label: 'Series',
      required: true,
      description: 'Which series (e.g., "Enduro", "Hare Scramble")',
    },
    {
      type: 'string' as const,
      name: 'lastUpdated',
      label: 'Last Updated',
      required: true,
      ui: { component: () => null },
    },
    {
      type: 'object' as const,
      name: 'events',
      label: 'Events',
      list: true,
      description: 'List of events in the series for the year',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: (item?.name as string) || (item?.abbr as string) || 'New Event',
        }),
      },
      fields: [
        {
          type: 'string' as const,
          name: 'abbr',
          label: 'Abbreviation',
          required: true,
          description: 'Short code (e.g., "SJER", "DVTR")',
        },
        {
          type: 'string' as const,
          name: 'name',
          label: 'Event Name',
          required: true,
        },
        {
          type: 'string' as const,
          name: 'date',
          label: 'Date',
          required: true,
          description: 'Event date',
          ui: { component: DatePickerField },
        },
        {
          type: 'boolean' as const,
          name: 'completed',
          label: 'Completed',
          description: 'Check after the event has been run',
        },
      ],
    },
    {
      type: 'object' as const,
      name: 'standings',
      label: 'Standings',
      list: true,
      description: 'Club standings in order of points',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: item?.club
            ? `#${item.place} ${item.club} (${item.total} pts)`
            : 'New Entry',
        }),
      },
      fields: [
        {
          type: 'number' as const,
          name: 'place',
          label: 'Place',
          required: true,
          description: 'Current position (1, 2, 3...)',
        },
        {
          type: 'string' as const,
          name: 'club',
          label: 'Club',
          required: true,
          description: 'Club abbreviation (e.g., "SJER")',
        },
        {
          type: 'number' as const,
          name: 'total',
          label: 'Total Points',
          required: true,
        },
        {
          type: 'object' as const,
          name: 'results',
          label: 'Event Results',
          list: true,
          ui: {
            itemProps: (item: Record<string, unknown>) => ({
              label: item?.event ? `${item.event}: ${item.points || '-'}` : 'Result',
            }),
          },
          fields: [
            {
              type: 'string' as const,
              name: 'event',
              label: 'Event',
              required: true,
              description: 'Event abbreviation (must match Events list)',
            },
            {
              type: 'string' as const,
              name: 'points',
              label: 'Points',
              description: 'Number, "W" for host club, or leave empty if not yet run',
            },
          ],
        },
      ],
    },
  ],
};
