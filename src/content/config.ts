import { defineCollection, z } from 'astro:content';

const staffCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(), // e.g., "Senior Pastor", "Deaconess"
    image: z.string().startsWith('/uploads/staff/'),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    bio: z.string().optional(), // Short bio in frontmatter
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    keyTime: z.date().optional(),
    checkInTime: z.date().optional(),
    location: z.string(),
    hostingClubs: z.array(z.string()).optional(),
    eventType: z.enum(["Enduro", "Hare Scramble", "FastKIDZ", "Dual Sport", "Special", "Meeting"]),
    format: z.string().optional(),
    series: z.string().optional(),
    closedCourse: z.boolean().default(false),
    gasAway: z.boolean().default(false),
    gateFee: z.string().optional(),
    image: z.string().optional(),
    flyer: z.string().optional(),
    registrationLink: z.string().url().optional(),
    startGridLink: z.string().url().optional(),
    downloads: z.array(z.object({
      label: z.string(),
      url: z.string()
    })).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const sermonsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // Auto-generated if not provided
    date: z.date(),
    speaker: z.string(),
    series: z.string().optional(),
    scripture: z.string().optional(),
    audioUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    image: z.string().startsWith('/uploads/sermons/').optional(), // Thumbnail
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const clubsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    abbreviatedName: z.string(),
    logo: z.string().startsWith('/uploads/clubs/logos/').optional(),
    summary: z.string(),
    president: z.string().optional(),
    website: z.string().optional(),
    contact: z.string().optional(), // Email or text
    order: z.number().optional(),
    draft: z.boolean().default(false),
    category: z.array(z.string()).optional(),
    location: z.string().optional(),
    // metadata: z.array(z.object({
    // label: z.string(),
    // info: z.string()
    // )).optional(),
  }).passthrough(),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.date(),
    description: z.string(), // Short description for previews
    author: z.string().default("Church Staff"),
    image: z.object({
      url: z.string().startsWith('/uploads/blog/'),
      alt: z.string()
    }).optional(),
    tags: z.array(z.string()).default(["general"]),
    draft: z.boolean().default(false),
  }),
});

const siteInfoCollection = defineCollection({
  type: 'content', // Could be 'data' if only frontmatter is needed
  schema: z.object({
    title: z.string(), // For identifying the content block
  }),
});

export const collections = {
  staff: staffCollection,
  events: eventsCollection,
  sermons: sermonsCollection,
  clubs: clubsCollection,
  blog: blogCollection,
  siteInfo: siteInfoCollection,
};
