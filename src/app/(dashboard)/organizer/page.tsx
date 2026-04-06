"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  MapPin,
  Ticket,
  TrendingUp,
  BarChart3,
  ShoppingBag,
  Eye,
  ArrowRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/dashboard/StatsCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useOrganizerEvents } from "@/lib/hooks/useOrganizer";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  cn,
  formatDate,
  getEventImageUrl,
} from "@/lib/utils";
import type { Event } from "@/types";

// Single event row in the events list
function EventRow({
  event,
  index,
}: {
  event: Event;
  index: number;
}) {
  const isActive = event.status === "ACTIVE";
  const totalCapacity =
    event.ticket_tiers?.reduce(
      (s, t) => s + t.total_quantity,
      0
    ) ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-2xl border",
        "transition-all duration-200 bg-card",
        isActive
          ? "border-border/50 hover:border-violet-500/30"
          : "border-border/30 opacity-60"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden
                      flex-shrink-0">
        <Image
          src={getEventImageUrl(event.id, 80, 80)}
          alt={event.name}
          fill
          className="object-cover"
          sizes="64px"
        />
        {!isActive && (
          <div className="absolute inset-0 bg-background/60
                          flex items-center justify-center">
            <span className="text-[9px] font-bold text-muted-foreground
                             uppercase tracking-wider">
              Cancelled
            </span>
          </div>
        )}
      </div>

      {/* Event info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm truncate">
            {event.name}
          </p>
          {!isActive && (
            <Badge
              variant="outline"
              className="text-xs text-destructive border-destructive/30"
            >
              Cancelled
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs
                        text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(event.event_date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[120px]">
              {event.venue}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {totalCapacity.toLocaleString()} tickets
          </span>
        </div>
      </div>

      {/* Tier count badge */}
      <Badge
        variant="outline"
        className="text-xs hidden sm:flex gap-1 flex-shrink-0"
      >
        <Ticket className="w-3 h-3" />
        {event.ticket_tiers?.length ?? 0} tier
        {(event.ticket_tiers?.length ?? 0) !== 1 ? "s" : ""}
      </Badge>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex gap-1.5 text-xs h-8"
          asChild
        >
          <Link href={`/organizer/events/${event.id}/orders`}>
            <ShoppingBag className="w-3.5 h-3.5" />
            Orders
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8"
          asChild
        >
          <Link href={`/organizer/events/${event.id}`}>
            <Eye className="w-3.5 h-3.5" />
            Manage
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export default function OrganizerDashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useOrganizerEvents();

  const events = useMemo(() => data?.events ?? [], [data?.events]);

  // Compute dashboard stats from events data
  const stats = useMemo(() => {
    const active = events.filter((e: Event) => e.status === "ACTIVE");
    const totalCapacity = events.reduce(
      (s: number, e: Event) =>
        s +
        (e.ticket_tiers?.reduce((ts: number, t) => ts + t.total_quantity, 0) ??
          0),
      0
    );

    return {
      totalEvents: events.length,
      activeEvents: active.length,
      totalCapacity,
    };
  }, [events]);

  const firstName =
    user?.email?.split("@")[0] ?? "Organizer";

  return (
    <div className="min-h-screen">
      {/* Dashboard header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="page-container py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-violet-500" />
                Organizer Dashboard
              </p>
              <h1 className="text-2xl font-bold">
                Welcome back,{" "}
                <span className="gradient-text capitalize">
                  {firstName}
                </span>{" "}
                👋
              </h1>
            </div>

            <Button
              className="gradient-bg hover:opacity-90 gap-2
                         font-semibold shadow-lg shadow-violet-500/20"
              asChild
            >
              <Link href="/organizer/events/new">
                <Plus className="w-4 h-4" />
                Create Event
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="page-container py-8 space-y-8">

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Events"
            value={stats.totalEvents}
            icon={Calendar}
            iconColor="text-violet-500"
            iconBg="bg-violet-500/10"
            index={0}
            subtitle={`${stats.activeEvents} currently active`}
          />
          <StatsCard
            title="Total Capacity"
            value={stats.totalCapacity}
            icon={Users}
            iconColor="text-blue-500"
            iconBg="bg-blue-500/10"
            index={1}
            subtitle="tickets across all events"
          />
          <StatsCard
            title="Active Events"
            value={stats.activeEvents}
            icon={TrendingUp}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10"
            index={2}
            subtitle="currently accepting sales"
          />
        </div>

        {/* Events list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Your Events</h2>
            {events.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                asChild
              >
                <Link href="/organizer/events/new">
                  <Plus className="w-3.5 h-3.5" />
                  New event
                </Link>
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="md" />
            </div>
          ) : events.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center
                         py-20 text-center rounded-2xl border-2
                         border-dashed border-border"
            >
              <div
                className="w-16 h-16 rounded-2xl gradient-bg-subtle
                            border border-violet-500/20 flex items-center
                            justify-center mb-4"
              >
                <Calendar className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                No events yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs
                            mb-6 leading-relaxed">
                Create your first event and start selling tickets in
                minutes.
              </p>
              <Button
                className="gradient-bg hover:opacity-90 gap-2"
                asChild
              >
                <Link href="/organizer/events/new">
                  <Plus className="w-4 h-4" />
                  Create your first event
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {events.map((event: Event, i: number) => (
                <EventRow key={event.id} event={event} index={i} />
              ))}

              {/* View all events link */}
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                  asChild
                >
                  <Link href="/events">
                    Browse public events
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}