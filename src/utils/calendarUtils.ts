/**
 * Calendar Utilities
 * Shared functions for calendar display and ICS generation
 */

import { SITE_INFO } from './constants';

// ============================================================================
// Types
// ============================================================================

export interface CalendarEvent {
  title: string;
  slug: string;
  type: string;
}

export interface ICSEvent {
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  summary: string;
  slug: string;
}

export type EventsByDate = Record<string, CalendarEvent[]>;

// ============================================================================
// Constants
// ============================================================================

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const DAY_ABBREVIATIONS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

/** Default event duration in hours (used when no end date specified) */
export const DEFAULT_EVENT_DURATION_HOURS = 8;

/** Site URL for calendar links */
export const SITE_URL = 'https://www.ecea.org';

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format a date as YYYY-MM-DD using UTC to avoid timezone issues
 * Used as keys for grouping events by date
 */
export function formatDateKey(date: Date): string {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Format a date key from year, month (0-indexed), and day components
 */
export function formatDateKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Format a date for ICS file (YYYYMMDDTHHmmssZ)
 */
export function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// ============================================================================
// Event Grouping
// ============================================================================

/**
 * Group events by date for calendar display
 * Returns a map of date keys to arrays of events
 */
export function groupEventsByDate<T extends { data: { date: Date; title: string; eventType?: string }; slug: string }>(
  events: T[]
): EventsByDate {
  const eventsByDate: EventsByDate = {};

  events.forEach(event => {
    const dateKey = formatDateKey(event.data.date);
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push({
      title: event.data.title,
      slug: event.slug,
      type: event.data.eventType || ''
    });
  });

  return eventsByDate;
}

// ============================================================================
// ICS Generation
// ============================================================================

/**
 * Escape special characters for ICS format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate ICS (iCalendar) content for a list of events
 */
export function generateICSContent(events: ICSEvent[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE_INFO.shortName}//Events Calendar//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${SITE_INFO.shortName} Events`,
    `X-WR-CALDESC:${SITE_INFO.name} Event Schedule`,
  ];

  events.forEach(event => {
    const startDate = new Date(event.date);
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(startDate.getTime() + DEFAULT_EVENT_DURATION_HOURS * 60 * 60 * 1000);
    const url = `${SITE_URL}/events/${event.slug}/`;

    lines.push(
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${escapeICSText(event.title)}`,
      `DESCRIPTION:${escapeICSText(event.summary)}\\n\\nMore info: ${url}`,
      `LOCATION:${escapeICSText(event.location)}`,
      `URL:${url}`,
      `UID:${event.slug}@ecea.org`,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\n');
}

/**
 * Create a data URL for downloading ICS content
 */
export function createICSDataUrl(events: ICSEvent[]): string {
  const content = generateICSContent(events);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}

// ============================================================================
// Calendar Math
// ============================================================================

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week (0-6) for the first day of a month
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Get today's date key
 */
export function getTodayKey(): string {
  const today = new Date();
  return formatDateKeyFromParts(today.getFullYear(), today.getMonth(), today.getDate());
}
