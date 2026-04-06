"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { eventsApi } from "@/lib/api/events";
import { getErrorMessage } from "@/lib/api/client";
import type {
  CreateEventPayload,
  UpdateEventPayload,
  Event,
} from "@/types";

// ── Query keys — centralised so invalidation is consistent ──────────────────
export const organizerKeys = {
  all: ["organizer"] as const,
  events: () => [...organizerKeys.all, "events"] as const,
  event: (id: string) => [...organizerKeys.all, "event", id] as const,
  orders: (eventId: string) =>
    [...organizerKeys.all, "orders", eventId] as const,
};

// ── Fetch all events for the organizer ──────────────────────────────────────
// Uses the public /events endpoint — the backend filters by organizer_id
// via the JWT token on the server side.
export function useOrganizerEvents() {
  return useQuery({
    queryKey: organizerKeys.events(),
    queryFn: () => eventsApi.list(1, 100),
    staleTime: 30_000,
  });
}

// ── Fetch a single event ─────────────────────────────────────────────────────
export function useOrganizerEvent(eventId: string) {
  return useQuery({
    queryKey: organizerKeys.event(eventId),
    queryFn: () => eventsApi.getById(eventId),
    enabled: !!eventId,
  });
}

// ── Fetch orders for one event ───────────────────────────────────────────────
export function useEventOrders(eventId: string) {
  return useQuery({
    queryKey: organizerKeys.orders(eventId),
    queryFn: () => eventsApi.getOrders(eventId),
    enabled: !!eventId,
    refetchInterval: 30_000, // poll every 30s for live updates
  });
}

// ── Create event mutation ────────────────────────────────────────────────────
export function useCreateEvent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) =>
      eventsApi.create(payload),
    onSuccess: (event: Event) => {
      // Invalidate the events list so the dashboard refreshes
      queryClient.invalidateQueries({
        queryKey: organizerKeys.events(),
      });
      toast.success("Event created!", {
        description: `"${event.name}" is now live.`,
      });
      router.push(`/organizer/events/${event.id}`);
    },
    onError: (err) => {
      toast.error("Failed to create event", {
        description: getErrorMessage(err),
      });
    },
  });
}

// ── Update event mutation ────────────────────────────────────────────────────
export function useUpdateEvent(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEventPayload) =>
      eventsApi.update(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizerKeys.event(eventId),
      });
      queryClient.invalidateQueries({
        queryKey: organizerKeys.events(),
      });
      toast.success("Event updated successfully");
    },
    onError: (err) => {
      toast.error("Failed to update event", {
        description: getErrorMessage(err),
      });
    },
  });
}

// ── Cancel event mutation ────────────────────────────────────────────────────
export function useCancelEvent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventsApi.cancel(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizerKeys.events(),
      });
      toast.success("Event cancelled");
      router.push("/organizer");
    },
    onError: (err) => {
      toast.error("Failed to cancel event", {
        description: getErrorMessage(err),
      });
    },
  });
}
