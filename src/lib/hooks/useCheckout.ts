"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { useCartStore } from "@/lib/stores/cartStore";
import { getErrorMessage } from "@/lib/api/client";
import { secondsUntil } from "@/lib/utils";
import type {
  CheckoutResponse,
  Order,
  Ticket,
} from "@/types";

// The checkout flow has 5 distinct states.
// The UI renders a completely different view for each.
export type CheckoutStep =
  | "SELECTING"   // buyer is choosing quantities
  | "PROCESSING"  // checkout API call in flight
  | "PAYMENT"     // order created, awaiting payment
  | "SUCCESS"     // payment confirmed, tickets issued
  | "EXPIRED";    // 10-minute window passed

export interface CheckoutState {
  step: CheckoutStep;
  order: CheckoutResponse | null;
  paidOrder: Order | null;
  tickets: Ticket[];
  secondsRemaining: number;
  error: string | null;
}

export function useCheckout(eventId: string) {
  const { items, clearCart } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>("SELECTING");
  const [order, setOrder] = useState<CheckoutResponse | null>(null);
  const [paidOrder, setPaidOrder] = useState<Order | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ── Countdown timer ──────────────────────────────────────────────────────
  // Ticks every second when an order is PENDING.
  // Transitions to EXPIRED when the countdown hits 0.
  useEffect(() => {
    if (step !== "PAYMENT" || !order?.expires_at) return;

    const tick = () => {
      const secs = secondsUntil(order.expires_at);
      setSecondsRemaining(secs);
      if (secs <= 0) {
        setStep("EXPIRED");
      }
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [step, order?.expires_at]);

  // ── Checkout mutation ────────────────────────────────────────────────────
  const checkoutMutation = useMutation({
    mutationFn: ordersApi.checkout,
    onSuccess: (data) => {
      setOrder(data);
      setStep("PAYMENT");
      setSecondsRemaining(secondsUntil(data.expires_at));

      // ── Save order ID to localStorage so buyer dashboard can load it ──
      try {
        const existing = JSON.parse(
          localStorage.getItem("instatickets_order_ids") ?? "[]"
        ) as string[];
        if (!existing.includes(data.order_id)) {
          localStorage.setItem(
            "instatickets_order_ids",
            JSON.stringify([data.order_id, ...existing].slice(0, 50))
          );
        }
      } catch {
        // ignore storage errors
      }

      toast.success("Order reserved!", {
        description: "Complete payment within 10 minutes.",
      });
    },
    onError: (err) => {
      const msg = getErrorMessage(err);
      setError(msg);
      setStep("SELECTING");
      toast.error("Checkout failed", { description: msg });
    },
  });

  // ── Payment simulation mutation ──────────────────────────────────────────
  // In production this would redirect to M-Pesa / Stripe.
  // Here we call the backend webhook endpoint directly, generating
  // the HMAC signature on the server side via a Next.js API route.
  const paymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      // Call our Next.js API route that generates the HMAC and
      // forwards to the Go backend webhook endpoint
      const res = await fetch("/api/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Payment simulation failed");
      }
      return res.json();
    },
    onSuccess: async () => {
      if (!order) return;
      // Fetch the paid order and its tickets
      const [paidOrderData, ticketData] = await Promise.all([
        ordersApi.getById(order.order_id),
        ordersApi.getTickets(order.order_id),
      ]);
      setPaidOrder(paidOrderData);
      setTickets(ticketData);
      setStep("SUCCESS");
      clearCart();
      toast.success("Payment confirmed! 🎉", {
        description: `${ticketData.length} ticket(s) issued.`,
      });
    },
    onError: (err) => {
      toast.error("Payment failed", {
        description: getErrorMessage(err),
      });
    },
  });

  // ── Actions ──────────────────────────────────────────────────────────────

  const startCheckout = useCallback(
    (buyerEmail: string) => {
      if (items.length === 0) {
        toast.error("Please select at least one ticket");
        return;
      }
      setStep("PROCESSING");
      setError(null);
      checkoutMutation.mutate({
        event_id: eventId,
        buyer_email: buyerEmail,
        items: items.map((item) => ({
          tier_id: item.tier.id,
          quantity: item.quantity,
        })),
      });
    },
    [items, eventId, checkoutMutation]
  );

  const simulatePayment = useCallback(() => {
    if (!order) return;
    paymentMutation.mutate(order.order_id);
  }, [order, paymentMutation]);

  const resetCheckout = useCallback(() => {
    setStep("SELECTING");
    setOrder(null);
    setPaidOrder(null);
    setTickets([]);
    setError(null);
    setSecondsRemaining(0);
  }, []);

  return {
    // State
    step,
    order,
    paidOrder,
    tickets,
    items,
    secondsRemaining,
    error,
    // Actions
    startCheckout,
    simulatePayment,
    resetCheckout,
    // Loading flags
    isCheckingOut:
      checkoutMutation.isPending || step === "PROCESSING",
    isPaymentPending: paymentMutation.isPending,
  };
}