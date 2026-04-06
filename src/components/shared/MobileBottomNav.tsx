"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Ticket,
  Plus,
  ShoppingBag,
  Search,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

interface NavLink {
  href: string;
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isOrganizer = user?.role === "ORGANIZER";

  const organizerLinks: NavLink[] = [
    {
      href: "/organizer",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/organizer/events/new",
      icon: Plus,
      label: "Create",
      highlight: true,
    },
    {
      href: "/events",
      icon: Search,
      label: "Browse",
    },
  ];

  const buyerLinks: NavLink[] = [
    {
      href: "/buyer",
      icon: ShoppingBag,
      label: "My Orders",
    },
    {
      href: "/events",
      icon: Search,
      label: "Browse",
    },
    {
      href: "/buyer",
      icon: Ticket,
      label: "Tickets",
    },
  ];

  const links = isOrganizer ? organizerLinks : buyerLinks;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden
                  bg-background/90 backdrop-blur-xl border-t
                  border-border/50 pb-safe"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href ||
            (link.href !== "/events" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="flex flex-col items-center gap-1 px-4 py-2
                         relative min-w-0"
            >
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 rounded-2xl gradient-bg-subtle
                             border border-violet-500/20"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <div
                className={cn(
                  "relative z-10 w-6 h-6 flex items-center justify-center",
                  link.highlight
                    ? "w-10 h-10 rounded-xl gradient-bg shadow-lg shadow-violet-500/30"
                    : ""
                )}
              >
                <Icon
                  className={cn(
                    "transition-colors",
                    link.highlight
                      ? "w-5 h-5 text-white"
                      : "w-5 h-5",
                    isActive && !link.highlight
                      ? "text-primary"
                      : !link.highlight
                      ? "text-muted-foreground"
                      : ""
                  )}
                />
              </div>

              <span
                className={cn(
                  "text-[10px] font-medium relative z-10 truncate",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}