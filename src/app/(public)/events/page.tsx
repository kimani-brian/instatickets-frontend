"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Ticket, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventGrid from "@/components/events/EventGrid";
import EventFilters from "@/components/events/EventFilters";
import { eventsApi } from "@/lib/api/events";
import type { EventsListResponse } from "@/types";

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 9;

  // Fetch events from the API
  const { data, isLoading, isError } = useQuery<EventsListResponse>({
    queryKey: ["events", page, pageSize],
    queryFn: () => eventsApi.list(page, pageSize),
  });

  // Client-side search filter
  // In production you'd add a search param to the API
  const filteredEvents = (() => {
    if (!data?.events) return [];
    if (!search.trim()) return data.events;
    const lower = search.toLowerCase();
    return data.events.filter(
      (e) =>
        e.name.toLowerCase().includes(lower) ||
        e.venue.toLowerCase().includes(lower) ||
        e.description?.toLowerCase().includes(lower)
    );
  })();

  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="gradient-bg-subtle border-b border-border/50">
        <div className="page-container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Label */}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-500 uppercase
                               tracking-wider">
                Live Events
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Discover{" "}
              <span className="gradient-text">Amazing Events</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              From tech conferences to music festivals — find your next
              unforgettable experience.
            </p>

            {/* Stats row */}
            {data && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-violet-400" />
                  <strong className="text-foreground">{data.total}</strong>
                  {" "}events available
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8"
          >
            <EventFilters
              search={search}
              onSearchChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Event grid */}
      <div className="page-container py-10">
        {isError ? (
          <div className="flex flex-col items-center justify-center
                          py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10
                            flex items-center justify-center">
              <Ticket className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">
                Failed to load events
              </h3>
              <p className="text-muted-foreground text-sm">
                Make sure the InstaTickets API is running on port 8080.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <EventGrid
            events={filteredEvents}
            isLoading={isLoading}
            skeletonCount={pageSize}
          />
        )}

        {/* Pagination */}
        {!isLoading && !search && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, page - 3),
                  Math.min(totalPages, page + 2)
                )
                .map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={p === page ? "gradient-bg border-0" : ""}
                  >
                    {p}
                  </Button>
                ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}