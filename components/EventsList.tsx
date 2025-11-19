"use client";

import { Event } from "@/types/event.ts";
import { formatDate } from "@/lib/utils.ts";
import { useRouter } from "next/navigation";

interface EventsListProps {
  events: Event[];
  title: string;
  selectedEventId: number | null;
}

export function EventsList({ events, title, selectedEventId }: EventsListProps) {
  const router = useRouter();

  const handleEventClick = (eventId: number) => {
    router.push(`/?event=${eventId}`, { scroll: false });
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => handleEventClick(event.id)}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
              selectedEventId === event.id
                ? "bg-blue-50 border-blue-300 shadow-md"
                : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className="font-semibold text-gray-900 mb-1">
              {event.title}
            </div>
            {event.data.start && (
              <div className="text-sm text-gray-600">
                {formatDate(event.data.start)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

