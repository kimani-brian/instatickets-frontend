"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  Edit3,
  Save,
  X,
  Loader2,
  BarChart3,
  ShoppingBag,
  AlertTriangle,
  Calendar,
  MapPin,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InventoryBar from "@/components/dashboard/InventoryBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { eventsApi } from "@/lib/api/events";
import {
  useOrganizerEvent,
  useUpdateEvent,
  useCancelEvent,
} from "@/lib/hooks/useOrganizer";
import {
  updateEventSchema,
  type UpdateEventFormData,
} from "@/lib/validators/eventSchemas";
import {
  cn,
  formatDateTime,
  formatPrice,
  getEventImageUrl,
} from "@/lib/utils";
import type { TierWithAvailability } from "@/types";

export default function EventManagementPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: event, isLoading: eventLoading } =
    useOrganizerEvent(eventId);

  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ["tiers", eventId],
    queryFn: () => eventsApi.getTiers(eventId),
    enabled: !!eventId,
    refetchInterval: 30_000,
  });

  const updateMutation = useUpdateEvent(eventId);
  const cancelMutation = useCancelEvent();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateEventFormData>({
    resolver: zodResolver(updateEventSchema),
    values: event
      ? {
          name: event.name,
          venue: event.venue,
          description: event.description,
          event_date: event.event_date
            ? new Date(event.event_date)
                .toISOString()
                .slice(0, 16)
            : "",
        }
      : undefined,
  });

  const onSave = (data: UpdateEventFormData) => {
    updateMutation.mutate(
      {
        ...data,
        event_date: new Date(data.event_date).toISOString(),
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleCancelEvent = () => {
    cancelMutation.mutate(eventId);
    setCancelDialogOpen(false);
  };

  if (eventLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-container py-24 text-center space-y-4">
        <p className="text-muted-foreground">Event not found</p>
        <Button variant="outline" asChild>
          <Link href="/organizer">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const isCancelled = event.status === "CANCELLED";
  const totalCapacity =
    event.ticket_tiers?.reduce(
      (s: number, t) => s + t.total_quantity,
      0
    ) ?? 0;
  const totalSold =
    (tiers as TierWithAvailability[] | undefined)?.reduce(
      (s: number, t) => s + t.quantity_sold,
      0
    ) ?? 0;
  const totalRevenue =
    (tiers as TierWithAvailability[] | undefined)?.reduce(
      (s: number, t) => s + t.quantity_sold * t.price,
      0
    ) ?? 0;

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="page-container py-5">
          <div className="flex items-center justify-between gap-4
                          flex-wrap">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                asChild
              >
                <Link href="/organizer">
                  <ChevronLeft className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-5" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg line-clamp-1">
                    {event.name}
                  </h1>
                  {isCancelled && (
                    <Badge
                      variant="outline"
                      className="text-xs text-destructive
                                 border-destructive/30 bg-destructive/10"
                    >
                      Cancelled
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Managing event
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {!isCancelled && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/events/${eventId}`}
                    target="_blank"
                    className="gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Public page
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/organizer/events/${eventId}/orders`}
                    className="gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    View orders
                  </Link>
                </Button>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        reset();
                        setIsEditing(false);
                      }}
                      className="gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit(onSave)}
                      disabled={
                        !isDirty || updateMutation.isPending
                      }
                      className="gradient-bg gap-1.5"
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      Save changes
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT — Event details ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Event details card */}
            <div className="rounded-2xl border border-border/50
                            bg-card overflow-hidden">
              {/* Banner image */}
              <div
                className="h-36 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${getEventImageUrl(
                    eventId,
                    800,
                    200
                  )})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t
                                from-card via-card/40 to-transparent" />
              </div>

              <div className="p-6 space-y-5 -mt-6 relative">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Event Name</Label>
                      <Input
                        {...register("name")}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Venue</Label>
                        <Input
                          {...register("venue")}
                          className={errors.venue ? "border-destructive" : ""}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Event Date</Label>
                        <Input
                          type="datetime-local"
                          {...register("event_date")}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Description</Label>
                      <Textarea
                        {...register("description")}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">{event.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm
                                    text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-violet-400" />
                        {formatDateTime(event.event_date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-fuchsia-400" />
                        {event.venue}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground
                                  leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory card */}
            <div className="rounded-2xl border border-border/50
                            bg-card p-6 space-y-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-500" />
                <h2 className="font-bold text-lg">
                  Live Inventory
                </h2>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground ml-auto"
                >
                  Updates every 30s
                </Badge>
              </div>

              {tiersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl bg-muted animate-pulse"
                    />
                  ))}
                </div>
              ) : tiers && tiers.length > 0 ? (
                <div className="space-y-5">
                  {(tiers as TierWithAvailability[]).map(
                    (tier, i) => (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <InventoryBar tier={tier} />
                      </motion.div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No tiers found for this event.
                </p>
              )}
            </div>

            {/* Danger zone */}
            {!isCancelled && (
              <div className="rounded-2xl border border-destructive/20
                              bg-destructive/5 p-6 space-y-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold">Danger Zone</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cancelling an event is permanent. Buyers with
                  existing tickets will keep their codes but no new
                  purchases will be possible.
                </p>
                <Dialog
                  open={cancelDialogOpen}
                  onOpenChange={setCancelDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Cancel This Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Cancel &ldquo;{event.name}&rdquo;?
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. The event will be
                        marked as cancelled and removed from public
                        listings. Buyers who already have tickets will
                        not be affected.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCancelDialogOpen(false)}
                      >
                        Keep event
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancelEvent}
                        disabled={cancelMutation.isPending}
                        className="gap-2"
                      >
                        {cancelMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Yes, cancel it
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* ── RIGHT — Quick stats ──────────────────────────────── */}
          <div className="space-y-4">
            {[
              {
                label: "Total Capacity",
                value: totalCapacity.toLocaleString(),
                sub: "tickets across all tiers",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                label: "Tickets Sold",
                value: totalSold.toLocaleString(),
                sub: `${totalCapacity > 0
                  ? Math.round((totalSold / totalCapacity) * 100)
                  : 0}% of capacity`,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
              {
                label: "Revenue",
                value: formatPrice(totalRevenue),
                sub: "from confirmed sales",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/50
                           bg-card p-5 space-y-1"
              >
                <p className="text-xs text-muted-foreground uppercase
                               tracking-wide">
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    stat.color
                  )}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.sub}
                </p>
              </motion.div>
            ))}

            {/* Quick links */}
            <div className="rounded-2xl border border-border/50
                            bg-card p-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground
                            uppercase tracking-wide">
                Quick Actions
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link
                    href={`/organizer/events/${eventId}/orders`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Manage orders
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link
                    href={`/events/${eventId}`}
                    target="_blank"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View public page
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/scanner">
                    <BarChart3 className="w-4 h-4" />
                    Open scanner
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}