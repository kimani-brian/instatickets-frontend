"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle,
  Ticket,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import type { Order, Ticket as TicketType } from "@/types";

interface SuccessViewProps {
  order: Order;
  tickets: TicketType[];
}

type ConfettiParticle = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  driftX: number;
  rotateDir: 1 | -1;
};

const CONFETTI_COLORS = ["#7C3AED", "#C026D3", "#F59E0B", "#10B981", "#3B82F6"];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildConfettiParticles(count: number): ConfettiParticle[] {
  return Array.from({ length: count }, (_, i) => {
    const r1 = pseudoRandom(i + 1);
    const r2 = pseudoRandom(i + 101);
    const r3 = pseudoRandom(i + 201);
    const r4 = pseudoRandom(i + 301);
    const r5 = pseudoRandom(i + 401);
    const r6 = pseudoRandom(i + 501);

    return {
      id: i,
      x: r1 * 100,
      delay: r2 * 0.8,
      duration: 1.5 + r3 * 1.5,
      color: CONFETTI_COLORS[Math.floor(r4 * CONFETTI_COLORS.length)],
      size: 6 + r5 * 8,
      driftX: (r6 - 0.5) * 200,
      rotateDir: r6 > 0.5 ? 1 : -1,
    };
  });
}

// Single ticket display card with copyable unique code
function TicketCard({
  ticket,
  index,
}: {
  ticket: TicketType;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ticket.unique_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="ticket-card bg-card border border-border/50"
    >
      {/* Ticket inner */}
      <div className="flex items-stretch">
        {/* Left strip */}
        <div
          className="w-2 flex-shrink-0 gradient-bg rounded-l-xl"
        />

        {/* Main content */}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase
                            tracking-wider font-medium">
                {ticket.tier?.name ?? "Ticket"}
              </p>
              <p className="font-bold text-sm mt-0.5">
                Ticket #{(index + 1).toString().padStart(3, "0")}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-emerald-500/30
                         text-emerald-500 bg-emerald-500/10"
            >
              ✓ Valid
            </Badge>
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-border/50" />

          {/* Unique code */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Ticket Code
            </p>
            <div className="flex items-center gap-2">
              <code
                className="flex-1 font-mono text-xs bg-muted
                           rounded-lg px-3 py-2 text-foreground
                           break-all leading-relaxed"
              >
                {ticket.unique_code}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg transition-colors",
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
        </div>
      </div>
    </motion.div>
  );
}

// Confetti particle component
function Confetti() {
  const particles = buildConfettiParticles(50);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: 360 * p.rotateDir,
            x: [0, p.driftX],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

export default function SuccessView({
  order,
  tickets,
}: SuccessViewProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  // Stop confetti after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[60vh] flex items-center
                    justify-center py-12">

      {/* Confetti burst */}
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-xl space-y-6"
      >
        {/* Success header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
            className="inline-flex"
          >
            <div
              className="w-20 h-20 rounded-full bg-emerald-500/10
                          border-4 border-emerald-500/30 flex items-center
                          justify-center"
            >
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
          </motion.div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold">
              You&apos;re going! 🎉
            </h2>
            <p className="text-muted-foreground">
              Payment confirmed. Your tickets are ready below.
            </p>
          </div>

          {/* Order reference */}
          <div className="inline-flex items-center gap-2 glass rounded-xl
                          px-4 py-2 text-sm">
            <span className="text-muted-foreground">Order</span>
            <code className="font-mono font-bold text-xs">
              {order.id.slice(0, 8).toUpperCase()}
            </code>
            <Separator orientation="vertical" className="h-4" />
            <span className="font-semibold gradient-text">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Tickets */}
        <div className="space-y-3">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Ticket className="w-4 h-4 text-violet-500" />
            Your Tickets ({tickets.length})
          </h3>

          {tickets.map((ticket, i) => (
            <TicketCard key={ticket.id} ticket={ticket} index={i} />
          ))}
        </div>

        {/* Info box */}
        <div
          className="rounded-2xl border border-border/50 bg-card/50
                      p-4 space-y-2 text-sm text-muted-foreground"
        >
          <p className="font-semibold text-foreground text-xs uppercase
                        tracking-wide">
            At the door
          </p>
          <p className="text-sm leading-relaxed">
            Present your ticket code to the scanner at the venue entrance.
            Each code can only be scanned once — keep it private.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 gradient-bg hover:opacity-90
                       transition-opacity gap-2 font-semibold"
            asChild
          >
            <Link href="/buyer">
              <Ticket className="w-4 h-4" />
              View all orders
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            asChild
          >
            <Link href="/events">
              Browse more events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}