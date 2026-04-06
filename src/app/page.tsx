"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Ticket,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Scan,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getEventImageUrl, formatPrice } from "@/lib/utils";

// ─── Static demo data for the landing page preview cards ───────────────────
const DEMO_EVENTS = [
  {
    id: "aabbccdd-0000-0000-0000-000000000001",
    name: "Nairobi Tech Summit",
    venue: "KICC, Nairobi",
    price: 2000,
    date: "Sep 15",
  },
  {
    id: "aabbccdd-0000-0000-0000-000000000002",
    name: "Afrobeats Festival",
    venue: "Uhuru Gardens",
    price: 1500,
    date: "Oct 4",
  },
  {
    id: "aabbccdd-0000-0000-0000-000000000003",
    name: "East Africa Comic Con",
    venue: "Sarit Centre",
    price: 800,
    date: "Nov 22",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Ticketing",
    description:
      "Tickets generated and delivered the moment payment clears. " +
      "No waiting, no queues.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description:
      "Cryptographically unique ticket codes. HMAC-verified payments. " +
      "JWT-protected APIs.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Globe,
    title: "Built for Africa",
    description:
      "M-Pesa ready. KES pricing. Designed for Nairobi and beyond.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Organizer Dashboard",
    description:
      "Real-time inventory tracking. Order management. Revenue " +
      "analytics at a glance.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Scan,
    title: "Door Scanner",
    description:
      "Phone-optimised ticket scanning for venue staff. " +
      "Instant valid/invalid feedback.",
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
  },
  {
    icon: Clock,
    title: "Smart Inventory",
    description:
      "10-minute checkout locks prevent overselling. " +
      "Expired locks auto-release.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const STATS = [
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "<500ms", label: "Average response time" },
  { value: "0", label: "Oversold events" },
  { value: "256-bit", label: "Ticket encryption" },
];

// ─── Section fade-in wrapper ────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatTile({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <FadeIn delay={delay}>
      <div ref={ref} className="text-center space-y-1">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.5,
            delay,
            type: "spring",
            stiffness: 200,
          }}
          className="text-3xl md:text-4xl font-bold gradient-text"
        >
          {value}
        </motion.div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </FadeIn>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center">

        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute -top-40 -left-40 w-[600px] h-[600px]",
            "rounded-full bg-violet-600/20 blur-[120px]",
            "animate-float"
          )} />
          <div className={cn(
            "absolute -bottom-40 -right-40 w-[600px] h-[600px]",
            "rounded-full bg-fuchsia-600/20 blur-[120px]",
            "animate-float [animation-delay:1.5s]"
          )} />
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[400px] h-[400px]",
            "rounded-full bg-violet-500/10 blur-[100px]"
          )} />
        </div>

        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2
                          gap-12 items-center py-20">

            {/* Left — copy */}
            <div className="space-y-8">

              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 text-sm border-violet-500/30
                             text-violet-400 bg-violet-500/10 gap-2"
                >
                  <Star className="w-3 h-3 fill-current" />
                  East Africa&apos;s Modern Ticketing Platform
                </Badge>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-2"
              >
                <h1 className="text-5xl md:text-7xl font-bold
                               tracking-tight leading-[1.05]">
                  Tickets that{" "}
                  <span className="gradient-text">move</span>
                  {" "}as fast as{" "}
                  <span className="relative">
                    <span className="gradient-text">you do</span>
                    {/* Underline decoration */}
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 300 12"
                      fill="none"
                    >
                      <path
                        d="M2 9 C80 2, 200 2, 298 9"
                        stroke="url(#underline-gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="underline-gradient"
                          x1="0" y1="0" x2="1" y2="0"
                        >
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#C026D3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
              </motion.div>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-lg md:text-xl text-muted-foreground
                           max-w-lg leading-relaxed"
              >
                Buy, sell, and validate event tickets in seconds.
                Built for East Africa with M-Pesa support,
                real-time inventory, and cryptographic security.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  size="lg"
                  className="gradient-bg hover:opacity-90 transition-opacity
                             gap-2 h-12 px-8 font-semibold text-base
                             shadow-lg shadow-violet-500/25"
                  asChild
                >
                  <Link href="/events">
                    Browse Events
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12 px-8 font-semibold text-base
                             border-border/50 hover:border-violet-500/50
                             hover:bg-violet-500/5"
                  asChild
                >
                  <Link href="/register">
                    <Ticket className="w-4 h-4" />
                    Host an Event
                  </Link>
                </Button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 text-sm
                           text-muted-foreground"
              >
                <div className="flex -space-x-2">
                  {["1", "2", "3", "4"].map((n) => (
                    <div
                      key={n}
                      className="w-7 h-7 rounded-full gradient-bg
                                 border-2 border-background flex
                                 items-center justify-center
                                 text-white text-xs font-bold"
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <span>
                  Join{" "}
                  <strong className="text-foreground">1,200+</strong>{" "}
                  organizers in East Africa
                </span>
              </motion.div>
            </div>

            {/* Right — floating event cards */}
            <div className="relative hidden lg:flex items-center
                            justify-center h-[520px]">

              {/* Central glow */}
              <div className="absolute inset-0 flex items-center
                              justify-center">
                <div className="w-64 h-64 rounded-full gradient-bg
                                opacity-20 blur-3xl" />
              </div>

              {/* Floating cards */}
              {DEMO_EVENTS.map((event, i) => (
                <motion.div
                  key={event.id}
                  className={cn(
                    "absolute glass rounded-2xl overflow-hidden",
                    "shadow-2xl cursor-pointer",
                    "hover:scale-105 transition-transform duration-300",
                    i === 0 && "w-56 top-8 left-4 rotate-[-6deg]",
                    i === 1 && "w-64 top-16 right-0 rotate-[4deg] z-10",
                    i === 2 && "w-56 bottom-8 left-12 rotate-[3deg]"
                  )}
                  initial={{ opacity: 0, y: 40, rotate: 0 }}
                  animate={{
                    opacity: 1,
                    y: [0, -8, 0],
                    rotate:
                      i === 0 ? -6 :
                      i === 1 ? 4 : 3,
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.4 + i * 0.15 },
                    y: {
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: i * 0.8,
                    },
                    rotate: { duration: 0.5, delay: 0.4 + i * 0.15 },
                  }}
                >
                  {/* Mini event card */}
                  <div className="relative h-28 bg-muted overflow-hidden">
                    <Image
                      src={getEventImageUrl(event.id, 300, 150)}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t
                                    from-black/50 to-transparent" />
                    <span className="absolute bottom-2 right-2
                                     text-white text-xs font-bold
                                     gradient-bg px-2 py-0.5 rounded-full">
                      {event.date}
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-bold text-sm leading-tight
                                  line-clamp-1">
                      {event.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.venue}
                    </p>
                    <p className="text-xs font-semibold gradient-text">
                      From {formatPrice(event.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2
                     flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-border/50
                       flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="page-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <StatTile
                key={stat.label}
                value={stat.value}
                label={stat.label}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="page-container">
          <FadeIn className="text-center space-y-4 mb-16">
            <Badge
              variant="outline"
              className="px-4 py-1.5 border-violet-500/30
                         text-violet-400 bg-violet-500/10"
            >
              Why InstaTickets
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need,{" "}
              <span className="gradient-text">nothing you don&apos;t</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete ticketing system built with production-grade
              security and a buyer-first experience.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={i * 0.08}>
                  <div
                    className={cn(
                      "group relative rounded-2xl border border-border/50",
                      "bg-card p-6 space-y-4",
                      "hover:border-violet-500/30 hover:-translate-y-1",
                      "transition-all duration-300",
                      "hover:shadow-xl hover:shadow-violet-500/5"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      feature.bg
                    )}>
                      <Icon className={cn("w-6 h-6", feature.color)} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-base">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground
                                    leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0
                                  group-hover:opacity-100 transition-opacity
                                  pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, " +
                          "rgba(124,58,237,0.03), " +
                          "rgba(192,38,211,0.03))",
                      }}
                    />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="section bg-card/30 border-y border-border/50">
        <div className="page-container">
          <FadeIn className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Three steps to{" "}
              <span className="gradient-text">your event</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8
                          relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/3
                            right-1/3 h-px bg-gradient-to-r
                            from-violet-500/50 to-fuchsia-500/50" />

            {[
              {
                step: "01",
                title: "Find your event",
                description:
                  "Browse concerts, conferences, and festivals " +
                  "happening near you.",
                icon: "🎯",
              },
              {
                step: "02",
                title: "Choose your tier",
                description:
                  "Pick from VIP, Regular, or Early Bird tickets " +
                  "with live availability.",
                icon: "🎟️",
              },
              {
                step: "03",
                title: "Pay and go",
                description:
                  "Instant ticket delivery via M-Pesa or card. " +
                  "Your code is ready.",
                icon: "⚡",
              },
            ].map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center
                                space-y-4">
                  {/* Step number + icon */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl gradient-bg
                                    flex items-center justify-center
                                    text-2xl shadow-lg
                                    shadow-violet-500/25">
                      {step.icon}
                    </div>
                    <span
                      className="absolute -top-3 -right-3 text-xs
                                  font-mono font-bold text-violet-400
                                  glass px-1.5 py-0.5 rounded-md"
                    >
                      {step.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <p className="text-muted-foreground text-sm
                                  max-w-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="page-container">
          <FadeIn>
            <div
              className="relative rounded-3xl overflow-hidden p-8 md:p-16
                          text-center"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 gradient-bg opacity-90" />

              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, " +
                    "white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-5xl font-bold
                                  text-white leading-tight">
                    Ready to sell your first ticket?
                  </h2>
                  <p className="text-white/80 text-lg max-w-xl mx-auto">
                    Create an organizer account in 30 seconds and
                    launch your event today.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3
                                justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-violet-700
                               hover:bg-white/90 gap-2 h-12 px-8
                               font-semibold"
                    asChild
                  >
                    <Link href="/register">
                      Get started — it&apos;s free
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white
                               hover:bg-white/10 gap-2 h-12 px-8
                               font-semibold"
                    asChild
                  >
                    <Link href="/events">
                      Browse events
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}