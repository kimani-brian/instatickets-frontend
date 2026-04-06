"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrdersTable from "@/components/dashboard/OrdersTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  useOrganizerEvent,
  useEventOrders,
} from "@/lib/hooks/useOrganizer";
import { useQueryClient } from "@tanstack/react-query";
import { organizerKeys } from "@/lib/hooks/useOrganizer";

export default function EventOrdersPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();

  const { data: event, isLoading: eventLoading } =
    useOrganizerEvent(eventId);

  const {
    data: orders,
    isLoading: ordersLoading,
    isFetching,
  } = useEventOrders(eventId);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: organizerKeys.orders(eventId),
    });
  };

  if (eventLoading || ordersLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="page-container py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                asChild
              >
                <Link href={`/organizer/events/${eventId}`}>
                  <ChevronLeft className="w-4 h-4" />
                  {event?.name ?? "Event"}
                </Link>
              </Button>
            </div>

            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
              className="gap-1.5"
            >
              {isFetching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Refresh
            </Button>
          </div>

          <div className="mt-4 space-y-0.5">
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-sm text-muted-foreground">
              {event?.name} · Live order management
            </p>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <OrdersTable orders={orders ?? []} />
        </motion.div>
      </div>
    </div>
  );
}