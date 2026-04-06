import LoadingSpinner from "@/components/shared/LoadingSpinner";

// Root-level loading state — shown during initial page load
export default function RootLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading InstaTickets...
        </p>
      </div>
    </div>
  );
}