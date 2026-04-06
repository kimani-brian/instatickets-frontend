"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Ticket,
  Mail,
  Loader2,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import OrderTimer from "@/components/checkout/OrderTimer";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import PaymentSimulator from "@/components/checkout/PaymentSimulator";
import SuccessView from "@/components/checkout/SuccessView";
import ExpiredView from "@/components/checkout/ExpiredView";
import QuantitySelector from "@/components/checkout/QuantitySelector";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import TierBadge from "@/components/shared/TierBadge";
import { eventsApi } from "@/lib/api/events";
import { useCartStore } from "@/lib/stores/cartStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { cn, formatPrice } from "@/lib/utils";
import type { TierWithAvailability } from "@/types";

export default function CheckoutPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { user } = useAuthStore();
  const { items, addItem, updateQuantity } =
    useCartStore();

  const [buyerEmail, setBuyerEmail] = useState(
    user?.email ?? ""
  );
  const [emailError, setEmailError] = useState("");

  // Fetch event and tiers
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsApi.getById(eventId),
    enabled: !!eventId,
  });

  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ["tiers", eventId],
    queryFn: () => eventsApi.getTiers(eventId),
    enabled: !!eventId,
  });

  const {
    step,
    order,
    paidOrder,
    tickets,
    secondsRemaining,
    startCheckout,
    simulatePayment,
    resetCheckout,
    isCheckingOut,
    isPaymentPending,
  } = useCheckout(eventId);

  const totalTickets = items.reduce((s, i) => s + i.quantity, 0);

  // Handle tier quantity changes
  const handleQuantityChange = (
    tier: TierWithAvailability,
    quantity: number
  ) => {
    if (quantity === 0) {
      updateQuantity(tier.id, 0);
    } else {
      const existing = items.find((i) => i.tier.id === tier.id);
      if (existing) {
        updateQuantity(tier.id, quantity);
      } else {
        addItem(tier, quantity);
      }
    }
  };

  const getQuantityForTier = (tierId: string) =>
    items.find((i) => i.tier.id === tierId)?.quantity ?? 0;

  // Email validation
  const validateEmail = () => {
    if (!buyerEmail) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleProceedToPayment = () => {
    if (!validateEmail()) return;
    if (totalTickets === 0) return;
    startCheckout(buyerEmail);
  };

  // Loading state
  if (eventLoading || tiersLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Event not found
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

  return (
    <div className="min-h-screen pb-20">
      {/* Back navigation */}
      <div className="page-container pt-6 pb-2">
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-1.5 text-sm
                     text-muted-foreground hover:text-foreground
                     transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {event.name}
        </Link>
      </div>

      <div className="page-container py-6">
        {/* ── SUCCESS STATE ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {step === "SUCCESS" && paidOrder && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SuccessView order={paidOrder} tickets={tickets} />
            </motion.div>
          )}

          {/* ── EXPIRED STATE ───────────────────────────────────────────── */}
          {step === "EXPIRED" && (
            <motion.div
              key="expired"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ExpiredView
                onRetry={resetCheckout}
                eventId={eventId}
              />
            </motion.div>
          )}

          {/* ── SELECTING / PROCESSING / PAYMENT STATES ─────────────────── */}
          {(step === "SELECTING" ||
            step === "PROCESSING" ||
            step === "PAYMENT") && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Page header */}
              <div className="mb-8 space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  Checkout
                </h1>
                <p className="text-muted-foreground">
                  {event.name}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5
                              gap-8 items-start">

                {/* ── LEFT — Ticket selection + email ─────────────────── */}
                <div className="lg:col-span-3 space-y-6">

                  {/* Ticket selection */}
                  {step === "SELECTING" || step === "PROCESSING" ? (
                    <div className="rounded-2xl border border-border/50
                                    bg-card p-6 space-y-5">
                      <h2 className="font-bold text-lg flex items-center
                                     gap-2">
                        <Ticket className="w-5 h-5 text-violet-500" />
                        Select tickets
                      </h2>

                      {tiers && tiers.length > 0 ? (
                        <div className="space-y-4">
                          {tiers.map((tier: TierWithAvailability) => {
                            const qty = getQuantityForTier(tier.id);
                            const isAvailable =
                              tier.availability === "AVAILABLE";

                            return (
                              <div
                                key={tier.id}
                                className={cn(
                                  "flex items-center justify-between",
                                  "gap-4 p-4 rounded-xl border",
                                  "transition-colors duration-200",
                                  qty > 0
                                    ? "border-violet-500/40 bg-violet-500/5"
                                    : "border-border/50 bg-background",
                                  !isAvailable && "opacity-50"
                                )}
                              >
                                {/* Tier info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center
                                                  gap-2 flex-wrap">
                                    <span className="font-semibold text-sm">
                                      {tier.name}
                                    </span>
                                    <TierBadge
                                      availability={tier.availability}
                                    />
                                  </div>
                                  <p className="text-base font-bold
                                                gradient-text mt-0.5">
                                    {formatPrice(tier.price)}
                                  </p>
                                  {isAvailable && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {tier.available_count} left
                                    </p>
                                  )}
                                </div>

                                {/* Quantity selector */}
                                {isAvailable ? (
                                  <QuantitySelector
                                    value={qty}
                                    min={0}
                                    max={Math.min(
                                      10,
                                      tier.available_count
                                    )}
                                    onChange={(q) =>
                                      handleQuantityChange(tier, q)
                                    }
                                  />
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-muted-foreground"
                                  >
                                    Unavailable
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No tiers available for this event.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {/* Email input */}
                  {(step === "SELECTING" ||
                    step === "PROCESSING") && (
                    <div className="rounded-2xl border border-border/50
                                    bg-card p-6 space-y-4">
                      <h2 className="font-bold text-lg flex items-center
                                     gap-2">
                        <Mail className="w-5 h-5 text-violet-500" />
                        Contact details
                      </h2>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm">
                          Email address
                          {user && (
                            <span className="text-xs text-muted-foreground
                                             ml-2 font-normal">
                              (from your account)
                            </span>
                          )}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={buyerEmail}
                          onChange={(e) => {
                            setBuyerEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          onBlur={validateEmail}
                          className={
                            emailError ? "border-destructive" : ""
                          }
                        />
                        {emailError && (
                          <p className="text-xs text-destructive">
                            {emailError}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Your tickets will be linked to this email.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Payment form — shown after order is created */}
                  {step === "PAYMENT" && order && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-border/50
                                 bg-card p-6 space-y-5"
                    >
                      <h2 className="font-bold text-lg">
                        Payment details
                      </h2>

                      {/* Countdown timer */}
                      <OrderTimer
                        secondsRemaining={secondsRemaining}
                        totalSeconds={600}
                      />

                      <Separator />

                      <PaymentSimulator
                        amount={order.total}
                        onPay={simulatePayment}
                        isLoading={isPaymentPending}
                      />
                    </motion.div>
                  )}
                </div>

                {/* ── RIGHT — Order summary (sticky) ──────────────────── */}
                <div className="lg:col-span-2">
                  <div className="sticky top-24 space-y-4">
                    {/* Summary card */}
                    <motion.div
                      layout
                      className="rounded-2xl border border-border/50
                                 bg-card p-6"
                    >
                      <CheckoutSummary items={items} />

                      {/* Proceed button — shown in SELECTING state */}
                      {(step === "SELECTING" ||
                        step === "PROCESSING") && (
                        <div className="mt-5 space-y-3">
                          <Separator />
                          <Button
                            onClick={handleProceedToPayment}
                            disabled={
                              totalTickets === 0 || isCheckingOut
                            }
                            className="w-full h-11 gradient-bg
                                       hover:opacity-90 transition-opacity
                                       gap-2 font-semibold"
                          >
                            {isCheckingOut ? (
                              <>
                                <Loader2
                                  className="w-4 h-4 animate-spin"
                                />
                                Reserving tickets...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                {totalTickets === 0
                                  ? "Select tickets to continue"
                                  : `Reserve ${totalTickets} ticket${
                                      totalTickets !== 1 ? "s" : ""
                                    }`}
                              </>
                            )}
                          </Button>

                          {totalTickets > 0 && (
                            <p className="text-xs text-muted-foreground
                                          text-center">
                              Tickets reserved for 10 minutes
                              after checkout
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: "🔒", label: "Secure payment" },
                        { icon: "⚡", label: "Instant delivery" },
                        { icon: "🎟️", label: "Valid tickets" },
                        { icon: "📱", label: "Mobile ready" },
                      ].map((badge) => (
                        <div
                          key={badge.label}
                          className="flex items-center gap-2
                                     rounded-xl border border-border/50
                                     bg-card/50 px-3 py-2.5"
                        >
                          <span className="text-base">{badge.icon}</span>
                          <span className="text-xs text-muted-foreground">
                            {badge.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}