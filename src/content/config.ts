import { defineCollection, z } from 'astro:content';

/**
 * ECEA Content Collections Configuration
 * East Coast Enduro Association - Racing Organization
 */

// Helper for optional strings that may be empty
const optionalString = z
  .string()
  .optional()
  .transform((str) => (str === '' ? undefined : str));

// Helper for optional URLs
const optionalUrl = optionalString.pipe(z.string().url().optional());

// Helper for optional dates
const optionalDate = optionalString.pipe(z.coerce.date().optional());

/**
 * Clubs Collection
 * AMA-chartered motorcycle clubs that host events
 */
const clubsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      abbreviatedName: z.string(),
      logo: image().optional(),
      summary: z.string().optional(),
      website: z.string().optional(),
      contact: z.string().optional(),
      phone: z.string().optional(),
      president: z.string().optional(),
      location: z.string().optional(),
      order: z.number().optional(),
      draft: z.boolean().default(false),
    }),
});

/**
 * Events Collection
 * Enduros, Hare Scrambles, FastKIDZ, Dual Sports, and Special events
 */
const eventsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),

      // Dates & Times
      date: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      keyTime: optionalDate,
      checkInTime: optionalDate,

      // Location
      location: z.string(),

      // Organization
      hostingClubs: z.array(z.string()).default([]),
      eventType: z
        .enum(['Enduro', 'Hare Scramble', 'FastKIDZ', 'Dual Sport', 'Fun Ride', 'ECEA', 'Special', 'Meeting'])
        .optional(),
      format: z.string().optional(),
      series: z.string().optional(),

      // Event characteristics
      closedCourse: z.boolean().default(false),
      gasAway: z.boolean().default(false),
      gateFee: z.string().optional(),

      // Media
      image: image().nullable().optional(),
      flyer: image().nullable().optional(),
      flyerPdf: z.string().nullable().optional(), // PDF version of flyer for download

      // Moto-Tally Integration
      // EID is the chronological event order within a series for the year
      motoTallyId: z.number().nullable().optional(),

      // Links (manual overrides - used if motoTallyId not set)
      registrationLink: optionalUrl,
      startGridLink: optionalUrl,
      resultsLink: optionalUrl,

      // Downloadable files
      downloads: z
        .array(
          z.object({
            label: z.string(),
            url: z.string(),
          })
        )
        .optional(),

      tags: z.array(z.string()).optional(),
      draft: z.boolean().default(false),
    }),
});

/**
 * Blog Collection
 * News, announcements, and articles
 */
const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().optional(),
      pubDate: z.coerce.date(),
      description: z.string(),
      author: z.string().default('ECEA'),
      category: z
        .enum(['announcement', 'news', 'recap', 'article'])
        .default('news'),
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      tags: z.array(z.string()).default(['general']),
      pinned: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

/**
 * Series Collection
 * Racing series information (Enduro, Hare Scramble, FastKIDZ, Dual Sport)
 */
const seriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    facebookGroup: z.string().url().optional(),
    documents: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    faqLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Board Collection
 * ECEA board members, officials, and key volunteers
 */
const boardCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    image: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

/**
 * Pages Collection
 * Static content pages (FAQ, Get Started, etc.)
 */
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Team Results Collection
 * Enduro team competition standings by year
 */
const teamResultsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    year: z.number(),
    series: z.string(),
    lastUpdated: z.string(),
    events: z.array(
      z.object({
        abbr: z.string(),           // Event/club abbreviation (e.g., "TCSMC")
        name: z.string(),           // Event name (e.g., "Greenbrier")
        date: z.string(),           // Date string (e.g., "2025-03-09")
        completed: z.boolean().default(false),
      })
    ),
    standings: z.array(
      z.object({
        place: z.number(),
        club: z.string(),           // Club abbreviation
        total: z.number(),
        // Per-event results: number = points, "W" = host, null = not yet held
        results: z.record(z.union([z.number(), z.literal("W"), z.null()])),
      })
    ),
  }),
});

/**
 * Site Info Collection
 * Global site configuration
 */
const siteInfoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

/**
 * Members Collection
 * ECEA membership roster by year
 * Portable JSON format for easy import/export
 * Unique rider identification: name + city + state
 */
const membersCollection = defineCollection({
  type: 'data',
  schema: z.object({
    year: z.number(),
    series: z.string(),  // "Enduro", "Hare Scramble", "FastKIDZ"
    lastUpdated: z.string(),
    members: z.array(
      z.object({
        ama: z.string().optional(),     // AMA number (Enduro series)
        number: z.string().optional(),  // Bike/rider number
        name: z.string(),
        club: z.string(),               // Club abbreviation (e.g., "OCCR")
        city: z.string().optional(),    // For unique rider identification
        state: z.string().optional(),   // For unique rider identification
      })
    ),
  }),
});

export const collections = {
  clubs: clubsCollection,
  events: eventsCollection,
  blog: blogCollection,
  series: seriesCollection,
  board: boardCollection,
  pages: pagesCollection,
  siteInfo: siteInfoCollection,
  teamResults: teamResultsCollection,
  members: membersCollection,
};
