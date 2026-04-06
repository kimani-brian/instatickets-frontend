"use client";

import { motion } from "framer-motion";
import { Ticket, Zap, Shield, Globe, Star, Music } from "lucide-react";

// Floating icons that animate in the auth page background visual panel
const FLOATING_ITEMS = [
  { icon: Ticket, x: "15%", y: "20%", delay: 0, size: 28 },
  { icon: Zap, x: "75%", y: "15%", delay: 0.3, size: 22 },
  { icon: Shield, x: "85%", y: "60%", delay: 0.6, size: 26 },
  { icon: Globe, x: "10%", y: "70%", delay: 0.9, size: 24 },
  { icon: Star, x: "50%", y: "80%", delay: 1.2, size: 20 },
  { icon: Music, x: "60%", y: "30%", delay: 1.5, size: 22 },
];

// Decorative stats shown on the right panel
const PANEL_STATS = [
  { value: "50K+", label: "Tickets sold" },
  { value: "1.2K+", label: "Events hosted" },
  { value: "99.9%", label: "Uptime" },
];

export default function AuthBackground() {
  return (
    <div className="relative w-full h-full overflow-hidden
                    bg-gradient-to-br from-violet-950 via-purple-900
                    to-fuchsia-950 flex flex-col items-center
                    justify-center p-12">

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Large glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full
                      bg-violet-500/30 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full
                      bg-fuchsia-500/30 blur-3xl" />

      {/* Floating icon pills */}
      {FLOATING_ITEMS.map(({ icon: Icon, x, y, delay, size }) => (
        <motion.div
          key={`${x}-${y}`}
          className="absolute glass rounded-xl p-2.5 border-white/20"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1],
            scale: [0, 1.1, 1],
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay },
            scale: { duration: 0.5, delay },
            y: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: delay + 0.5,
            },
          }}
        >
          <Icon
            style={{ width: size, height: size }}
            className="text-white/80"
          />
        </motion.div>
      ))}

      {/* Central content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-10 text-center text-white space-y-6
                   max-w-sm"
      >
        {/* Logo mark */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20
                          backdrop-blur-sm border border-white/30
                          flex items-center justify-center">
            <Ticket className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold leading-tight">
            Your events,{" "}
            <span className="text-fuchsia-300">elevated</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Join thousands of organizers and buyers on East Africa&apos;s
            most trusted ticketing platform.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {PANEL_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-xl
                         border border-white/20 p-3 text-center"
            >
              <div className="text-xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-white/60 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl
                        border border-white/20 p-4 text-left space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-bg
                            flex items-center justify-center
                            text-white text-xs font-bold">
              AK
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Amina K.
              </p>
              <p className="text-xs text-white/60">
                Event Organizer, Nairobi
              </p>
            </div>
          </div>
          <p className="text-xs text-white/80 leading-relaxed italic">
            &ldquo;InstaTickets transformed how I run my events.
            Sold out in 2 hours.&rdquo;
          </p>
        </div>
      </motion.div>
    </div>
  );
}