"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Ticket,
  CheckCircle,
  XCircle,
  Scan,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime } from "@/lib/utils";
import type { Ticket as TicketType } from "@/types";

interface TicketCardProps {
  ticket: TicketType;
  eventName?: string;
  index?: number;
}

// Minimal QR code visual built with CSS grid
// In production you would use a real QR library like qrcode.react
function QRCodeVisual({ code }: { code: string }) {
  // Generate a deterministic grid pattern from the code
  const cells = Array.from({ length: 64 }, (_, i) => {
    const charCode = code.charCodeAt(i % code.length);
    return (charCode + i) % 3 !== 0;
  });

  return (
    <div
      className="p-2 bg-white rounded-lg inline-grid gap-px"
      style={{ gridTemplateColumns: "repeat(8, 1fr)" }}
    >
      {cells.map((filled, i) => (
        <div
          key={i}
          className={cn(
            "w-3.5 h-3.5 rounded-[1px]",
            filled ? "bg-black" : "bg-white"
          )}
        />
      ))}
    </div>
  );
}

export default function TicketCard({
  ticket,
  eventName,
  index = 0,
}: TicketCardProps) {
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const isScanned = ticket.status === "SCANNED";

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(ticket.unique_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className={cn(
          "relative transition-all duration-500",
          "[transform-style:preserve-3d]",
          flipped ? "[transform:rotateY(180deg)]" : ""
        )}
        style={{ perspective: "1000px" }}
      >
        {/* ── FRONT ──────────────────────────────────────────────────── */}
        <div className="[backface-visibility:hidden]">
          <div
            className={cn(
              "relative rounded-2xl overflow-hidden border",
              "transition-all duration-300",
              isScanned
                ? "border-zinc-500/30 opacity-70"
                : "border-violet-500/20 hover:border-violet-500/40",
              "hover:shadow-lg hover:shadow-violet-500/10"
            )}
          >
            {/* Top gradient strip */}
            <div className="h-2 gradient-bg" />

            <div className="bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                {/* Left content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Header */}
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                        isScanned
                          ? "bg-zinc-500/10"
                          : "gradient-bg-subtle"
                      )}
                    >
                      <Ticket
                        className={cn(
                          "w-4 h-4",
                          isScanned
                            ? "text-zinc-400"
                            : "text-violet-500"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm">
                          {ticket.tier?.name ?? "Ticket"}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            isScanned
                              ? "border-zinc-500/30 text-zinc-400 bg-zinc-500/5"
                              : "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                          )}
                        >
                          {isScanned ? (
                            <span className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Used
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Valid
                            </span>
                          )}
                        </Badge>
                      </div>
                      {eventName && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {eventName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Unique code */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Ticket Code
                    </p>
                    <div className="flex items-center gap-2">
                      <code
                        className="flex-1 font-mono text-xs bg-muted
                                   rounded-lg px-3 py-2 text-foreground
                                   break-all leading-relaxed select-all"
                      >
                        {ticket.unique_code.slice(0, 32)}...
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCopy}
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-lg",
                          copied
                            ? "text-emerald-500 bg-emerald-500/10"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Scanned info */}
                  {isScanned && ticket.scanned_at && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Scan className="w-3 h-3" />
                      Scanned {formatDateTime(ticket.scanned_at)}
                    </div>
                  )}
                </div>

                {/* QR preview (right side) */}
                <div className="flex-shrink-0 hidden sm:block opacity-80">
                  <QRCodeVisual code={ticket.unique_code} />
                </div>
              </div>

              {/* Perforated divider */}
              <div className="relative my-4">
                <div className="border-t border-dashed border-border" />
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-r-full bg-background border-r border-t border-b border-border" />
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-l-full bg-background border-l border-t border-b border-border" />
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Tap to see full QR code
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  #{ticket.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── BACK — full QR code ─────────────────────────────────────── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden]
                     [transform:rotateY(180deg)]"
        >
          <div className="rounded-2xl border border-violet-500/20 bg-card h-full flex flex-col">
            {/* Top strip */}
            <div className="h-2 gradient-bg rounded-t-2xl" />

            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Show at Entrance
              </p>

              {/* Large QR code */}
              <div className="p-3 bg-white rounded-2xl shadow-lg">
                <div
                  className="grid gap-0.5"
                  style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
                >
                  {Array.from({ length: 144 }, (_, i) => {
                    const charCode =
                      ticket.unique_code.charCodeAt(
                        i % ticket.unique_code.length
                      );
                    const filled = (charCode + i * 7) % 3 !== 0;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "w-4 h-4 rounded-[1px]",
                          filled ? "bg-black" : "bg-white"
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Full code */}
              <code className="font-mono text-[10px] text-muted-foreground text-center break-all leading-relaxed max-w-xs">
                {ticket.unique_code}
              </code>

              <p className="text-xs text-muted-foreground">
                Tap card to flip back
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}