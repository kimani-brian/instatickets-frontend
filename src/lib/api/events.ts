import apiClient from "./client";
import type { Event, TierWithAvailability, CreateEventPayload, UpdateEventPayload, Order, EventsListResponse } from "@/types";

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const { data } = await apiClient.get<{ events: Event[] }>("/events");
    return data.events;
  },

  list: async (page: number, limit: number): Promise<EventsListResponse> => {
    const { data } = await apiClient.get<EventsListResponse>("/events", {
      params: { page, limit },
    });
    return data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<{ event: Event }>(`/events/${id}`);
    return data.event;
  },

  getTiers: async (eventId: string): Promise<TierWithAvailability[]> => {
    const { data } = await apiClient.get<{ tiers: TierWithAvailability[] }>(
      `/events/${eventId}/tiers`
    );
    return data.tiers;
  },

  create: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await apiClient.post<{ event: Event }>("/events", payload);
    return data.event;
  },

  update: async (
    eventId: string,
    payload: UpdateEventPayload
  ): Promise<Event> => {
    const { data } = await apiClient.put<{ event: Event }>(
      `/events/${eventId}`,
      payload
    );
    return data.event;
  },

  cancel: async (eventId: string): Promise<Event> => {
    const { data } = await apiClient.post<{ event: Event }>(
      `/events/${eventId}/cancel`,
      {}
    );
    return data.event;
  },

  getOrders: async (eventId: string): Promise<Order[]> => {
    const { data } = await apiClient.get<{ orders: Order[] }>(
      `/events/${eventId}/orders`
    );
    return data.orders;
  },
};
