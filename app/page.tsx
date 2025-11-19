import Image from 'next/image';

import { fetchEvents } from '../lib/api.ts';
import { EventsList } from '../components/EventsList.tsx';
import { EventDetail } from '../components/EventDetail.tsx';

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const events = await fetchEvents();
  const today = new Date();

  const upcomingEvents = events.filter(
    (event) => event.data.start && new Date(event.data.start) > today
  );
  const pastEvents = events.filter(
    (event) => event.data.start && new Date(event.data.start) <= today
  );

  // Sort upcoming events by start date (ascending)
  upcomingEvents.sort((a, b) => {
    if (!a.data.start || !b.data.start) return 0;
    return new Date(a.data.start).getTime() - new Date(b.data.start).getTime();
  });

  // Sort past events by start date (descending)
  pastEvents.sort((a, b) => {
    if (!a.data.start || !b.data.start) return 0;
    return new Date(b.data.start).getTime() - new Date(a.data.start).getTime();
  });

  const eventParam = params.event;
  const eventIdString = Array.isArray(eventParam) ? eventParam[0] : eventParam;
  const selectedEventId = eventIdString ? parseInt(eventIdString, 10) : null;
  const selectedEvent =
    selectedEventId !== null ? events.find((e) => e.id === selectedEventId) || null : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Image src="/logo.png" alt="Localhost Events" width={100} height={100} />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Localhost viðburðir</h1>
          <p className="text-gray-600">Viðburðir á döfinni</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {upcomingEvents.length > 0 && (
                <EventsList
                  events={upcomingEvents}
                  title="Viðburðir"
                  selectedEventId={selectedEventId}
                />
              )}
              {pastEvents.length > 0 && (
                <EventsList
                  events={pastEvents}
                  title="Gamlir viðburðir"
                  selectedEventId={selectedEventId}
                />
              )}
              {events.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No events available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Event Detail - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <EventDetail event={selectedEvent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
