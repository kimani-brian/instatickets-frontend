import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <Skeleton className="h-72 md:h-96 w-full rounded-none" />

      <div className="page-container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tiers skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-7 w-48" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/50 p-5 space-y-3"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>

          {/* Summary skeleton */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/50 p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}