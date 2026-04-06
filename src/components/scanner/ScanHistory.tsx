"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanRecord } from "@/lib/hooks/useScanner";

interface ScanHistoryProps {
  records: ScanRecord[];
}

const RESULT_STYLES = {
  GRANTED: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    label: "Granted",
    labelColor: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  ALREADY_USED: {
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    icon: XCircle,
    iconColor: "text-red-400",
    label: "Used",
    labelColor: "text-red-400",
    dot: "bg-red-400",
  },
  NOT_FOUND: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    label: "Not Found",
    labelColor: "text-amber-400",
    dot: "bg-amber-400",
  },
  ERROR: {
    border: "border-zinc-500/20",
    bg: "bg-zinc-500/5",
    icon: AlertTriangle,
    iconColor: "text-zinc-400",
    label: "Error",
    labelColor: "text-zinc-400",
    dot: "bg-zinc-400",
  },
};

export default function ScanHistory({ records }: ScanHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <Ticket className="w-8 h-8 text-white/20 mx-auto" />
        <p className="text-white/30 text-sm">
          No scans yet this session
        </p>
      </div>
    );
  }

  // Summary counts
  const granted = records.filter((r) => r.result === "GRANTED").length;
  const rejected = records.filter(
    (r) => r.result !== "GRANTED"
  ).length;

  return (
    <div className="space-y-4">
      {/* Session summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Total",
            value: records.length,
            color: "text-white",
          },
          {
            label: "Granted",
            value: granted,
            color: "text-emerald-400",
          },
          {
            label: "Rejected",
            value: rejected,
            color: "text-red-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-xl
                       py-3 text-center space-y-0.5"
          >
            <p className={cn("text-xl font-bold", stat.color)}>
              {stat.value}
            </p>
            <p className="text-white/30 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Scan log */}
      <div className="space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-wider px-1">
          Recent scans (last {records.length})
        </p>

        <AnimatePresence initial={false}>
          {records.map((record, i) => {
            const style = RESULT_STYLES[record.result];
            const Icon = style.icon;

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5",
                    "rounded-xl border transition-colors",
                    style.border,
                    style.bg
                  )}
                >
                  {/* Status dot */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      style.dot,
                      i === 0 && record.result === "GRANTED"
                        ? "animate-pulse"
                        : ""
                    )}
                  />

                  {/* Icon */}
                  <Icon
                    className={cn("w-4 h-4 flex-shrink-0", style.iconColor)}
                  />

                  {/* Code */}
                  <code className="flex-1 font-mono text-xs text-white/60 truncate">
                    {record.code.slice(0, 16)}...
                  </code>

                  {/* Result label */}
                  <span
                    className={cn(
                      "text-xs font-semibold flex-shrink-0",
                      style.labelColor
                    )}
                  >
                    {style.label}
                  </span>

                  {/* Time */}
                  <span className="text-white/20 text-xs flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {record.scannedAt.toLocaleTimeString("en-KE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}