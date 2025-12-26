/**
 * ECEA Site Constants
 * Centralized configuration for navigation, contact info, and shared data
 */

// Site info
export const SITE_INFO = {
  name: "East Coast Enduro Association",
  shortName: "ECEA",
  tagline: "AMA sanctioned off-road motorcycle racing since 1971",
  email: "info@ecea.org",
  foundedYear: 1971,
};

// Social media links
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/eaborama",
};

// Facebook groups by purpose
export const FACEBOOK_GROUPS = {
  enduro: {
    name: "Enduro",
    url: "https://www.facebook.com/groups/133551240256",
    description: "Enduro series discussion",
  },
  harescramble: {
    name: "Hare Scrambles",
    url: "https://www.facebook.com/groups/HareScrambles",
    description: "Hare Scramble series discussion",
  },
  fastkidz: {
    name: "FastKIDZ",
    url: "https://www.facebook.com/groups/390201834347069",
    description: "FastKIDZ youth racing",
  },
  photos: {
    name: "ECEA Photos",
    url: "https://www.facebook.com/groups/1214033069241014",
    description: "Share and view race photos",
  },
  nonCompetitive: {
    name: "Non-Competitive Events",
    url: "https://www.facebook.com/groups/ecea.noncompetitiveeventgroups",
    description: "Dual sport and fun rides",
  },
};

// Main navigation items
export const NAV_ITEMS = [
  { text: "Home", href: "/" },
  { text: "Get Started", href: "/get-started" },
  { text: "Events", href: "/events" },
  { text: "Results", href: "/results" },
  { text: "Clubs", href: "/clubs" },
  { text: "Resources", href: "/resources" },
  { text: "Blog", href: "/blog" },
  { text: "About", href: "/about-us" },
  { text: "Contact", href: "/contact" },
];

// Footer navigation groups
export const FOOTER_NAV = [
  {
    title: "Racing",
    items: [
      { text: "Events", href: "/events" },
      { text: "Clubs", href: "/clubs" },
      { text: "Results", href: "/results" },
      { text: "Get Started", href: "/get-started" },
    ],
  },
  {
    title: "Resources",
    items: [
      { text: "Rider Resources", href: "/resources" },
      { text: "Rule Book", href: "/documents/ecea-rulebook-current.pdf" },
      { text: "FAQ", href: "/faq" },
      { text: "Blog", href: "/blog" },
      { text: "RSS Feed", href: "/rss.xml" },
    ],
  },
  {
    title: "Connect",
    items: [
      { text: "About ECEA", href: "/about-us" },
      { text: "Meet the Board", href: "/board" },
      { text: "Contact", href: "/contact" },
      { text: "Facebook Groups", href: "/resources#community" },
      { text: "Join a Club", href: "/clubs" },
    ],
  },
];

// Racing series quick links (for homepage)
export const SERIES_LINKS = [
  { name: "Enduro", href: "/series/enduro", emoji: "🏁" },
  { name: "Hare Scramble", href: "/series/harescramble", emoji: "🏆" },
  { name: "FastKIDZ", href: "/series/fastkidz", emoji: "🚵" },
  { name: "Dual Sport", href: "/series/dual-sport", emoji: "🌲" },
];

// Contact form subjects
export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Event Question",
  "Membership",
  "Sponsorship",
  "Website Feedback",
  "Other",
];

// Display limits
export const DISPLAY_LIMITS = {
  featuredEvents: 4,
  latestPosts: 7,
  upcomingEventsPerPage: 12,
};

// Event types for filtering
export const EVENT_TYPES = [
  "Enduro",
  "Hare Scramble",
  "FastKIDZ",
  "Dual Sport",
  "Fun Ride",
  "ECEA",
  "Special",
  "Meeting",
] as const;

// Competitive series (with points/championships)
export const COMPETITIVE_SERIES = ["enduro", "harescramble", "fastkidz"] as const;

// Blog categories
export const BLOG_CATEGORIES = [
  "announcement",
  "news",
  "recap",
  "article",
] as const;

// Moto-Tally configuration
export const MOTO_TALLY = {
  baseUrl: "https://www.moto-tally.com/ECEA",
  paths: {
    "Enduro": "Enduro",
    "Hare Scramble": "ECEA",
    "FastKIDZ": "ECEA_PWY",
  } as Record<string, string>,
  pages: {
    startGrid: "StartingGrid.aspx",
    results: "Results.aspx",
    standings: "Standings.aspx",
    registration: "SeriesRegistration.aspx",
  },
};

// Default images
export const DEFAULT_IMAGES = {
  background: "/images/feature-bg.jpg",
  ogImage: "/images/og/ecea-og.png",
  favicon: "/favicon.png",
};

// Blog category colors (Tailwind classes)
export const CATEGORY_COLORS: Record<string, string> = {
  announcement: "bg-accent-600",
  news: "bg-primary-600/80",
  recap: "bg-secondary-600/80",
  article: "bg-gray-600/80",
};

// Event type colors (Tailwind classes)
export const EVENT_TYPE_COLORS: Record<string, string> = {
  Enduro: "bg-primary-600",
  "Hare Scramble": "bg-secondary-600",
  FastKIDZ: "bg-accent-600",
  "Dual Sport": "bg-green-600",
  "Fun Ride": "bg-teal-600",
  ECEA: "bg-gray-600",
  Special: "bg-purple-600",
  Meeting: "bg-slate-600",
};

// Shared UI styles (Tailwind classes)
export const UI_STYLES = {
  // Badges
  badge: "px-2 py-0.5 text-white text-xs font-medium rounded uppercase tracking-wider",
  badgeLg: "px-2.5 py-1 text-white text-xs font-bold rounded uppercase tracking-wider",
  // Card overlays
  gradientOverlay: "bg-gradient-to-t from-black/80 via-black/30 to-transparent",
  gradientOverlaySubtle: "bg-gradient-to-t from-black/60 to-transparent",
  // Common patterns
  cardHover: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
};
