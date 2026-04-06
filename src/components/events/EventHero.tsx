"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Share2,
  Heart,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime, getEventImageUrl } from "@/lib/utils";
import type { Event } from "@/types";

interface EventHeroProps {
  event: Event;
}

export default function EventHero({ event }: EventHeroProps) {
  const imageUrl = getEventImageUrl(event.id, 1400, 500);
  const isCancelled = event.status === "CANCELLED";

  return (
    <div className="relative">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t
                        from-background via-background/60 to-transparent" />

        {/* Side gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r
                        from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content overlaid on the bottom of the image */}
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative -mt-32 md:-mt-44 pb-8 space-y-4"
        >
          {/* Status badge */}
          {isCancelled && (
            <Badge className="bg-destructive text-destructive-foreground">
              Event Cancelled
            </Badge>
          )}

          {/* Event name */}
          <h1 className={cn(
            "text-3xl md:text-5xl font-bold leading-tight",
            "text-balance drop-shadow-lg"
          )}>
            {event.name}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4 text-violet-400" />
              {formatDateTime(event.event_date)}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4 text-fuchsia-400" />
              {event.venue}
            </span>
            {event.ticket_tiers && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Ticket className="w-4 h-4 text-amber-400" />
                {event.ticket_tiers.length} ticket tier
                {event.ticket_tiers.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: event.name,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-lg"
            >
              <Heart className="w-3.5 h-3.5" />
              Save
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}