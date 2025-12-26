/**
 * Collection Utility Functions
 * Reusable helpers for working with Astro content collections
 */

import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

/**
 * Filter function for draft content
 * In production: only show non-draft items
 * In development: show all items
 */
export function getDraftFilter<T extends { draft?: boolean }>() {
  return ({ data }: { data: T }) => {
    return import.meta.env.PROD ? !data.draft : true;
  };
}

/**
 * Sort items by date (ascending - oldest first)
 */
export function sortByDateAsc<T extends { data: { date: Date } }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()
  );
}

/**
 * Sort items by date (descending - newest first)
 */
export function sortByDateDesc<T extends { data: { date: Date } }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

/**
 * Sort blog posts by pubDate (descending - newest first)
 */
export function sortByPubDateDesc<T extends { data: { pubDate: Date } }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );
}

/**
 * Filter events to only future events (date >= today)
 */
export function filterFutureEvents<T extends { data: { date: Date } }>(items: T[]): T[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return items.filter((item) => new Date(item.data.date) >= now);
}

/**
 * Filter events to only past events (date < today)
 */
export function filterPastEvents<T extends { data: { date: Date } }>(items: T[]): T[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return items.filter((item) => new Date(item.data.date) < now);
}

/**
 * Get upcoming events (future, sorted by date ascending)
 */
export function getUpcomingEvents<T extends { data: { date: Date } }>(items: T[]): T[] {
  return sortByDateAsc(filterFutureEvents(items));
}

/**
 * Get past events (past, sorted by date descending)
 */
export function getPastEvents<T extends { data: { date: Date } }>(items: T[]): T[] {
  return sortByDateDesc(filterPastEvents(items));
}

/**
 * Create a club logo map from clubs collection
 * Maps club abbreviation to logo image
 */
export async function getClubLogoMap(): Promise<Record<string, any>> {
  const clubs = await getCollection("clubs");
  return Object.fromEntries(
    clubs
      .filter((club) => club.data.abbreviatedName && club.data.logo)
      .map((club) => [club.data.abbreviatedName, club.data.logo])
  );
}

/**
 * Create a club name map from clubs collection
 * Maps club abbreviation to full name
 */
export async function getClubNameMap(): Promise<Record<string, string>> {
  const clubs = await getCollection("clubs");
  return Object.fromEntries(
    clubs
      .filter((club) => club.data.abbreviatedName)
      .map((club) => [club.data.abbreviatedName, club.data.name])
  );
}

/**
 * Get events filtered by type
 */
export function filterByEventType<T extends { data: { eventType?: string } }>(
  items: T[],
  eventType: string
): T[] {
  return items.filter((item) => item.data.eventType === eventType);
}

/**
 * Get events filtered by hosting club
 */
export function filterByHostingClub<T extends { data: { hostingClubs?: string[] } }>(
  items: T[],
  clubAbbr: string
): T[] {
  return items.filter((item) => item.data.hostingClubs?.includes(clubAbbr));
}
