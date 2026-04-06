import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, differenceInSeconds } from "date-fns";
import type { TierAvailability, OrderStatus } from "@/types";

// shadcn's cn utility — merges Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a price number as KES currency
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format a date string for display
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "EEE, MMM d yyyy");
}

// Format a date string with time
export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
}

// Relative time — "3 hours ago", "in 2 days"
export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

// Returns true if the date is in the past
export function isExpired(dateStr: string): boolean {
  return isPast(new Date(dateStr));
}

// Seconds remaining until a date (for countdown timers)
export function secondsUntil(dateStr: string): number {
  return Math.max(0, differenceInSeconds(new Date(dateStr), new Date()));
}

// Tailwind color class for each tier availability state
export function availabilityColor(availability: TierAvailability): string {
  const map: Record<TierAvailability, string> = {
    AVAILABLE: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    COMING_SOON: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    SALE_ENDED: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
    SOLD_OUT: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return map[availability];
}

// Human-readable availability label
export function availabilityLabel(availability: TierAvailability): string {
  const map: Record<TierAvailability, string> = {
    AVAILABLE: "Available",
    COMING_SOON: "Coming Soon",
    SALE_ENDED: "Sale Ended",
    SOLD_OUT: "Sold Out",
  };
  return map[availability];
}

// Tailwind color class for order status
export function orderStatusColor(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    PENDING: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    PAID: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    EXPIRED: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
    CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return map[status];
}

// Truncate a string to a max length
export function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}...` : str;
}

// Generate a placeholder Unsplash image URL for events
// Uses a consistent seed based on the event ID so the same event
// always shows the same image
export function getEventImageUrl(eventId: string, width = 800, height = 400): string {
  const seeds = [
    "concert", "festival", "conference", "party",
    "show", "event", "music", "tech",
  ];
  const seed = seeds[eventId.charCodeAt(0) % seeds.length];
  return `https://images.unsplash.com/photo-${getUnsplashPhotoId(seed)}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

// Curated Unsplash photo IDs for event categories
function getUnsplashPhotoId(seed: string): string {
  const photos: Record<string, string> = {
    concert: "1540039155733-adcf745f7b3f",
    festival: "1533174072545-7a4b6ad7a6c3",
    conference: "1540575467537-b5cf5c1aec8f",
    party: "1527529482837-4698179dc6ce",
    show: "1514525253161-7a46d19cd819",
    event: "1492684223066-81342ee5ff30",
    music: "1501386761520-74fc1e36571a",
    tech: "1488590528505-98d2b5aba04b",
  };
  return photos[seed] ?? photos.event;
}