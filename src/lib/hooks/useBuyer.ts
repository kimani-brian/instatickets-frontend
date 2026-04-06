"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { getErrorMessage } from "@/lib/api/client";
import type { Order } from "@/types";

// ── Query keys ───────────────────────────────────────────────────────────────
export const buyerKeys = {
  all: ["buyer"] as const,
  orders: () => [...buyerKeys.all, "orders"] as const,
  order: (id: string) => [...buyerKeys.all, "order", id] as const,
  tickets: (orderId: string) =>
    [...buyerKeys.all, "tickets", orderId] as const,
};

// ── Fetch single order ────────────────────────────────────────────────────────
export function useBuyerOrder(orderId: string) {
  return useQuery({
    queryKey: buyerKeys.order(orderId),
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId,
    // Poll PENDING orders so status updates automatically
    refetchInterval: (query) => {
      const data = query.state.data as Order | undefined;
      return data?.status === "PENDING" ? 5000 : false;
    },
  });
}

// ── Fetch tickets for an order ────────────────────────────────────────────────
export function useOrderTickets(orderId: string, enabled = true) {
  return useQuery({
    queryKey: buyerKeys.tickets(orderId),
    queryFn: () => ordersApi.getTickets(orderId),
    enabled: enabled && !!orderId,
  });
}

// ── Simulate payment mutation ─────────────────────────────────────────────────
// Calls our Next.js API route which generates the HMAC on the server
export function useSimulatePayment(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Payment failed");
      }
      return res.json();
    },
    onSuccess: () => {
      // Refresh both the order and tickets
      queryClient.invalidateQueries({
        queryKey: buyerKeys.order(orderId),
      });
      queryClient.invalidateQueries({
        queryKey: buyerKeys.tickets(orderId),
      });
      toast.success("Payment confirmed! 🎉", {
        description: "Your tickets are ready below.",
      });
    },
    onError: (err) => {
      toast.error("Payment failed", {
        description: getErrorMessage(err),
      });
    },
  });
}