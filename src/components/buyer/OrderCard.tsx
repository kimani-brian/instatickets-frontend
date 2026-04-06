"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Ticket,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrderTimer from "@/components/checkout/OrderTimer";
import {
  cn,
  formatPrice,
  formatDateTime,
  orderStatusColor,
  secondsUntil,
} from "@/lib/utils";
import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
  index?: number;
}

const STATUS_ICONS = {
  PENDING: Clock,
  PAID: CheckCircle,
  EXPIRED: XCircle,
  CANCELLED: XCircle,
} as const;

const STATUS_LABELS = {
  PENDING: "Awaiting Payment",
  PAID: "Paid",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
} as const;

export default function OrderCard({
  order,
  index = 0,
}: OrderCardProps) {
  const StatusIcon = STATUS_ICONS[order.status];
  const isPending = order.status === "PENDING";
  const isPaid = order.status === "PAID";
  const secondsLeft = isPending
    ? secondsUntil(order.expires_at)
    : 0;
  const totalTickets =
    order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className={cn(
        "rounded-2xl border bg-card overflow-hidden",
        "transition-all duration-200",
        isPending
          ? "border-amber-500/30 hover:border-amber-500/50"
          : isPaid
          ? "border-emerald-500/20 hover:border-emerald-500/30"
          : "border-border/50 opacity-70"
      )}
    >
      {/* Status top bar */}
      <div
        className={cn(
          "h-1",
          isPending
            ? "bg-amber-500"
            : isPaid
            ? "gradient-bg"
            : "bg-border"
        )}
      />

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center",
                "justify-center flex-shrink-0",
                isPending
                  ? "bg-amber-500/10"
                  : isPaid
                  ? "bg-emerald-500/10"
                  : "bg-muted"
              )}
            >
              <StatusIcon
                className={cn(
                  "w-4 h-4",
                  isPending
                    ? "text-amber-500"
                    : isPaid
                    ? "text-emerald-500"
                    : "text-muted-foreground"
                )}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <code className="font-mono text-xs font-bold">
                  #{order.id.slice(0, 8).toUpperCase()}
                </code>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs border",
                    orderStatusColor(order.status)
                  )}
                >
                  {STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDateTime(order.created_at)}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-sm">
              {formatPrice(order.total_amount)}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Order items */}
        {order.items && order.items.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {order.items.map((item) => (
              <span
                key={item.id}
                className="text-xs bg-muted px-2.5 py-1 rounded-lg
                           text-muted-foreground"
              >
                {item.tier?.name ?? "Ticket"} ×{item.quantity}
              </span>
            ))}
          </div>
        )}

        {/* Countdown for pending orders */}
        {isPending && secondsLeft > 0 && (
          <OrderTimer secondsRemaining={secondsLeft} />
        )}

        {/* Expired notice */}
        {order.status === "EXPIRED" && (
          <div className="rounded-xl border border-destructive/20
                          bg-destructive/5 px-3 py-2.5 text-xs
                          text-destructive/80">
            This order expired. Your tickets were released back to
            the pool.
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-end">
          <Button
            variant={isPaid ? "default" : "outline"}
            size="sm"
            className={cn(
              "gap-1.5 text-xs h-8",
              isPaid && "gradient-bg border-0 hover:opacity-90"
            )}
            asChild
          >
            <Link href={`/buyer/orders/${order.id}`}>
              {isPaid ? (
                <>
                  <Ticket className="w-3.5 h-3.5" />
                  View tickets
                </>
              ) : (
                <>
                  View details
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}