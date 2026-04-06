"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpiredViewProps {
  onRetry: () => void;
  eventId: string;
}

export default function ExpiredView({
  onRetry,
  eventId,
}: ExpiredViewProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6 max-w-md"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="inline-flex"
        >
          <div
            className="w-20 h-20 rounded-full bg-amber-500/10
                        border-4 border-amber-500/30 flex items-center
                        justify-center"
          >
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
        </motion.div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Order expired</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your 10-minute reservation window has passed and your
            tickets have been released back to the pool.
            Don&apos;t worry — you can start again.
          </p>
        </div>

        {/* What happened box */}
        <div
          className="rounded-2xl border border-amber-500/20
                      bg-amber-500/5 p-4 text-left space-y-2"
        >
          <p className="text-xs font-semibold text-amber-600
                        dark:text-amber-400 uppercase tracking-wide">
            What happened?
          </p>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {[
              "Your reserved tickets were held for 10 minutes",
              "The reservation expired before payment was completed",
              "Tickets have been released back to the pool",
              "Other buyers may now be able to purchase them",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full
                                 bg-amber-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onRetry}
            className="w-full h-11 gradient-bg hover:opacity-90
                       transition-opacity gap-2 font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Try again — reserve new tickets
          </Button>
          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href={`/events/${eventId}`}>
              <ArrowLeft className="w-4 h-4" />
              Back to event
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}