import { CLUB_ABBREVIATIONS } from '../../src/utils/constants';

export const teamEventResultsCollection = {
  name: 'teamEventResults',
  label: 'Team Event Results',
  path: 'src/content/teamEventResults',
  format: 'json' as const,
  ui: {
    allowedActions: { delete: false },
    filename: {
      slugify: (values: Record<string, unknown>) => {
        const year = String(values.year || new Date().getFullYear()).slice(2);
        const series =
          ((values.series as string) || 'Enduro').toLowerCase() === 'enduro' ? 'en' : 'hs';
        const event = ((values.eventAbbr as string) || 'event').toLowerCase();
        return `${year}-${series}-${event}`;
      },
      description: 'Auto-generated: YY-series-club (e.g., 26-en-sjer)',
    },
  },
  fields: [
    {
      type: 'number' as const,
      name: 'year',
      label: 'Year',
      required: true,
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
      name: 'eventAbbr',
      label: 'Event (Club Abbreviation)',
      required: true,
      description:
        'The hosting club abbreviation — must match an event in the season schedule (e.g., "SJER")',
    },
    {
      type: 'object' as const,
      name: 'results',
      label: 'Team Results',
      list: true,
      description: 'One row per team. Host club teams should be entered with 0 points.',
      ui: {
        itemProps: (item: Record<string, unknown>) => ({
          label: item?.team
            ? `${item.team} (${item.club}): ${item.points ?? '?'} pts`
            : 'New Result',
        }),
      },
      fields: [
        {
          type: 'string' as const,
          name: 'team',
          label: 'Team Name',
          required: true,
          description: 'Team name (e.g., "RIDGE RIDERS -A-", "FASTBOYZ I")',
        },
        {
          type: 'string' as const,
          name: 'club',
          label: 'Club',
          required: true,
          options: CLUB_ABBREVIATIONS,
          description: 'Select the club this team represents',
        },
        {
          type: 'number' as const,
          name: 'points',
          label: 'Championship Points',
          required: true,
          description: '25/22/20/18... based on finishing position. Host club teams = 0.',
        },
        {
          type: 'number' as const,
          name: 'epoints',
          label: 'Emergency Points',
          description: 'Tiebreaker score from the scoring software (optional)',
        },
        {
          type: 'string' as const,
          name: 'riders',
          label: 'Riders',
          list: true,
          description: 'Rider names on this team for this event (can change each round)',
        },
      ],
    },
  ],
};
