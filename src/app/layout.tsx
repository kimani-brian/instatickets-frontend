import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import LayoutContent from "@/components/LayoutContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InstaTickets — Event Ticketing for East Africa",
    template: "%s | InstaTickets",
  },
  description:
    "Buy and sell event tickets instantly. Modern, secure, and built for East Africa.",
  keywords: ["tickets", "events", "nairobi", "kenya", "concerts", "conferences"],
  authors: [{ name: "InstaTickets" }],
  openGraph: {
    title: "InstaTickets",
    description: "Buy and sell event tickets instantly.",
    type: "website",
    locale: "en_KE",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans min-h-screen flex flex-col`}
      >
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
