import { defineCollection, z } from 'astro:content';

const optionalString = z.string().optional().transform((str) => (str === "" ? undefined : str));

const clubsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    abbreviatedName: z.string(),
    logo: z.string().optional(),
    summary: z.string().optional(),
    website: z.string().optional(),
    contact: z.string().optional(),
    president: z.string().optional(),
    location: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }).passthrough(),
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),

    // Dates & Times (Robust handling)
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),

    // If string is "", it becomes undefined. If it has value, it becomes a Date.
    keyTime: optionalString.pipe(z.coerce.date().optional()),
    checkInTime: optionalString.pipe(z.coerce.date().optional()),

    location: z.string(),
    hostingClubs: z.array(z.string()).optional(),
    eventType: z.enum(["Enduro", "Hare Scramble", "FastKIDZ", "Dual Sport", "Special", "Meeting"]).optional(),
    format: z.string().optional(),
    series: z.string().optional(),

    closedCourse: z.boolean().default(false),
    gasAway: z.boolean().default(false),
    gateFee: z.string().optional(),

    image: z.string().nullable().optional(),
    flyer: z.string().nullable().optional(),

    registrationLink: optionalString.pipe(z.string().url().optional()),
    startGridLink: optionalString.pipe(z.string().url().optional()),

    downloads: z.array(z.object({
      label: z.string(),
      url: z.string()
    })).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const staffCollection = defineCollection({
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

const sermonsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.date(),
    speaker: z.string(),
    series: z.string().optional(),
    scripture: z.string().optional(),
    audioUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    image: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string().default("Church Staff"),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
    tags: z.array(z.string()).default(["general"]),
    draft: z.boolean().default(false),
  }),
});

const siteInfoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  clubs: clubsCollection,
  events: eventsCollection,
  staff: staffCollection,
  sermons: sermonsCollection,
  blog: blogCollection,
  siteInfo: siteInfoCollection,
};
