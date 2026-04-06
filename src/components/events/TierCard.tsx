"use client";

import { motion } from "framer-motion";
import { TierWithAvailability } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuantitySelector from "@/components/checkout/QuantitySelector";
import { cn } from "@/lib/utils";

interface TierCardProps {
  tier: TierWithAvailability;
  onSelect: (tierId: string, quantity: number) => void;
  isSelected: boolean;
  selectedQuantity?: number;
  index?: number;
}

export default function TierCard({
  tier,
  onSelect,
  isSelected,
  selectedQuantity = 0,
  index = 0,
}: TierCardProps) {
  const isAvailable = tier.availability === "AVAILABLE";
  const isComingSoon = tier.availability === "COMING_SOON";
  const isSoldOut = tier.availability === "SOLD_OUT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "rounded-2xl border transition-all",
        isSelected
          ? "border-primary/50 bg-primary/5 ring-1 ring-primary"
          : "border-border/50 bg-card hover:border-border"
      )}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {tier.available_count} of {tier.total_quantity} available
            </p>
          </div>
          <Badge
            variant={
              isAvailable
                ? "default"
                : isComingSoon
                ? "secondary"
                : "outline"
            }
          >
            {tier.availability === "AVAILABLE"
              ? "Available"
              : tier.availability === "COMING_SOON"
              ? "Coming soon"
              : tier.availability === "SALE_ENDED"
              ? "Sale ended"
              : "Sold out"}
          </Badge>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">KES {tier.price.toLocaleString()}</span>
          <span className="text-muted-foreground">per ticket</span>
        </div>

        {/* Availability bar */}
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all",
                isAvailable ? "bg-emerald-500" : "bg-amber-500"
              )}
              style={{
                width: `${(tier.available_count / tier.total_quantity) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {isSoldOut ? (
              "Out of stock"
            ) : isComingSoon ? (
              `Available from ${
                tier.sale_start_date
                  ? new Date(tier.sale_start_date).toLocaleDateString()
                  : "TBA"
              }`
            ) : (
              <>
                {tier.available_count} tickets remaining
                {tier.sale_end_date && (
                  <> · Sale ends {new Date(tier.sale_end_date).toLocaleDateString()}</>
                )}
              </>
            )}
          </p>
        </div>

        {/* Selection controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {isAvailable && (
            <QuantitySelector
              value={selectedQuantity}
              max={Math.min(10, tier.available_count)}
              onChange={(qty) => onSelect(tier.id, qty)}
            />
          )}
          <Button
            disabled={!isAvailable}
            variant={isSelected ? "default" : "outline"}
            className="flex-1"
            onClick={() =>
              onSelect(tier.id, isSelected ? 0 : Math.min(1, tier.available_count))
            }
          >
            {isSelected ? "Selected" : isAvailable ? "Select" : "Unavailable"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
