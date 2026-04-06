"use client";

import { motion } from "framer-motion";
import { Check, Clock, CreditCard, Ticket, X } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  completedColor: string;
  completedBg: string;
}

const STEPS: TimelineStep[] = [
  {
    id: "created",
    label: "Order Created",
    description: "Tickets reserved for 10 minutes",
    icon: Ticket,
    completedColor: "text-violet-500",
    completedBg: "bg-violet-500",
  },
  {
    id: "payment",
    label: "Payment",
    description: "Payment confirmed by gateway",
    icon: CreditCard,
    completedColor: "text-blue-500",
    completedBg: "bg-blue-500",
  },
  {
    id: "tickets",
    label: "Tickets Issued",
    description: "Unique codes generated",
    icon: Check,
    completedColor: "text-emerald-500",
    completedBg: "bg-emerald-500",
  },
];

interface OrderStatusTimelineProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export default function OrderStatusTimeline({
  status,
  createdAt,
  updatedAt,
}: OrderStatusTimelineProps) {
  // Map order status to how many steps are complete
  const completedSteps =
    status === "PAID"
      ? 3
      : status === "PENDING"
      ? 1
      : 0;

  const isFailed =
    status === "EXPIRED" || status === "CANCELLED";

  return (
    <div className="space-y-1">
      {/* Failed state banner */}
      {isFailed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-destructive/20
                     bg-destructive/5 px-4 py-3 flex items-center
                     gap-3 mb-4"
        >
          <div className="w-8 h-8 rounded-full bg-destructive/10
                          flex items-center justify-center flex-shrink-0">
            <X className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-semibold text-destructive">
              Order {status === "EXPIRED" ? "Expired" : "Cancelled"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {status === "EXPIRED"
                ? "The 10-minute payment window passed and tickets were released."
                : "This order was cancelled."}
            </p>
          </div>
        </motion.div>
      )}

      {/* Timeline steps */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-4 top-8 bottom-8 w-px bg-border" />

        <div className="space-y-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isComplete = completedSteps > i;
            const isCurrent =
              completedSteps === i && !isFailed;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 relative"
              >
                {/* Step icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "border-2 flex-shrink-0 z-10 transition-all duration-500",
                    isComplete
                      ? `${step.completedBg} border-transparent`
                      : isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background"
                  )}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-primary
                                      animate-pulse" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>

                {/* Step text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isComplete
                        ? step.completedColor
                        : isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                  {/* Timestamp on completed steps */}
                  {isComplete && i === 0 && (
                    <p className="text-xs text-muted-foreground mt-1
                                  font-mono">
                      {formatDateTime(createdAt)}
                    </p>
                  )}
                  {isComplete && i === 2 && updatedAt && (
                    <p className="text-xs text-muted-foreground mt-1
                                  font-mono">
                      {formatDateTime(updatedAt)}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}