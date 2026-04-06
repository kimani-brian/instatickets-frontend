"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Ticket,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CreateEventFormData } from "@/lib/validators/eventSchemas";

// Tier color themes — each tier gets a unique visual identity
const TIER_THEMES = [
  {
    name: "VIP",
    border: "border-violet-500/40",
    bg: "bg-violet-500/5",
    badge: "bg-violet-500/10 text-violet-500",
    dot: "bg-violet-500",
  },
  {
    name: "Regular",
    border: "border-blue-500/40",
    bg: "bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-500",
    dot: "bg-blue-500",
  },
  {
    name: "Early Bird",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-500",
    dot: "bg-emerald-500",
  },
  {
    name: "Student",
    border: "border-amber-500/40",
    bg: "bg-amber-500/5",
    badge: "bg-amber-500/10 text-amber-500",
    dot: "bg-amber-500",
  },
];

// Default tiers to suggest when adding a new one
const DEFAULT_TIER_NAMES = [
  "VIP",
  "Regular",
  "Early Bird",
  "Student",
  "Group",
  "Premium",
];

export default function TierBuilder() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateEventFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tiers",
  });

  const handleAddTier = () => {
    append({
      name: DEFAULT_TIER_NAMES[fields.length] ?? "New Tier",
      price: 0,
      total_quantity: 100,
      sale_start_date: null,
      sale_end_date: null,
    });
  };

  const tierErrors = errors.tiers;

  return (
    <div className="space-y-4">
      {/* Top-level tier array error */}
      {typeof tierErrors === "object" && "message" in tierErrors && (
        <p className="text-sm text-destructive">
          {tierErrors.message as string}
        </p>
      )}

      <AnimatePresence>
        {fields.map((field, index) => {
          const theme = TIER_THEMES[index % TIER_THEMES.length];
          const tierError = Array.isArray(tierErrors)
            ? tierErrors[index]
            : undefined;

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={cn(
                  "rounded-2xl border-2 p-5 space-y-4",
                  "transition-colors duration-200",
                  theme.border,
                  theme.bg
                )}
              >
                {/* Tier header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        theme.dot
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-lg",
                        theme.badge
                      )}
                    >
                      Tier {index + 1}
                    </span>
                  </div>

                  {/* Remove button — only show if more than 1 tier */}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="w-8 h-8 text-muted-foreground
                                 hover:text-destructive
                                 hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                {/* Row 1 — Name, Price, Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium
                                      text-muted-foreground uppercase
                                      tracking-wide flex items-center gap-1">
                      <Ticket className="w-3 h-3" />
                      Tier Name
                    </Label>
                    <Input
                      placeholder="e.g. VIP, Regular"
                      {...register(`tiers.${index}.name`)}
                      className={cn(
                        "bg-background/70",
                        tierError?.name && "border-destructive"
                      )}
                    />
                    {tierError?.name && (
                      <p className="text-xs text-destructive">
                        {tierError.name.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium
                                      text-muted-foreground uppercase
                                      tracking-wide flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Price (KES)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register(`tiers.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      className={cn(
                        "bg-background/70",
                        tierError?.price && "border-destructive"
                      )}
                    />
                    {tierError?.price && (
                      <p className="text-xs text-destructive">
                        {tierError.price.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium
                                      text-muted-foreground uppercase
                                      tracking-wide flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Total Tickets
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="100"
                      {...register(`tiers.${index}.total_quantity`, {
                        valueAsNumber: true,
                      })}
                      className={cn(
                        "bg-background/70",
                        tierError?.total_quantity && "border-destructive"
                      )}
                    />
                    {tierError?.total_quantity && (
                      <p className="text-xs text-destructive">
                        {tierError.total_quantity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2 — Sale dates (optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium
                                      text-muted-foreground uppercase
                                      tracking-wide flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Sale Opens (optional)
                    </Label>
                    <Input
                      type="datetime-local"
                      {...register(`tiers.${index}.sale_start_date`)}
                      className="bg-background/70"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium
                                      text-muted-foreground uppercase
                                      tracking-wide flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Sale Closes (optional)
                    </Label>
                    <Input
                      type="datetime-local"
                      {...register(`tiers.${index}.sale_end_date`)}
                      className="bg-background/70"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add tier button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddTier}
        className="w-full border-dashed border-2 border-border
                   hover:border-violet-500/50 hover:bg-violet-500/5
                   hover:text-violet-500 gap-2 h-12 font-medium
                   transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Add another tier
      </Button>
    </div>
  );
}