"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TierWithAvailability } from "@/types";

interface InventoryBarProps {
  tier: TierWithAvailability;
  showLabels?: boolean;
  compact?: boolean;
}

export default function InventoryBar({
  tier,
  showLabels = true,
  compact = false,
}: InventoryBarProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const soldPercent = Math.min(
    100,
    (tier.quantity_sold / tier.total_quantity) * 100
  );
  const lockedPercent = Math.min(
    100 - soldPercent,
    (tier.locked_quantity / tier.total_quantity) * 100
  );

  return (
    <div ref={ref} className="space-y-2">
      {showLabels && !compact && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{tier.name}</span>
          <span className="text-muted-foreground text-xs">
            {tier.quantity_sold + tier.locked_quantity} /{" "}
            {tier.total_quantity} reserved
          </span>
        </div>
      )}

      {/* Stacked progress bar */}
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          compact ? "h-2" : "h-3"
        )}
      >
        <div className="h-full flex">
          {/* Sold — violet */}
          <motion.div
            className="h-full bg-violet-500 flex-shrink-0"
            initial={{ width: 0 }}
            animate={inView ? { width: `${soldPercent}%` } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Locked (pending) — amber */}
          <motion.div
            className="h-full bg-amber-500/70 flex-shrink-0"
            initial={{ width: 0 }}
            animate={
              inView ? { width: `${lockedPercent}%` } : {}
            }
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          />
          {/* Available — muted (implicit via background) */}
        </div>
      </div>

      {/* Legend */}
      {showLabels && !compact && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            {tier.quantity_sold} sold
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            {tier.locked_quantity} pending
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            {tier.available_count} available
          </span>
        </div>
      )}
    </div>
  );
}