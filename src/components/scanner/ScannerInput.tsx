"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Camera,
  X,
  Keyboard,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScannerInputProps {
  onScan: (code: string) => void;
  isScanning: boolean;
}

export default function ScannerInput({
  onScan,
  isScanning,
}: ScannerInputProps) {
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when the component mounts
  // so venue staff can immediately start scanning with
  // a physical barcode scanner (which acts like a keyboard)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isScanning) return;
    onScan(code.trim());
    setCode("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Physical barcode scanners send Enter after the code
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scan area visual */}
      <div className="flex justify-center">
        <div className="relative w-56 h-56">
          {/* Animated scan frame corners */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
            (pos, i) => (
              <div
                key={pos}
                className={cn(
                  "absolute w-8 h-8",
                  pos,
                  i === 0 && "border-t-2 border-l-2",
                  i === 1 && "border-t-2 border-r-2",
                  i === 2 && "border-b-2 border-l-2",
                  i === 3 && "border-b-2 border-r-2",
                  isFocused
                    ? "border-violet-400"
                    : "border-white/30"
                )}
                style={{ borderRadius: "2px" }}
              />
            )
          )}

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {isScanning ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Loader2
                  className="w-12 h-12 text-violet-400 animate-spin"
                />
              </motion.div>
            ) : (
              <>
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center",
                    "border-2 transition-all duration-300",
                    isFocused
                      ? "border-violet-400 bg-violet-400/10"
                      : "border-white/20 bg-white/5"
                  )}
                >
                  <Search
                    className={cn(
                      "w-8 h-8 transition-colors",
                      isFocused ? "text-violet-400" : "text-white/40"
                    )}
                  />
                </div>

                {/* Scanning line animation */}
                {isFocused && (
                  <motion.div
                    className="absolute left-4 right-4 h-0.5 bg-violet-400/60"
                    animate={{ top: ["20%", "80%", "20%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-1">
        <p className="text-white font-semibold">
          {isScanning ? "Checking ticket..." : "Ready to scan"}
        </p>
        <p className="text-white/50 text-sm">
          {isScanning
            ? "Please wait"
            : "Point camera at QR code or enter code manually"}
        </p>
      </div>

      {/* Manual code input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border",
              "bg-white/10 backdrop-blur-sm px-4 py-3",
              "transition-all duration-200",
              isFocused
                ? "border-violet-400/60 bg-white/15"
                : "border-white/20"
            )}
          >
            <Keyboard className="w-5 h-5 text-white/40 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Paste or type ticket code..."
              className="flex-1 bg-transparent text-white text-sm
                         placeholder:text-white/30 outline-none
                         font-mono"
              disabled={isScanning}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {code && (
              <button
                type="button"
                onClick={() => setCode("")}
                className="text-white/40 hover:text-white/80
                           transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Camera button — UI placeholder */}
          <Button
            type="button"
            disabled
            className="h-12 bg-white/10 border border-white/20
                       text-white/60 gap-2 rounded-2xl
                       cursor-not-allowed"
          >
            <Camera className="w-4 h-4" />
            Camera
          </Button>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={!code.trim() || isScanning}
            className="h-12 bg-violet-500 hover:bg-violet-400
                       text-white font-bold gap-2 rounded-2xl
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all"
          >
            {isScanning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Validate
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Physical scanner note */}
      <p className="text-center text-white/30 text-xs">
        Physical barcode scanners work automatically — they send
        Enter after the code
      </p>
    </div>
  );
}