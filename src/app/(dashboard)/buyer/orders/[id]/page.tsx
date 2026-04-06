"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Ticket,
  CreditCard,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import OrderStatusTimeline from "@/components/buyer/OrderStatusTimeline";
import TicketCard from "@/components/buyer/TicketCard";
import OrderTimer from "@/components/checkout/OrderTimer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  useBuyerOrder,
  useOrderTickets,
  useSimulatePayment,
} from "@/lib/hooks/useBuyer";
import {
  cn,
  formatPrice,
  formatDateTime,
  orderStatusColor,
  secondsUntil,
} from "@/lib/utils";
import { useState } from "react";

const STATUS_LABELS = {
  PENDING: "Awaiting Payment",
  PAID: "Paid",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
} as const;

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [copiedRef, setCopiedRef] = useState(false);

  const {
    data: order,
    isLoading: orderLoading,
    refetch,
  } = useBuyerOrder(orderId);

  const {
    data: tickets,
    isLoading: ticketsLoading,
  } = useOrderTickets(orderId, order?.status === "PAID");

  const paymentMutation = useSimulatePayment(orderId);

  if (orderLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold">Order not found</h2>
        <Button variant="outline" asChild>
          <Link href="/buyer">Back to my orders</Link>
        </Button>
      </div>
    );
  }

  const isPending = order.status === "PENDING";
  const isPaid = order.status === "PAID";
  const secondsLeft = isPending ? secondsUntil(order.expires_at) : 0;
  const totalTickets =
    order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  const handleCopyRef = async () => {
    if (!order.payment_reference) return;
    await navigator.clipboard.writeText(order.payment_reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

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
                <Link href="/buyer">
                  <ChevronLeft className="w-4 h-4" />
                  My orders
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-5" />
              <div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm font-bold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </code>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs border",
                      orderStatusColor(order.status)
                    )}
                  >
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Order detail
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT — Tickets or payment ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* PENDING — pay now section */}
            {isPending && secondsLeft > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-500/30
                           bg-amber-500/5 p-6 space-y-4"
              >
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  Complete Your Payment
                </h2>

                <OrderTimer
                  secondsRemaining={secondsLeft}
                  totalSeconds={600}
                />

                <p className="text-sm text-muted-foreground">
                  Your tickets are reserved. Complete payment before
                  the timer runs out or they will be released.
                </p>

                <Button
                  onClick={() => paymentMutation.mutate()}
                  disabled={paymentMutation.isPending}
                  className="w-full h-11 gradient-bg hover:opacity-90
                             gap-2 font-semibold"
                >
                  {paymentMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay {formatPrice(order.total_amount)} now
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* PAID — tickets */}
            {isPaid && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-violet-500" />
                    Your Tickets
                    <Badge variant="outline" className="text-xs">
                      {tickets?.length ?? totalTickets}
                    </Badge>
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Tap a ticket to reveal QR code
                  </p>
                </div>

                {ticketsLoading ? (
                  <div className="grid gap-4">
                    {Array.from({ length: totalTickets }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="h-48 rounded-2xl bg-muted
                                     animate-pulse"
                        />
                      )
                    )}
                  </div>
                ) : tickets && tickets.length > 0 ? (
                  <div className="grid gap-4">
                    {tickets.map((ticket, i) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        index={i}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/50
                                  bg-card p-12 text-center">
                    <Ticket className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">
                      Tickets are being generated...
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => refetch()}
                      className="mt-3 gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Check again
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* EXPIRED */}
            {order.status === "EXPIRED" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-destructive/20
                           bg-destructive/5 p-6 space-y-3 text-center"
              >
                <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
                <h3 className="font-bold text-lg">
                  Order Expired
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  This order expired before payment was completed.
                  Tickets were released back to the pool.
                </p>
                <Button
                  className="gradient-bg hover:opacity-90 gap-2"
                  asChild
                >
                  <Link href="/events">
                    Browse events again
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT — Order summary + timeline ─────────────────── */}
          <div className="space-y-5">
            {/* Order summary */}
            <div className="rounded-2xl border border-border/50
                            bg-card p-5 space-y-4">
              <h3 className="font-bold">Order Summary</h3>

              {/* Line items */}
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <span className="font-medium">
                        {item.tier?.name ?? "Ticket"}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ×{item.quantity}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm">Total</span>
                <span className="font-bold gradient-text text-lg">
                  {formatPrice(order.total_amount)}
                </span>
              </div>

              {/* Payment reference */}
              {order.payment_reference && (
                <div className="pt-1 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Payment Reference
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-muted
                                     px-2 py-1 rounded flex-1 truncate">
                      {order.payment_reference}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 flex-shrink-0"
                      onClick={handleCopyRef}
                    >
                      {copiedRef ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Status timeline */}
            <div className="rounded-2xl border border-border/50
                            bg-card p-5 space-y-4">
              <h3 className="font-bold">Order Status</h3>
              <OrderStatusTimeline
                status={order.status}
                createdAt={order.created_at}
                updatedAt={order.updated_at}
              />
            </div>

            {/* Buyer info */}
            <div className="rounded-2xl border border-border/50
                            bg-card p-5 space-y-3">
              <h3 className="font-bold text-sm">Buyer Info</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-xs truncate max-w-[160px]">
                    {order.buyer_email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ordered</span>
                  <span className="text-xs">
                    {formatDateTime(order.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Help link */}
            <p className="text-xs text-center text-muted-foreground">
              Issues with your order?{" "}
              <Link
                href="#"
                className="text-primary hover:underline underline-offset-2"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}