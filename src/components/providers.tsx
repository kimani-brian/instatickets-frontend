"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

// Providers wraps the entire app and must be a client component.
// Keeping it in its own file prevents the root layout from being
// forced into a client component (which would lose RSC benefits).
export default function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient is created inside state so it's not shared across requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,       // 1 minute before refetch
            retry: 1,                    // retry once on failure
            refetchOnWindowFocus: false, // don't refetch on tab focus
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* next-themes handles dark/light toggle */}
      <ThemeProvider
        attribute="class"       // toggles .dark class on <html>
        defaultTheme="dark"     // dark by default
        enableSystem={false}    // don't follow OS preference
        disableTransitionOnChange={false}
      >
        {children}

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: "var(--font-inter)" },
          }}
        />

        {/* Query devtools in development only */}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}