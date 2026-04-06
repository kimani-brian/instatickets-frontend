"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-container py-24 text-center space-y-6">
      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Failed to load event</h2>
        <p className="text-muted-foreground text-sm">
          {error.message ?? "Something went wrong loading this event."}
        </p>
      </div>
      <div className="flex gap-3 justify-center">
        <Button
          onClick={reset}
          className="gradient-bg gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/events" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            All events
          </Link>
        </Button>
      </div>
    </div>
  );
}