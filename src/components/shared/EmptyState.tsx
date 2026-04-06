"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  compact?: boolean;
}

// Reusable empty state component used across every list view
// that can have zero items — events, orders, tickets, tiers
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-12 px-6" : "py-24 px-8",
        className
      )}
    >
      {/* Icon container */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className={cn(
          "rounded-3xl gradient-bg-subtle border border-violet-500/20",
          "flex items-center justify-center mb-6",
          compact ? "w-14 h-14" : "w-20 h-20"
        )}
      >
        <Icon
          className={cn(
            "text-violet-400",
            compact ? "w-7 h-7" : "w-10 h-10"
          )}
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2 mb-6"
      >
        <h3 className={cn("font-bold", compact ? "text-base" : "text-xl")}>
          {title}
        </h3>
        <p
          className={cn(
            "text-muted-foreground max-w-xs mx-auto leading-relaxed",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {description}
        </p>
      </motion.div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {action && (
            <>
              {action.href ? (
                <Button
                  className="gradient-bg hover:opacity-90 font-semibold"
                  size={compact ? "sm" : "default"}
                  asChild
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ) : (
                <Button
                  className="gradient-bg hover:opacity-90 font-semibold"
                  size={compact ? "sm" : "default"}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )}
            </>
          )}

          {secondaryAction && (
            <>
              {secondaryAction.href ? (
                <Button
                  variant="outline"
                  size={compact ? "sm" : "default"}
                  asChild
                >
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size={compact ? "sm" : "default"}
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}