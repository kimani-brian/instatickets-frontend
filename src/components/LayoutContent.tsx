"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();

  // 🚫 Hide Navbar & Footer on scanner routes
  const isScannerPage = pathname.startsWith("/scanner");

  return (
    <>
      {!isScannerPage && <Navbar />}

      <main className={`flex-1 ${!isScannerPage ? "pt-16" : ""}`}>
        {children}
      </main>

      {!isScannerPage && <Footer />}
    </>
  );
}
