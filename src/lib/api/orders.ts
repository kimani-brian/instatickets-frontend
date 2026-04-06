import apiClient from "./client";
import type {
  CheckoutPayload,
  CheckoutResponse,
  Order,
  Ticket,
} from "@/types";

export const ordersApi = {
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    const { data } = await apiClient.post<CheckoutResponse>(
      "/orders/checkout",
      payload
    );
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<{ order: Order }>(`/orders/${id}`);
    return data.order;
  },

  getTickets: async (orderId: string): Promise<Ticket[]> => {
    const { data } = await apiClient.get<{ tickets: Ticket[] }>(
      `/orders/${orderId}/tickets`
    );
    return data.tickets;
  },
};