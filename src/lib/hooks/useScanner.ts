"use client";

import { useState, useCallback, useEffect } from "react";
import { scannerApi } from "@/lib/api/scanner";
import { getErrorMessage } from "@/lib/api/client";

// Each scan result stored in session history
export interface ScanRecord {
  id: string;
  code: string;
  result: "GRANTED" | "ALREADY_USED" | "NOT_FOUND" | "ERROR";
  message: string;
  tierName?: string;
  eventName?: string;
  scannedAt: Date;
}

// The scanner UI has 4 distinct view states
export type ScannerView =
  | "SETUP"     // API key not yet entered
  | "READY"     // waiting for a code
  | "SCANNING"  // API call in flight
  | "RESULT";   // showing pass/fail feedback

export function useScanner() {
  const [view, setView] = useState<ScannerView>("SETUP");
  const [apiKey, setApiKey] = useState("");
  const [lastScan, setLastScan] = useState<ScanRecord | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Load persisted API key from sessionStorage on mount
  // sessionStorage clears when the tab closes — good security practice
  useEffect(() => {
    const stored = sessionStorage.getItem("scanner_api_key");
    if (stored) {
      setApiKey(stored);
      setView("READY");
    }
  }, []);

  // Save API key and move to READY state
  const saveApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    if (!trimmed) return;
    sessionStorage.setItem("scanner_api_key", trimmed);
    setApiKey(trimmed);
    setView("READY");
  }, []);

  // Clear API key and return to SETUP
  const clearApiKey = useCallback(() => {
    sessionStorage.removeItem("scanner_api_key");
    setApiKey("");
    setView("SETUP");
    setHistory([]);
    setLastScan(null);
  }, []);

  // Add a scan record to the history (max 10 kept)
  const addToHistory = useCallback((record: ScanRecord) => {
    setHistory((prev) => [record, ...prev].slice(0, 10));
  }, []);

  // Trigger haptic feedback on mobile devices
  // Vibrate API: short for success, long-short for error
  const haptic = useCallback(
    (type: "success" | "error" | "warning") => {
      if (!("vibrate" in navigator)) return;
      if (type === "success") navigator.vibrate(80);
      else if (type === "error") navigator.vibrate([120, 60, 120]);
      else navigator.vibrate(200);
    },
    []
  );

  // Main scan function — called when user submits a code
  const scan = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed || !apiKey || isScanning) return;

      setIsScanning(true);
      setView("SCANNING");

      try {
        const result = await scannerApi.scan(
          { unique_code: trimmed },
          apiKey
        );

        const record: ScanRecord = {
          id: crypto.randomUUID(),
          code: trimmed,
          result: "GRANTED",
          message: result.message,
          tierName: result.tier_name,
          eventName: result.event_name,
          scannedAt: new Date(),
        };

        setLastScan(record);
        addToHistory(record);
        haptic("success");
        setView("RESULT");
      } catch (err: unknown) {
        // Parse the error response to distinguish Already Used vs Not Found
        let result: ScanRecord["result"] = "ERROR";
        let message = "An error occurred";

        const axiosErr = err as {
          response?: { status?: number; data?: { error?: string; scanned_at?: string } };
        };

        if (axiosErr.response?.status === 409) {
          result = "ALREADY_USED";
          message =
            axiosErr.response.data?.error ?? "Ticket already used";
          haptic("error");
        } else if (axiosErr.response?.status === 404) {
          result = "NOT_FOUND";
          message = "Ticket not found";
          haptic("warning");
        } else if (axiosErr.response?.status === 401) {
          // Invalid API key — go back to setup
          clearApiKey();
          return;
        } else {
          message = getErrorMessage(err);
          haptic("error");
        }

        const record: ScanRecord = {
          id: crypto.randomUUID(),
          code: trimmed,
          result,
          message,
          scannedAt: new Date(),
        };

        setLastScan(record);
        addToHistory(record);
        setView("RESULT");
      } finally {
        setIsScanning(false);
      }
    },
    [apiKey, isScanning, addToHistory, haptic, clearApiKey]
  );

  // Return to READY state to scan the next ticket
  const reset = useCallback(() => {
    setLastScan(null);
    setView("READY");
  }, []);

  return {
    view,
    apiKey,
    lastScan,
    history,
    isScanning,
    scan,
    reset,
    saveApiKey,
    clearApiKey,
  };
}