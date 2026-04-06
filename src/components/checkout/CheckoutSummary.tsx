"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Ticket, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CheckoutSummaryProps {
  items: CartItem[];
  className?: string;
}

export default function CheckoutSummary({
  items,
  className,
}: CheckoutSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.tier.price * item.quantity,
    0
  );
  const totalTickets = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">Order Summary</h3>
          <Badge variant="outline" className="gap-1 text-xs">
            <Ticket className="w-3 h-3" />
            {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Line items */}
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.tier.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-sm">
                      {item.tier.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0
                                 border-violet-500/30 text-violet-500
                                 bg-violet-500/5"
                    >
                      ×{item.quantity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatPrice(item.tier.price)} each
                  </p>
                </div>
                <span className="font-semibold text-sm flex-shrink-0">
                  {formatPrice(item.tier.price * item.quantity)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Processing fee
            </span>
            <span className="text-emerald-500 text-xs font-medium">
              FREE
            </span>
          </div>

          <Separator />

          <div className="flex justify-between items-baseline">
            <span className="font-bold">Total</span>
            <span className="text-xl font-bold gradient-text">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-xs text-muted-foreground text-center pt-1">
          🔒 Payment secured by InstaTickets
        </p>
      </div>
    </div>
  );
}