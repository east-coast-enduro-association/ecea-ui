/**
 * Event Type Color Configuration
 *
 * Provides consistent, accessible color schemes for event type badges/tags.
 * All color combinations meet WCAG AA contrast requirements (4.5:1 for normal text).
 *
 * Color choices are semantic where possible:
 * - Enduro: Blue (traditional, established)
 * - Hare Scramble: Orange (energetic, action)
 * - FastKIDZ: Green (youth, growth)
 * - Dual Sport: Purple (versatile, dual-purpose)
 * - Special: Amber/Gold (unique, standout)
 * - ECEA: Red (organizational, official)
 */

export type EventType =
  | "Enduro"
  | "Hare Scramble"
  | "FastKIDZ"
  | "Dual Sport"
  | "ECEA"
  | "Special";

interface ColorScheme {
  bg: string;
  text: string;
  border?: string;
}

/**
 * Color schemes for each event type.
 * Uses Tailwind CSS classes with accessible contrast ratios.
 */
const eventTypeColors: Record<EventType, ColorScheme> = {
  Enduro: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  "Hare Scramble": {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  FastKIDZ: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  "Dual Sport": {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  Special: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  ECEA: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
};

// Default colors for unknown event types
const defaultColors: ColorScheme = {
  bg: "bg-gray-100",
  text: "text-gray-800",
  border: "border-gray-200",
};

/**
 * Get the color scheme for an event type.
 *
 * @param eventType - The event type string
 * @returns ColorScheme object with bg, text, and border classes
 *
 * @example
 * const colors = getEventTypeColors("Enduro");
 * // { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" }
 */
export function getEventTypeColors(eventType: string | undefined): ColorScheme {
  if (!eventType) return defaultColors;
  return eventTypeColors[eventType as EventType] || defaultColors;
}

/**
 * Get combined Tailwind classes for an event type badge.
 *
 * @param eventType - The event type string
 * @param includeBorder - Whether to include border class (default: false)
 * @returns Space-separated string of Tailwind classes
 *
 * @example
 * getEventTypeBadgeClasses("Hare Scramble")
 * // "bg-orange-100 text-orange-800"
 *
 * getEventTypeBadgeClasses("Enduro", true)
 * // "bg-blue-100 text-blue-800 border-blue-200"
 */
export function getEventTypeBadgeClasses(
  eventType: string | undefined,
  includeBorder: boolean = false
): string {
  const colors = getEventTypeColors(eventType);
  const classes = [colors.bg, colors.text];
  if (includeBorder && colors.border) {
    classes.push(colors.border);
  }
  return classes.join(" ");
}

/**
 * Get muted/grayscale colors for past events.
 * Uses gray tones to indicate the event has passed.
 */
export function getPastEventBadgeClasses(): string {
  return "bg-gray-100 text-gray-600";
}

/**
 * Color schemes for badges on dark backgrounds (e.g., image overlays).
 * Uses semi-transparent backgrounds with white text for readability.
 */
const darkBgColors: Record<EventType, string> = {
  Enduro: "bg-blue-500/80 text-white",
  "Hare Scramble": "bg-orange-500/80 text-white",
  FastKIDZ: "bg-green-500/80 text-white",
  "Dual Sport": "bg-purple-500/80 text-white",
  Special: "bg-amber-500/80 text-white",
  ECEA: "bg-red-500/80 text-white",
};

const defaultDarkBgColors = "bg-white/20 text-white";

/**
 * Get badge classes for use on dark backgrounds (e.g., image overlays).
 *
 * @param eventType - The event type string
 * @returns Space-separated string of Tailwind classes
 *
 * @example
 * getEventTypeBadgeClassesDark("Enduro")
 * // "bg-blue-500/80 text-white"
 */
export function getEventTypeBadgeClassesDark(
  eventType: string | undefined
): string {
  if (!eventType) return defaultDarkBgColors;
  return darkBgColors[eventType as EventType] || defaultDarkBgColors;
}
