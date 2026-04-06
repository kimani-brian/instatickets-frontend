"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Variants for different transition styles
const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.01 },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}

// Wraps every page with a smooth entrance animation.
// The key={pathname} forces re-mount on route change,
// triggering the animation on every navigation.
export default function PageTransition({
  children,
  variant = "slideUp",
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      exit={variants[variant].exit}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}