"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart,
  AlertCircle,
  ChevronLeft,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EventHero from "@/components/events/EventHero";
import TierCard from "@/components/events/TierCard";
import EventDetailSkeleton from
  "@/components/events/EventDetailSkeleton";
import { eventsApi } from "@/lib/api/events";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { TierWithAvailability } from "@/types";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { items, addItem, removeItem } = useCartStore();

  const [selectedTiers, setSelectedTiers] = useState<Record<string, number>>({});

  // Fetch event and tiers in parallel
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsApi.getById(eventId),
    enabled: !!eventId,
  });

  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ["tiers", eventId],
    queryFn: () => eventsApi.getTiers(eventId),
    enabled: !!eventId,
    refetchInterval: 30_000, // refresh availability every 30 seconds
  });

  const isLoading = eventLoading || tiersLoading;

  if (isLoading) return <EventDetailSkeleton />;

  if (!event) {
    return (
      <div className="page-container py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold">Event not found</h2>
        <Button variant="outline" asChild>
          <Link href="/events">Back to events</Link>
        </Button>
      </div>
    );
  }

  const totalTickets = Object.values(selectedTiers).reduce(
    (a, b) => a + b, 0
  );
  const cartTotal = items.reduce(
    (sum, item) => sum + item.tier.price * item.quantity, 0
  );

  const handleCheckout = () => {
    if (totalTickets === 0) {
      toast.error("Please select at least one ticket");
      return;
    }
    router.push(`/events/${eventId}/checkout`);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Back link */}
      <div className="page-container pt-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm
                     text-muted-foreground hover:text-foreground
                     transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          All events
        </Link>
      </div>

      {/* Hero */}
      <EventHero event={event} />

      <div className="page-container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Tiers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Choose Your Tickets</h2>
              {tiers && tiers.length > 0 && (
                <span className="text-sm text-muted-foreground flex
                                 items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Updates every 30s
                </span>
              )}
            </div>

            {tiers && tiers.length > 0 ? (
              <div className="space-y-4">
                {tiers.map((tier: TierWithAvailability, index: number) => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    onSelect={(tierId: string, quantity: number) => {
                      if (quantity === 0) {
                        const next = { ...selectedTiers };
                        delete next[tierId];
                        setSelectedTiers(next);
                        removeItem(tierId);
                      } else {
                        setSelectedTiers({ ...selectedTiers, [tierId]: quantity });
                        const tierData = tiers.find((t) => t.id === tierId);
                        if (tierData) {
                          addItem(tierData, quantity);
                        }
                      }
                    }}
                    isSelected={!!selectedTiers[tier.id]}
                    selectedQuantity={selectedTiers[tier.id] ?? 0}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border/50
                              bg-card p-12 text-center">
                <p className="text-muted-foreground">
                  No ticket tiers available for this event.
                </p>
              </div>
            )}
          </div>

          {/* Right — Sticky order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="rounded-2xl border border-border/50 bg-card p-6
                           space-y-4"
              >
                <h3 className="font-bold text-lg">Order Summary</h3>

                {totalTickets === 0 ? (
                  <p className="text-sm text-muted-foreground py-4
                                text-center border border-dashed
                                border-border rounded-xl">
                    Select tickets to see summary
                  </p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.tier.id}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <span className="font-medium">
                            {item.tier.name}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            × {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium">
                          {formatPrice(item.tier.price * item.quantity)}
                        </span>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="gradient-text text-lg">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {totalTickets} ticket
                      {totalTickets !== 1 ? "s" : ""} selected.
                      You have 10 minutes to complete payment
                      after checkout.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={totalTickets === 0 ||
                    event.status === "CANCELLED"}
                  className="w-full gradient-bg hover:opacity-90
                             transition-opacity gap-2 h-11 font-semibold"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {event.status === "CANCELLED"
                    ? "Event Cancelled"
                    : `Checkout — ${formatPrice(cartTotal)}`}
                </Button>

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    "🔒 Secure checkout",
                    "⚡ Instant tickets",
                    "📱 Mobile ready",
                    "✅ Verified event",
                  ].map((badge) => (
                    <span
                      key={badge}
                      className="text-xs text-muted-foreground
                                 text-center py-1.5 rounded-lg
                                 bg-muted/50"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      {totalTickets > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4
                     bg-background/90 backdrop-blur-lg
                     border-t border-border/50 lg:hidden z-40"
        >
          <Button
            onClick={handleCheckout}
            className="w-full gradient-bg hover:opacity-90
                       gap-2 h-12 font-semibold text-base"
          >
            <ShoppingCart className="w-5 h-5" />
            Checkout · {totalTickets} ticket
            {totalTickets !== 1 ? "s" : ""} ·{" "}
            {formatPrice(cartTotal)}
          </Button>
        </motion.div>
      )}
    </div>
  );
}