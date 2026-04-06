"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Ticket,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScanRecord } from "@/lib/hooks/useScanner";

interface ScanResultProps {
  record: ScanRecord;
  onReset: () => void;
}

// Configuration per result type — colors, icons, messages
const RESULT_CONFIG = {
  GRANTED: {
    bg: "from-emerald-900 via-emerald-800 to-green-900",
    border: "border-emerald-400/30",
    glow: "bg-emerald-400/20",
    iconBg: "bg-emerald-400/20 border-emerald-400/40",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    label: "ACCESS GRANTED",
    labelColor: "text-emerald-400",
    subtitleColor: "text-emerald-200/80",
    buttonBg: "bg-emerald-500 hover:bg-emerald-400",
  },
  ALREADY_USED: {
    bg: "from-red-900 via-red-800 to-rose-900",
    border: "border-red-400/30",
    glow: "bg-red-400/20",
    iconBg: "bg-red-400/20 border-red-400/40",
    icon: XCircle,
    iconColor: "text-red-400",
    label: "ALREADY USED",
    labelColor: "text-red-400",
    subtitleColor: "text-red-200/80",
    buttonBg: "bg-red-500 hover:bg-red-400",
  },
  NOT_FOUND: {
    bg: "from-amber-900 via-amber-800 to-yellow-900",
    border: "border-amber-400/30",
    glow: "bg-amber-400/20",
    iconBg: "bg-amber-400/20 border-amber-400/40",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    label: "NOT FOUND",
    labelColor: "text-amber-400",
    subtitleColor: "text-amber-200/80",
    buttonBg: "bg-amber-500 hover:bg-amber-400",
  },
  ERROR: {
    bg: "from-zinc-900 via-zinc-800 to-slate-900",
    border: "border-zinc-400/30",
    glow: "bg-zinc-400/20",
    iconBg: "bg-zinc-400/20 border-zinc-400/40",
    icon: AlertTriangle,
    iconColor: "text-zinc-400",
    label: "SCAN ERROR",
    labelColor: "text-zinc-400",
    subtitleColor: "text-zinc-300/80",
    buttonBg: "bg-zinc-600 hover:bg-zinc-500",
  },
};

export default function ScanResult({
  record,
  onReset,
}: ScanResultProps) {
  const config = RESULT_CONFIG[record.result];
  const Icon = config.icon;

  // Auto-reset after 5 seconds on a successful scan
  // so venue staff doesn't have to tap "Scan Next"
  useEffect(() => {
    if (record.result !== "GRANTED") return;
    const timer = setTimeout(onReset, 5000);
    return () => clearTimeout(timer);
  }, [record.result, onReset]);

  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center",
        "bg-gradient-to-br p-8 z-50",
        config.bg
      )}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blob */}
      <div
        className={cn(
          "absolute top-1/4 left-1/2 -translate-x-1/2",
          "w-64 h-64 rounded-full blur-3xl opacity-30",
          config.glow
        )}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">

        {/* Icon with ripple effect */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="relative"
        >
          {/* Ripple rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className={cn(
                "absolute inset-0 rounded-full border",
                config.border
              )}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1 + ring * 0.4, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: ring * 0.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

          <div
            className={cn(
              "w-28 h-28 rounded-full flex items-center justify-center",
              "border-2",
              config.iconBg
            )}
          >
            <Icon className={cn("w-14 h-14", config.iconColor)} />
          </div>
        </motion.div>

        {/* Result text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-3"
        >
          <p
            className={cn(
              "text-4xl font-black tracking-widest uppercase",
              config.labelColor
            )}
          >
            {config.label}
          </p>

          {/* Ticket / event info */}
          {record.result === "GRANTED" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              {record.tierName && (
                <div className="flex items-center justify-center gap-2">
                  <Ticket
                    className={cn(
                      "w-4 h-4",
                      config.iconColor
                    )}
                  />
                  <span className="text-white font-bold text-xl">
                    {record.tierName}
                  </span>
                </div>
              )}
              {record.eventName && (
                <p
                  className={cn(
                    "text-sm font-medium",
                    config.subtitleColor
                  )}
                >
                  {record.eventName}
                </p>
              )}
            </motion.div>
          )}

          {/* Already used — show when it was first scanned */}
          {record.result === "ALREADY_USED" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <p className={cn("text-base", config.subtitleColor)}>
                {record.message}
              </p>
            </motion.div>
          )}

          {/* Not found message */}
          {record.result === "NOT_FOUND" && (
            <p className={cn("text-base", config.subtitleColor)}>
              This code is not in our system
            </p>
          )}

          {/* Timestamp */}
          <p className="text-white/40 text-xs flex items-center justify-center gap-1.5">
            <Clock className="w-3 h-3" />
            {record.scannedAt.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Truncated ticket code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-center",
              "bg-black/20 backdrop-blur-sm",
              config.border
            )}
          >
            <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">
              Code
            </p>
            <code className="text-white/60 font-mono text-xs break-all leading-relaxed">
              {record.code.slice(0, 32)}...
            </code>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-3"
        >
          <Button
            onClick={onReset}
            className={cn(
              "w-full h-14 font-bold text-white text-lg gap-2",
              "rounded-2xl transition-all",
              config.buttonBg
            )}
          >
            <RotateCcw className="w-5 h-5" />
            Scan Next Ticket
          </Button>

          {/* Auto-reset hint for granted */}
          {record.result === "GRANTED" && (
            <p className="text-center text-white/30 text-xs">
              Auto-resets in 5 seconds
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}