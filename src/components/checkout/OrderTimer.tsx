"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimerProps {
  secondsRemaining: number;
  totalSeconds?: number;
}

// Formats raw seconds into MM:SS display
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function OrderTimer({
  secondsRemaining,
  totalSeconds = 600, // 10 minutes default
}: OrderTimerProps) {
  const percent = Math.max(
    0,
    (secondsRemaining / totalSeconds) * 100
  );

  const isWarning = secondsRemaining <= 120; // under 2 minutes
  const isCritical = secondsRemaining <= 30; // under 30 seconds

  // Circumference of the SVG circle progress ring
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-all duration-500",
        isCritical
          ? "border-red-500/50 bg-red-500/10 animate-pulse"
          : isWarning
          ? "border-amber-500/50 bg-amber-500/10"
          : "border-border/50 bg-card"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Circular progress ring */}
        <div className="relative flex-shrink-0">
          <svg
            width="56"
            height="56"
            className="-rotate-90"
            viewBox="0 0 56 56"
          >
            {/* Background track */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="none"
              strokeWidth="3"
              className="stroke-muted"
            />
            {/* Progress arc */}
            <motion.circle
              cx="28"
              cy="28"
              r={radius}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                stroke: isCritical
                  ? "#ef4444"
                  : isWarning
                  ? "#f59e0b"
                  : "#7c3aed",
              }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>

          {/* Clock icon centered in ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isCritical ? (
              <AlertTriangle
                className="w-4 h-4 text-red-500 animate-bounce"
              />
            ) : (
              <Clock
                className={cn(
                  "w-4 h-4",
                  isWarning ? "text-amber-500" : "text-violet-500"
                )}
              />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={secondsRemaining}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "text-2xl font-bold font-mono tabular-nums",
                  isCritical
                    ? "text-red-500"
                    : isWarning
                    ? "text-amber-500"
                    : "text-foreground"
                )}
              >
                {formatTime(secondsRemaining)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted-foreground">
              remaining
            </span>
          </div>

          <p
            className={cn(
              "text-xs mt-0.5",
              isCritical
                ? "text-red-400"
                : isWarning
                ? "text-amber-500"
                : "text-muted-foreground"
            )}
          >
            {isCritical
              ? "⚠️ Order expiring soon — complete payment now!"
              : isWarning
              ? "Time running low — please pay soon"
              : "Your tickets are reserved while you pay"}
          </p>
        </div>
      </div>

      {/* Linear progress bar */}
      <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-500",
            isCritical
              ? "bg-red-500"
              : isWarning
              ? "bg-amber-500"
              : "bg-violet-500"
          )}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
    </div>
  );
}