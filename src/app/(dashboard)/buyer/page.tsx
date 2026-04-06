"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderCard from "@/components/buyer/OrderCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuthStore } from "@/lib/stores/authStore";
import { ordersApi } from "@/lib/api/orders";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

// Tab definition
type TabId = "all" | "pending" | "paid" | "expired";

const TABS: Array<{
  id: TabId;
  label: string;
  icon: React.ElementType;
  status?: OrderStatus;
  color: string;
}> = [
  {
    id: "all",
    label: "All",
    icon: ShoppingBag,
    color: "text-muted-foreground",
  },
  {
    id: "pending",
    label: "Pending",
    icon: Clock,
    status: "PENDING",
    color: "text-amber-500",
  },
  {
    id: "paid",
    label: "Paid",
    icon: CheckCircle,
    status: "PAID",
    color: "text-emerald-500",
  },
  {
    id: "expired",
    label: "Expired",
    icon: XCircle,
    status: "EXPIRED",
    color: "text-muted-foreground",
  },
];

// Hook to load all orders from localStorage-stored order IDs
// In a real app the backend would have a "my orders" endpoint.
// We work around this by storing order IDs after checkout.
function useMyOrders() {
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load order IDs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("instatickets_order_ids");
      if (stored) {
        setOrderIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch each order individually
  useEffect(() => {
    if (orderIds.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.allSettled(
      orderIds.map((id) => ordersApi.getById(id))
    ).then((results) => {
      const loaded: Order[] = [];
      results.forEach((r) => {
        if (r.status === "fulfilled") loaded.push(r.value);
      });
      // Sort newest first
      loaded.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
      setOrders(loaded);
      setIsLoading(false);
    });
  }, [orderIds]);

  const refetch = () => {
    setOrderIds((prev) => [...prev]);
  };

  return { orders, isLoading, refetch };
}

export default function BuyerDashboardPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const { orders, isLoading, refetch } = useMyOrders();

  const firstName = user?.email?.split("@")[0] ?? "there";

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab?.status) return orders;
    return orders.filter((o) => o.status === tab.status);
  }, [orders, activeTab]);

  // Count per status for tab badges
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      paid: orders.filter((o) => o.status === "PAID").length,
      expired: orders.filter(
        (o) => o.status === "EXPIRED" || o.status === "CANCELLED"
      ).length,
    };
  }, [orders]);

  return (
    <div className="min-h-screen">
      {/* Dashboard header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="page-container py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground flex
                            items-center gap-1.5">
                <Ticket className="w-4 h-4 text-fuchsia-500" />
                My Tickets
              </p>
              <h1 className="text-2xl font-bold">
                Hey,{" "}
                <span className="gradient-text capitalize">
                  {firstName}
                </span>{" "}
                👋
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
              <Button
                className="gradient-bg hover:opacity-90 gap-2
                           font-semibold"
                asChild
              >
                <Link href="/events">
                  <Plus className="w-4 h-4" />
                  Find events
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="page-container py-8 space-y-6">
        {/* Quick stats */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              {
                label: "Total Orders",
                value: counts.all,
                icon: ShoppingBag,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
              {
                label: "Awaiting Payment",
                value: counts.pending,
                icon: Clock,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                label: "Confirmed",
                value: counts.paid,
                icon: CheckCircle,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Total Tickets",
                value: orders
                  .filter((o) => o.status === "PAID")
                  .reduce(
                    (s, o) =>
                      s +
                      (o.items?.reduce((is, i) => is + i.quantity, 0) ??
                        0),
                    0
                  ),
                icon: Ticket,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border/50
                             bg-card p-4 space-y-2"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      stat.bg
                    )}
                  >
                    <Icon
                      className={cn("w-4 h-4", stat.color)}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/50">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              counts[tab.id as keyof typeof counts];

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm",
                  "font-medium border-b-2 -mb-px transition-all",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? tab.color : ""
                  )}
                />
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "gradient-bg text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="md" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center
                       py-24 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl gradient-bg-subtle
                          border border-fuchsia-500/20 flex items-center
                          justify-center mb-4"
            >
              <Ticket className="w-8 h-8 text-fuchsia-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">
              {activeTab === "all"
                ? "No orders yet"
                : `No ${activeTab} orders`}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs
                          mb-6 leading-relaxed">
              {activeTab === "all"
                ? "Browse events and buy your first ticket to see your orders here."
                : `You don't have any ${activeTab} orders.`}
            </p>
            {activeTab === "all" && (
              <Button
                className="gradient-bg hover:opacity-90 gap-2"
                asChild
              >
                <Link href="/events">
                  Browse events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order, i) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={i}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}