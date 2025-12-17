/**
 * Moto-Tally URL Generation Utilities
 * Generates URLs for Start Grid and Results pages on moto-tally.com
 */

import { MOTO_TALLY } from "./constants";

type EventType = "Enduro" | "Hare Scramble" | "FastKIDZ";

interface MotoTallyUrls {
  startGrid: string | null;
  results: string | null;
}

interface EventData {
  slug: string;
  data: {
    date: Date;
    eventType?: string;
    motoTallyId?: number | null;
  };
}

/**
 * Calculate motoTallyId for an event, accounting for manual overrides
 * @param event - The event to calculate ID for
 * @param allEvents - All events (needed to find same-series events)
 * @returns The calculated or manual motoTallyId, or null if not applicable
 */
export function calculateMotoTallyId(
  event: EventData,
  allEvents: EventData[]
): number | null {
  // Use manual override if provided
  if (event.data.motoTallyId) {
    return event.data.motoTallyId;
  }

  const eventType = event.data.eventType;
  if (!eventType || !supportsMotoTally(eventType)) {
    return null;
  }

  const eventYear = new Date(event.data.date).getFullYear();

  // Get same series events for this year
  const sameSeriesEvents = allEvents
    .filter(e =>
      e.data.eventType === eventType &&
      new Date(e.data.date).getFullYear() === eventYear
    )
    .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());

  // Collect all manually assigned IDs in this series/year
  const manualIds = new Set(
    sameSeriesEvents
      .filter(e => e.data.motoTallyId)
      .map(e => e.data.motoTallyId)
  );

  // Find this event's position among events WITHOUT manual IDs
  const eventsWithoutManualId = sameSeriesEvents.filter(e => !e.data.motoTallyId);
  const position = eventsWithoutManualId.findIndex(e => e.slug === event.slug);

  if (position === -1) {
    return null;
  }

  // Assign the next available ID, skipping any manually assigned ones
  let calculatedId = 0;
  let availableCount = 0;
  while (availableCount <= position) {
    calculatedId++;
    if (!manualIds.has(calculatedId)) {
      availableCount++;
    }
  }

  return calculatedId;
}

/**
 * Generate Moto-Tally URLs for an event
 * @param eventType - The type of event (Enduro, Hare Scramble, FastKIDZ)
 * @param year - The event year
 * @param motoTallyId - The EID (chronological event order within series for the year)
 * @returns Object with startGrid and results URLs, or null if not applicable
 */
export function getMotoTallyUrls(
  eventType: string | undefined,
  year: number,
  motoTallyId: number | null | undefined
): MotoTallyUrls {
  // Return nulls if no motoTallyId or unsupported event type
  if (!motoTallyId || !eventType) {
    return { startGrid: null, results: null };
  }

  const path = MOTO_TALLY.paths[eventType];
  if (!path) {
    return { startGrid: null, results: null };
  }

  const params = `?EY=${year}&EID=${motoTallyId}`;

  return {
    startGrid: `${MOTO_TALLY.baseUrl}/${path}/${MOTO_TALLY.pages.startGrid}${params}`,
    results: `${MOTO_TALLY.baseUrl}/${path}/${MOTO_TALLY.pages.results}${params}`,
  };
}

/**
 * Get Moto-Tally URLs for an event, auto-calculating the ID if needed
 * @param event - The event
 * @param allEvents - All events (needed for ID calculation)
 * @returns Object with startGrid and results URLs
 */
export function getEventMotoTallyUrls(
  event: EventData,
  allEvents: EventData[]
): MotoTallyUrls {
  const motoTallyId = calculateMotoTallyId(event, allEvents);
  const year = new Date(event.data.date).getFullYear();
  return getMotoTallyUrls(event.data.eventType, year, motoTallyId);
}

/**
 * Check if an event type supports Moto-Tally integration
 */
export function supportsMotoTally(eventType: string | undefined): boolean {
  if (!eventType) return false;
  return eventType in MOTO_TALLY.paths;
}
