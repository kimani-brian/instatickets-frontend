"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  Calendar,
  MapPin,
  FileText,
  Ticket,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import TierBuilder from "@/components/dashboard/TierBuilder";
import { useCreateEvent } from "@/lib/hooks/useOrganizer";
import {
  createEventSchema,
  type CreateEventFormData,
} from "@/lib/validators/eventSchemas";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";

// Step definitions
const STEPS = [
  {
    id: 1,
    label: "Event details",
    icon: FileText,
    description: "Basic info about your event",
  },
  {
    id: 2,
    label: "Ticket tiers",
    icon: Ticket,
    description: "Set up your ticket categories",
  },
  {
    id: 3,
    label: "Review",
    icon: Eye,
    description: "Confirm before publishing",
  },
];

// Step indicator bar at the top
function StepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isDone = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {/* Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  "border-2 transition-all duration-300 text-xs font-bold",
                  isDone
                    ? "gradient-bg border-transparent text-white"
                    : isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground bg-background"
                )}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Label — only on desktop */}
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-1 transition-colors duration-300",
                  isDone ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const { mutate: createEvent, isPending } = useCreateEvent();

  const methods = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      venue: "",
      description: "",
      event_date: "",
      tiers: [
        {
          name: "Regular",
          price: 1000,
          total_quantity: 100,
          sale_start_date: null,
          sale_end_date: null,
        },
      ],
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = methods;

  const formValues = useWatch({ control });

  // Validate current step fields before advancing
  const handleNext = async () => {
    const fieldsToValidate: Array<keyof CreateEventFormData> =
      step === 1
        ? ["name", "venue", "description", "event_date"]
        : ["tiers"];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data: CreateEventFormData) => {
    createEvent({
      name: data.name,
      venue: data.venue,
      description: data.description,
      event_date: new Date(data.event_date).toISOString(),
      tiers: data.tiers.map((t) => ({
        name: t.name,
        price: t.price,
        total_quantity: t.total_quantity,
        sale_start_date: t.sale_start_date
          ? new Date(t.sale_start_date).toISOString()
          : null,
        sale_end_date: t.sale_end_date
          ? new Date(t.sale_end_date).toISOString()
          : null,
      })),
    });
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="page-container py-5">
          <div className="flex items-center gap-3 mb-5">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 -ml-2"
              asChild
            >
              <Link href="/organizer">
                <ChevronLeft className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Create New Event</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Fill in the details and set up your ticket tiers.
              </p>
            </div>
            <StepIndicator currentStep={step} />
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="max-w-2xl mx-auto">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">

                {/* ── STEP 1: Event Details ─────────────────────────── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="rounded-2xl border border-border/50
                                    bg-card p-6 space-y-5">
                      <h2 className="font-bold text-lg flex items-center
                                     gap-2">
                        <FileText className="w-5 h-5 text-violet-500" />
                        Event Details
                      </h2>

                      {/* Event Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Event Name *</Label>
                        <Input
                          id="name"
                          placeholder="e.g. Nairobi Tech Summit 2026"
                          {...register("name")}
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Venue */}
                      <div className="space-y-1.5">
                        <Label htmlFor="venue" className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-fuchsia-500" />
                          Venue *
                        </Label>
                        <Input
                          id="venue"
                          placeholder="e.g. KICC, Nairobi"
                          {...register("venue")}
                          className={errors.venue ? "border-destructive" : ""}
                        />
                        {errors.venue && (
                          <p className="text-xs text-destructive">
                            {errors.venue.message}
                          </p>
                        )}
                      </div>

                      {/* Event Date */}
                      <div className="space-y-1.5">
                        <Label htmlFor="event_date" className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-violet-500" />
                          Event Date & Time *
                        </Label>
                        <Input
                          id="event_date"
                          type="datetime-local"
                          {...register("event_date")}
                          className={errors.event_date ? "border-destructive" : ""}
                        />
                        {errors.event_date && (
                          <p className="text-xs text-destructive">
                            {errors.event_date.message}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <Label htmlFor="description">
                          Description *
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Tell attendees what your event is about..."
                          rows={4}
                          {...register("description")}
                          className={cn(
                            "resize-none",
                            errors.description ? "border-destructive" : ""
                          )}
                        />
                        <div className="flex items-center justify-between">
                          {errors.description ? (
                            <p className="text-xs text-destructive">
                              {errors.description.message}
                            </p>
                          ) : (
                            <span />
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formValues.description?.length ?? 0}/1000
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Ticket Tiers ──────────────────────────── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="rounded-2xl border border-border/50
                                    bg-card p-6 space-y-5">
                      <div className="space-y-1">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                          <Ticket className="w-5 h-5 text-violet-500" />
                          Ticket Tiers
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Create different ticket categories with pricing
                          and optional sale windows.
                        </p>
                      </div>

                      <TierBuilder />
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: Review ────────────────────────────────── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Event summary card */}
                    <div className="rounded-2xl border border-border/50
                                    bg-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg">
                          Review Your Event
                        </h2>
                        <Badge
                          variant="outline"
                          className="text-emerald-500 border-emerald-500/30
                                     bg-emerald-500/10"
                        >
                          Ready to publish
                        </Badge>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                          {[
                            {
                              label: "Event Name",
                              value: formValues.name,
                            },
                            {
                              label: "Venue",
                              value: formValues.venue,
                            },
                            {
                              label: "Date",
                              value: formValues.event_date
                                ? formatDateTime(formValues.event_date)
                                : "—",
                            },
                            {
                              label: "Tiers",
                              value: `${formValues.tiers?.length ?? 0} tier(s)`,
                            },
                          ].map(({ label, value }) => (
                            <div key={label} className="space-y-0.5">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                {label}
                              </p>
                              <p className="text-sm font-medium truncate">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Description
                          </p>
                          <p className="text-sm text-muted-foreground
                                        leading-relaxed line-clamp-3">
                            {formValues.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tiers review */}
                    <div className="rounded-2xl border border-border/50
                                    bg-card p-6 space-y-4">
                      <h3 className="font-bold">Ticket Tiers</h3>
                      <div className="space-y-3">
                        {formValues.tiers?.map((tier, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between
                                       p-3 rounded-xl bg-muted/50
                                       border border-border/50"
                          >
                            <div className="space-y-0.5">
                              <p className="font-semibold text-sm">
                                {tier.name || "Unnamed tier"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tier.total_quantity} tickets
                              </p>
                            </div>
                            <span className="font-bold gradient-text">
                              {formatPrice(tier.price || 0)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total capacity */}
                      <div className="flex justify-between text-sm pt-2
                                      border-t border-border/50">
                        <span className="text-muted-foreground">
                          Total capacity
                        </span>
                        <span className="font-bold">
                          {formValues.tiers
                            ?.reduce(
                              (s, t) => s + (t.total_quantity || 0),
                              0
                            )
                            .toLocaleString()}{" "}
                          tickets
                        </span>
                      </div>
                    </div>

                    {/* Warning note */}
                    <div className="rounded-xl border border-amber-500/20
                                    bg-amber-500/5 px-4 py-3 text-sm
                                    text-amber-600 dark:text-amber-400">
                      ⚠️ Once published, the event will be visible to all
                      buyers. You can edit details later but cannot change
                      tier prices after tickets are sold.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gradient-bg hover:opacity-90 gap-2
                               font-semibold"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="gradient-bg hover:opacity-90 gap-2
                               font-semibold min-w-36"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Publish Event
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}