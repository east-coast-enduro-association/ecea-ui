/**
 * Static ICS calendar feed endpoint
 * Generates an ICS file with all upcoming ECEA events for calendar subscriptions
 * This is prerendered at build time for static hosting
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateICSContent, type ICSEvent } from '../../utils/calendarUtils';

// Ensure this is prerendered at build time
export const prerender = true;

export const GET: APIRoute = async () => {
  // Fetch all events
  const allEvents = await getCollection('events', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  // Filter to upcoming events only
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingEvents = allEvents
    .filter(event => new Date(event.data.date) >= now)
    .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());

  // Convert to ICS format
  const calendarEvents: ICSEvent[] = upcomingEvents.map(event => ({
    title: event.data.title,
    date: event.data.date,
    endDate: event.data.endDate,
    location: event.data.location || '',
    summary: event.data.summary || '',
    slug: event.slug,
  }));

  const icsContent = generateICSContent(calendarEvents);

  return new Response(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ecea-events.ics"',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
