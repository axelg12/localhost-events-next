import { Event } from '@/types/event.ts';

const API_URL = 'https://apis-is.koddsson.deno.net/x/meetups';

export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = (await response.json()) as Event[];

    // Generate IDs for events (since API doesn't provide them)
    // Using a simple hash based on title + start date
    return data.map((event: Event, index: number) => ({
      id: generateEventId(event, index),
      title: event.title,
      description: event.description || null,
      url: event.url,
      data: {
        start: event.data?.start || null,
        end: event.data?.end || null,
      },
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

function generateEventId(event: Event, index: number): number {
  // Create a simple hash from title + start date
  const str = `${event.title}-${event.data?.start || index}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
