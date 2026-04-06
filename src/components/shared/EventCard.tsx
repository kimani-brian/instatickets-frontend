"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Calendar, Ticket, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatPrice, getEventImageUrl } from "@/lib/utils";
import type { Event, TierWithAvailability } from "@/types";

interface EventCardProps {
  event: Event;
  tiers?: TierWithAvailability[];
  index?: number;
}

export default function EventCard({
  event,
  tiers,
  index = 0,
}: EventCardProps) {
  const imageUrl = getEventImageUrl(event.id);

  // Find the lowest available price across tiers
  const availableTiers = tiers?.filter(
    (t) => t.availability === "AVAILABLE"
  );
  const lowestPrice = availableTiers?.length
    ? Math.min(...availableTiers.map((t) => t.price))
    : tiers?.length
    ? Math.min(...tiers.map((t) => t.price))
    : null;

  const isSoldOut =
    (tiers?.length ?? 0) > 0 &&
    tiers!.every((t) => t.availability === "SOLD_OUT");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/events/${event.id}`} className="group block h-full">
        <div
          className={cn(
            "relative h-full rounded-2xl overflow-hidden border border-border/50",
            "bg-card transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10",
            "hover:border-violet-500/30"
          )}
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-500
                         group-hover:scale-105"
              sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 50vw, 33vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t
                            from-black/60 via-transparent to-transparent" />

            {/* Sold out overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/60 flex items-center
                              justify-center">
                <span className="text-white font-bold text-lg tracking-wider
                                 uppercase border-2 border-white/50 px-4 py-1
                                 rounded-lg rotate-[-12deg]">
                  Sold Out
                </span>
              </div>
            )}

            {/* Price badge — bottom left of image */}
            {lowestPrice !== null && !isSoldOut && (
              <div className="absolute bottom-3 left-3">
                <span className="gradient-bg text-white text-xs font-bold
                                 px-3 py-1.5 rounded-full shadow-lg">
                  From {formatPrice(lowestPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            {/* Event name */}
            <h3 className="font-bold text-base leading-snug
                           group-hover:text-primary transition-colors
                           line-clamp-2">
              {event.name}
            </h3>

            {/* Meta info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs
                              text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0
                                     text-violet-500" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs
                              text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0
                                   text-fuchsia-500" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* Tier badges */}
            {tiers && tiers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tiers.slice(0, 3).map((tier) => (
                  <Badge
                    key={tier.id}
                    variant="outline"
                    className={cn(
                      "text-xs px-2 py-0.5",
                      tier.availability === "AVAILABLE"
                        ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                        : tier.availability === "COMING_SOON"
                        ? "border-amber-500/30 text-amber-500 bg-amber-500/5"
                        : "border-zinc-500/30 text-zinc-400 bg-zinc-500/5"
                    )}
                  >
                    {tier.name}
                  </Badge>
                ))}
                {tiers.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{tiers.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* CTA row */}
            <div className="flex items-center justify-between pt-2
                            border-t border-border/50">
              <div className="flex items-center gap-1 text-xs
                              text-muted-foreground">
                <Ticket className="w-3.5 h-3.5" />
                <span>
                  {tiers?.length ?? 0} tier
                  {(tiers?.length ?? 0) !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium
                               text-primary group-hover:gap-2 transition-all">
                View details
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Hover glow border */}
          <div className="absolute inset-0 rounded-2xl opacity-0
                          group-hover:opacity-100 transition-opacity
                          duration-300 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.05), " +
                "rgba(192,38,211,0.05))",
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}