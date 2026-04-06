"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  History,
  ChevronDown,
  ChevronUp,
  Ticket,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ScannerSetup from "@/components/scanner/ScannerSetup";
import ScannerInput from "@/components/scanner/ScannerInput";
import ScanResult from "@/components/scanner/ScanResult";
import ScanHistory from "@/components/scanner/ScanHistory";
import { useScanner } from "@/lib/hooks/useScanner";

export default function ScannerPage() {
  const {
    view,
    lastScan,
    history,
    isScanning,
    scan,
    reset,
    saveApiKey,
    clearApiKey,
  } = useScanner();

  const [showHistory, setShowHistory] = useState(false);

  // ── Setup screen ───────────────────────────────────────────────────────────
  if (view === "SETUP") {
    return <ScannerSetup onSave={saveApiKey} />;
  }

  // ── Result screen (full-screen overlay) ────────────────────────────────────
  if (view === "RESULT" && lastScan) {
    return <ScanResult record={lastScan} onReset={reset} />;
  }

  // ── Ready / Scanning screen ────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-b
                  from-[#0f0a1e] via-[#130d28] to-[#0a0714]"
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-4
                    border-b border-white/10"
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg gradient-bg flex
                        items-center justify-center"
          >
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">
              InstaTickets
            </p>
            <p className="text-white/40 text-xs mt-0.5">
              Scanner Mode
            </p>
          </div>
        </div>

        {/* Status indicator + logout */}
        <div className="flex items-center gap-2">
          {/* Live status dot */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs">Live</span>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={clearApiKey}
            className="text-white/40 hover:text-white/80
                       hover:bg-white/10 rounded-xl w-9 h-9"
            title="Change API key"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main scanner area */}
      <div className="flex-1 flex flex-col justify-center px-5 py-6 space-y-8">

        {/* Status message when scanning */}
        <AnimatePresence mode="wait">
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div
                className="inline-flex items-center gap-2 bg-violet-500/20
                            border border-violet-500/30 rounded-full
                            px-4 py-2 text-sm text-violet-300"
              >
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                Checking with server...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner input component */}
        <ScannerInput onScan={scan} isScanning={isScanning} />

        {/* Scan tips */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { emoji: "🎟️", tip: "One scan\nper ticket" },
            { emoji: "📱", tip: "Show the\nQR code" },
            { emoji: "✅", tip: "Green means\naccess granted" },
          ].map((item) => (
            <div
              key={item.tip}
              className="bg-white/5 border border-white/10
                         rounded-2xl py-3 px-2 space-y-1"
            >
              <div className="text-2xl">{item.emoji}</div>
              <p className="text-white/40 text-xs leading-tight whitespace-pre-line">
                {item.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scan history drawer */}
      <div className="border-t border-white/10">
        {/* History toggle button */}
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="w-full flex items-center justify-between
                     px-5 py-4 text-white/60 hover:text-white/80
                     transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <History className="w-4 h-4" />
            Scan History
            {history.length > 0 && (
              <span
                className="text-xs bg-white/10 border border-white/20
                           rounded-full px-2 py-0.5 text-white/60"
              >
                {history.length}
              </span>
            )}
          </span>
          {showHistory ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Expandable history panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                className="px-5 pb-6 max-h-96 overflow-y-auto
                            scrollbar-hide"
              >
                <ScanHistory records={history} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}