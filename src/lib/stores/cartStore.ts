"use client";

import { create } from "zustand";
import type { CartItem, TierWithAvailability } from "@/types";

interface CartStore {
  items: CartItem[];
  eventId: string | null;

  addItem: (tier: TierWithAvailability, quantity: number) => void;
  removeItem: (tierId: string) => void;
  updateQuantity: (tierId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalTickets: () => number;
}

// Cart store — holds the buyer's in-progress ticket selection.
// Cleared after a successful checkout or when navigating away.
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  eventId: null,

  addItem: (tier, quantity) => {
    set((state) => {
      const existing = state.items.find((i) => i.tier.id === tier.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.tier.id === tier.id ? { ...i, quantity } : i
          ),
        };
      }
      return {
        items: [...state.items, { tier, quantity }],
        eventId: tier.event_id,
      };
    });
  },

  removeItem: (tierId) => {
    set((state) => ({
      items: state.items.filter((i) => i.tier.id !== tierId),
    }));
  },

  updateQuantity: (tierId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(tierId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.tier.id === tierId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [], eventId: null }),

  getTotalAmount: () => {
    return get().items.reduce(
      (sum, item) => sum + item.tier.price * item.quantity,
      0
    );
  },

  getTotalTickets: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));