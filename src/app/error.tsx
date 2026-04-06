"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Next.js App Router error boundary — catches unhandled errors
// in the component tree and shows this instead of a crash
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your error monitoring service here (Sentry, etc.)
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center
                  justify-center p-8"
    >
      <div className="text-center space-y-8 max-w-md">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex justify-center"
        >
          <div
            className="w-24 h-24 rounded-3xl bg-destructive/10
                        border-2 border-destructive/20 flex items-center
                        justify-center"
          >
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </motion.div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">
            Something went wrong
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            An unexpected error occurred. This has been logged and
            we&apos;ll look into it.
          </p>

          {/* Error digest for support */}
          {error.digest && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5
                          rounded-lg bg-muted border border-border/50"
            >
              <span className="text-xs text-muted-foreground">
                Error ID:
              </span>
              <code className="text-xs font-mono text-foreground">
                {error.digest}
              </code>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="gradient-bg hover:opacity-90 gap-2 font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}