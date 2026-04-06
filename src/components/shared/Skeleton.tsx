import { cn } from "@/lib/utils";

// Extended skeleton variants for different content shapes
interface SkeletonProps {
  className?: string;
  variant?: "line" | "circle" | "card" | "badge";
}

export function Skeleton({ className, variant = "line" }: SkeletonProps) {
  const base =
    "animate-pulse bg-muted rounded-md";

  const variants = {
    line: "h-4 w-full",
    circle: "rounded-full aspect-square",
    card: "h-48 w-full rounded-2xl",
    badge: "h-6 w-16 rounded-full",
  };

  return (
    <div
      className={cn(base, variants[variant], className)}
    />
  );
}

// Pre-built skeleton for an event card
export function EventCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
      <Skeleton variant="card" className="rounded-none h-48" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3.5 w-40" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton variant="badge" />
          <Skeleton variant="badge" className="w-20" />
        </div>
        <div className="flex justify-between pt-2 border-t border-border/50">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>
    </div>
  );
}

// Pre-built skeleton for a stats card
export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
      <div className="flex justify-between">
        <Skeleton variant="circle" className="w-10 h-10" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3.5 w-28" />
      </div>
    </div>
  );
}

// Pre-built skeleton for a tier card
export function TierCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton variant="badge" className="w-20" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

// Pre-built skeleton for an order card
export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <div className="h-1 bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Skeleton variant="circle" className="w-9 h-9" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton variant="badge" />
          <Skeleton variant="badge" className="w-20" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Pre-built skeleton for a ticket card
export function TicketCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <div className="h-2 bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton variant="circle" className="w-9 h-9" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>
        <div className="h-px bg-border border-dashed" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}