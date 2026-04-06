"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Scan,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScannerSetupProps {
  onSave: (key: string) => void;
}

export default function ScannerSetup({ onSave }: ScannerSetupProps) {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError("API key is required");
      return;
    }
    if (key.trim().length < 8) {
      setError("API key looks too short — check again");
      return;
    }
    setError("");
    onSave(key.trim());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6
                  bg-gradient-to-br from-violet-950 via-purple-900
                  to-fuchsia-950"
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-sm space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Logo mark */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-3xl bg-white/10
                          backdrop-blur-sm border border-white/20
                          flex items-center justify-center
                          shadow-2xl shadow-black/30"
            >
              <Scan className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Ticket className="w-4 h-4 text-fuchsia-300" />
              <span className="text-sm font-medium text-fuchsia-300 uppercase tracking-widest">
                InstaTickets
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Door Scanner
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Enter your scanner API key to begin validating tickets at
              the venue entrance.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div
          className="bg-white/10 backdrop-blur-xl rounded-3xl
                      border border-white/20 p-6 space-y-5
                      shadow-2xl shadow-black/20"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="apiKey"
                className="text-white/80 text-sm font-medium
                           flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                Scanner API Key
              </Label>

              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your API key..."
                  className="bg-white/10 border-white/20 text-white
                             placeholder:text-white/30 pr-10 h-12
                             focus-visible:ring-white/30
                             focus-visible:border-white/40"
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-white/40 hover:text-white/80
                             transition-colors"
                  tabIndex={-1}
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-xs flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400" />
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-white text-violet-700
                         hover:bg-white/90 font-bold text-base gap-2
                         transition-all"
            >
              Start Scanning
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Dev hint */}
          <div
            className="rounded-xl border border-white/10
                        bg-white/5 px-3 py-2.5 space-y-1"
          >
            <p className="text-xs text-white/50 uppercase tracking-wide font-semibold">
              Development
            </p>
            <p className="text-xs text-white/60">
              Use the value of{" "}
              <code className="text-white/80 font-mono bg-white/10 px-1 rounded">
                SCANNER_API_KEY
              </code>{" "}
              from your backend{" "}
              <code className="text-white/80 font-mono bg-white/10 px-1 rounded">
                .env
              </code>{" "}
              file.
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
          <Shield className="w-3.5 h-3.5" />
          Key stored in session only — clears when tab closes
        </div>
      </motion.div>
    </div>
  );
}