import { DatePickerField } from '../components';
import { CLUB_ABBREVIATIONS } from '../../src/utils/constants';

export const teamSeasonsCollection = {
  name: 'teamSeasons',
  label: 'Team Competition — Season Setup',
  path: 'src/content/teamSeasons',
  format: 'json' as const,
  ui: {
    allowedActions: { create: true, delete: false },
    beforeSubmit: async ({ values }: { values: Record<string, unknown> }) => ({
      ...values,
      lastUpdated: new Date().toISOString().slice(0, 10),
    }),
    filename: {
      slugify: (values: Record<string, unknown>) => {
        const year = values.year || new Date().getFullYear();
        const series = ((values.series as string) || 'Enduro')
          .toLowerCase()
          .replace(/\s+/g, '-');
        return `${year}-${series}`;
      },
      description: 'Auto-generated: year-series (e.g., 2026-enduro)',
    },
  },
  fields: [
    {
      type: 'number' as const,
      name: 'year',
      label: 'Year',
      required: true,
      description: 'The season year (e.g., 2026)',
    },
    {
      type: 'string' as const,
      name: 'series',
      label: 'Series',
      required: true,
      options: ['Enduro', 'Hare Scramble'],
    },
    {
      type: 'string' as const,
      name: 'lastUpdated',
      label: 'Last Updated',
      ui: { component: () => null },
    },
    {
      type: 'object' as const,
      name: 'teams',
      label: 'Registered Teams',
      list: true,
      description: 'All teams registered for this season. Add each team once here.',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: item?.name ? `${item.name} (${item.club})` : 'New Team',
        }),
      },
      fields: [
        {
          type: 'string' as const,
          name: 'name',
          label: 'Team Name',
          required: true,
          description: 'Display name (e.g., "Iron Horses" or just "OCCR" if unnamed)',
        },
        {
          type: 'string' as const,
          name: 'club',
          label: 'Club',
          required: true,
          options: CLUB_ABBREVIATIONS,
          description: 'Select the club this team represents',
        },
      ],
    },
    {
      type: 'object' as const,
      name: 'schedule',
      label: 'Event Schedule',
      list: true,
      description:
        'All events in the season — include future events so they show as columns in standings.',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: item?.abbr
            ? `${item.abbr} — ${item.name} (${item.date})`
            : 'New Event',
        }),
      },
      fields: [
        {
          type: 'string' as const,
          name: 'abbr',
          label: 'Abbreviation',
          required: true,
          description: 'Short code used in results (e.g., "SJER", "DVTR")',
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
          type: 'string' as const,
          name: 'hostClubs',
          label: 'Host Club(s)',
          list: true,
          required: true,
          options: CLUB_ABBREVIATIONS,
          description:
            "Club(s) hosting this event (their teams get 0 points). Usually just one.",
        },
      ],
    },
  ],
};
