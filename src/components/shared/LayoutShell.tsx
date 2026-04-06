"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import MobileBottomNav from "@/components/shared/MobileBottomNav";

const EXCLUDED_PATHS = ["/scanner"];

// Dashboard paths get the mobile bottom nav
const DASHBOARD_PATHS = ["/organizer", "/buyer"];

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isExcluded = EXCLUDED_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  const isDashboard = DASHBOARD_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
      {isDashboard && <MobileBottomNav />}
      <Footer />
    </>
  );
}