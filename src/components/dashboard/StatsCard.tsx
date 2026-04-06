"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;   // percentage change
    label: string;
  };
  iconColor?: string;
  iconBg?: string;
  index?: number;
  prefix?: string;
  suffix?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = "text-violet-500",
  iconBg = "bg-violet-500/10",
  index = 0,
  prefix = "",
  suffix = "",
}: StatsCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const isPositive = (trend?.value ?? 0) > 0;
  const isNeutral = trend?.value === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl border border-border/50 bg-card p-6",
        "hover:border-violet-500/20 hover:shadow-lg",
        "hover:shadow-violet-500/5 transition-all duration-300",
        "overflow-hidden group"
      )}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, " +
            "rgba(124,58,237,0.04), transparent 70%)",
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            iconBg
          )}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>

          {/* Trend badge */}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              "px-2 py-1 rounded-lg",
              isNeutral
                ? "text-muted-foreground bg-muted"
                : isPositive
                ? "text-emerald-500 bg-emerald-500/10"
                : "text-red-500 bg-red-500/10"
            )}>
              {isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {isPositive ? "+" : ""}{trend.value}%
              </span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            className="text-3xl font-bold tabular-nums"
          >
            {prefix}
            {typeof value === "number"
              ? value.toLocaleString()
              : value}
            {suffix}
          </motion.div>

          <p className="text-sm text-muted-foreground font-medium">
            {title}
          </p>

          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}

          {trend && (
            <p className="text-xs text-muted-foreground">
              {trend.label}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}