"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, formatPrice, formatDateTime, orderStatusColor } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

interface OrdersTableProps {
  orders: Order[];
}

type SortField = "created_at" | "total_amount" | "status" | "buyer_email";
type SortDir = "asc" | "desc";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

// Revenue summary shown above the table
function RevenueSummary({ orders }: { orders: Order[] }) {
  const paid = orders.filter((o) => o.status === "PAID");
  const pending = orders.filter((o) => o.status === "PENDING");
  const totalRevenue = paid.reduce((s, o) => s + o.total_amount, 0);
  const pendingRevenue = pending.reduce(
    (s, o) => s + o.total_amount,
    0
  );

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Paid Orders",
      value: paid.length.toString(),
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "Pending",
      value: formatPrice(pendingRevenue),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={cn(
            "rounded-xl border p-3.5 space-y-1",
            stat.bg,
            stat.border
          )}
        >
          <p className={cn("text-xl font-bold", stat.color)}>
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  if (sortField !== field) {
    return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
  }
  return sortDir === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 text-primary" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 text-primary" />
  );
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] =
    useState<OrderStatus | "ALL">("ALL");

  // Sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // Filter + sort
  const processedOrders = useMemo(() => {
    let filtered = orders;

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Search by email or order ID
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.buyer_email.toLowerCase().includes(lower) ||
          o.id.toLowerCase().includes(lower) ||
          o.payment_reference?.toLowerCase().includes(lower)
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      let aVal: string | number = a[sortField] ?? "";
      let bVal: string | number = b[sortField] ?? "";

      if (sortField === "total_amount") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [orders, search, sortField, sortDir, statusFilter]);

  const statusOptions: Array<OrderStatus | "ALL"> = [
    "ALL",
    "PAID",
    "PENDING",
    "EXPIRED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-4">
      {/* Revenue summary */}
      <RevenueSummary orders={orders} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2
                         w-4 h-4 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Search by email or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium",
                "border transition-all duration-150",
                statusFilter === s
                  ? "gradient-bg text-white border-transparent"
                  : "border-border/50 text-muted-foreground" +
                    " hover:text-foreground hover:border-border bg-card"
              )}
            >
              {s === "ALL" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {processedOrders.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center
                      py-16 text-center border border-border/50
                      rounded-2xl bg-card"
        >
          <Ticket className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="font-medium">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your filters"
              : "Orders will appear here when buyers purchase tickets"}
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl border border-border/50
                      overflow-hidden bg-card"
        >
          {/* Table header */}
          <div
            className="grid grid-cols-12 gap-3 px-5 py-3
                        bg-muted/50 border-b border-border/50
                        text-xs font-semibold text-muted-foreground
                        uppercase tracking-wider"
          >
            <button
              className="col-span-4 flex items-center gap-1.5
                         hover:text-foreground transition-colors text-left"
              onClick={() => handleSort("buyer_email")}
            >
              Buyer <SortIcon field="buyer_email" sortField={sortField} sortDir={sortDir} />
            </button>
            <button
              className="col-span-2 flex items-center gap-1.5
                         hover:text-foreground transition-colors text-left"
              onClick={() => handleSort("status")}
            >
              Status <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
            </button>
            <button
              className="col-span-3 flex items-center gap-1.5
                         hover:text-foreground transition-colors text-left"
              onClick={() => handleSort("total_amount")}
            >
              Amount <SortIcon field="total_amount" sortField={sortField} sortDir={sortDir} />
            </button>
            <button
              className="col-span-3 flex items-center gap-1.5
                         hover:text-foreground transition-colors text-left"
              onClick={() => handleSort("created_at")}
            >
              Date <SortIcon field="created_at" sortField={sortField} sortDir={sortDir} />
            </button>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border/50">
            {processedOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-3 px-5 py-4
                           hover:bg-muted/30 transition-colors
                           items-center"
              >
                {/* Buyer info */}
                <div className="col-span-4 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {order.buyer_email}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono
                                truncate mt-0.5">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>

                {/* Status badge */}
                <div className="col-span-2">
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

                {/* Amount */}
                <div className="col-span-3">
                  <p className="text-sm font-semibold">
                    {formatPrice(order.total_amount)}
                  </p>
                  {order.payment_reference && (
                    <p className="text-xs text-muted-foreground
                                  font-mono truncate mt-0.5">
                      {order.payment_reference}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="col-span-3">
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Table footer */}
          <div
            className="px-5 py-3 border-t border-border/50
                        bg-muted/30 flex items-center justify-between
                        text-xs text-muted-foreground"
          >
            <span>
              Showing {processedOrders.length} of {orders.length}{" "}
              orders
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              {formatPrice(
                processedOrders
                  .filter((o) => o.status === "PAID")
                  .reduce((s, o) => s + o.total_amount, 0)
              )}{" "}
              confirmed revenue
            </span>
          </div>
        </div>
      )}
    </div>
  );
}