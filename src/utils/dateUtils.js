import { format, parseISO } from "date-fns";

/**
 * ECEA Date Utilities
 *
 * This module handles date parsing and formatting with timezone awareness.
 *
 * PROBLEM: JavaScript Date parsing treats date-only strings (YYYY-MM-DD) as UTC midnight.
 * When displayed in US Eastern timezone, this causes dates to shift back one day.
 * Example: "2026-02-22" parsed as Date becomes Feb 21 at 7:00 PM EST.
 *
 * SOLUTION: Date-only strings are parsed as local midnight instead of UTC midnight.
 * This ensures dates display correctly regardless of the user's timezone.
 *
 * All event dates in markdown files should use the format YYYY-MM-DD for date-only
 * values, or include a time component (e.g., 2026-02-22T09:00:00) for specific times.
 */

/**
 * Parse a date value as local time to prevent timezone shifts.
 *
 * Handles three cases:
 * 1. Date-only strings (YYYY-MM-DD) → parsed as local midnight
 * 2. ISO strings with time → parsed normally via parseISO
 * 3. Date objects from YAML parser → corrected if they were UTC midnight
 *
 * @param {Date|string} value - The date value to parse
 * @returns {Date} The parsed date in local time
 */
export function parseLocalDate(value) {
  if (!value) return null;

  // Handle string inputs
  if (typeof value === "string") {
    // Date-only string (YYYY-MM-DD) - parse as local time
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    // ISO string with time - use date-fns parseISO
    return parseISO(value);
  }

  // Handle Date objects (may come from YAML parser as UTC)
  if (value instanceof Date) {
    // Check if this was likely a date-only value parsed as UTC midnight
    const hours = value.getUTCHours();
    const mins = value.getUTCMinutes();
    const secs = value.getUTCSeconds();

    if (hours === 0 && mins === 0 && secs === 0) {
      // Recreate as local date using UTC components
      return new Date(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate()
      );
    }
    return value;
  }

  return value;
}

/**
 * Format a date in a human-readable format.
 *
 * @param {Date|string} date - The date to format
 * @param {string} formatStr - The date-fns format string (default: 'MMMM d, yyyy')
 * @returns {string} The formatted date string
 *
 * @example
 * formatDate('2026-02-22') // "February 22, 2026"
 * formatDate(new Date(), 'MMM d') // "Jan 20"
 */
export function formatDate(date, formatStr = "MMMM d, yyyy") {
  if (!date) return "";

  const dateObj = parseLocalDate(date);
  return format(dateObj, formatStr);
}

/**
 * Check if a date is in the future.
 *
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the future
 */
export function isFutureDate(date) {
  if (!date) return false;

  const dateObj = parseLocalDate(date);
  return dateObj > new Date();
}

/**
 * Check if a date is in the past.
 *
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export function isPastDate(date) {
  if (!date) return false;

  const dateObj = parseLocalDate(date);
  return dateObj < new Date();
}

/**
 * Get the year from a date.
 *
 * @param {Date|string} date - The date to extract the year from
 * @returns {number} The year
 */
export function getYear(date) {
  if (!date) return new Date().getFullYear();

  const dateObj = parseLocalDate(date);
  return dateObj.getFullYear();
}
