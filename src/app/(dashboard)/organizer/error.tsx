"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrganizerError({
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
        <h2 className="text-xl font-bold">Dashboard error</h2>
        <p className="text-muted-foreground text-sm">
          {error.message ?? "Something went wrong loading the dashboard."}
        </p>
      </div>
      <Button onClick={reset} className="gradient-bg gap-2">
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    </div>
  );
}