"use client";

import { Event } from "@/types";
import EventCard from "@/components/shared/EventCard";
import { EventCardSkeleton } from "@/components/shared/Skeleton";

interface EventGridProps {
  events: Event[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export default function EventGrid({
  events,
  isLoading = false,
  skeletonCount = 6,
}: EventGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
