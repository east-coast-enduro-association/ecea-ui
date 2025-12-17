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
  facebook: "https://www.facebook.com/groups/167702099912197",
  instagram: "https://instagram.com/eaborama",
};

// Main navigation items
export const NAV_ITEMS = [
  { text: "Home", href: "/" },
  { text: "Events", href: "/events" },
  { text: "Clubs", href: "/clubs" },
  { text: "Results", href: "/results" },
  { text: "Get Started", href: "/get-started" },
  { text: "Blog", href: "/blog" },
  { text: "About", href: "/about-us" },
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
      { text: "FAQ", href: "/faq" },
      { text: "Rule Book", href: "/documents/ecea-rulebook-current.pdf" },
      { text: "Welcome Book", href: "/documents/ecea-welcome-book.pdf" },
      { text: "Blog", href: "/blog" },
      { text: "RSS Feed", href: "/rss.xml" },
    ],
  },
  {
    title: "Connect",
    items: [
      { text: "About ECEA", href: "/about-us" },
      { text: "Contact", href: "/contact" },
      { text: "Facebook Group", href: SOCIAL_LINKS.facebook },
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
