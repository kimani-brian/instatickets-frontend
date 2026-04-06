import { z } from "zod";

export const tierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  price: z
    .number()
    .min(0, "Price cannot be negative"),
  total_quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  sale_start_date: z.string().optional().nullable(),
  sale_end_date: z.string().optional().nullable(),
});

export const createEventSchema = z.object({
  name: z
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name is too long"),
  venue: z
    .string()
    .min(3, "Venue must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  event_date: z
    .string()
    .min(1, "Event date is required")
    .refine(
      (val) => new Date(val) > new Date(),
      "Event date must be in the future"
    ),
  tiers: z
    .array(tierSchema)
    .min(1, "Add at least one ticket tier"),
});

export const updateEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  venue: z.string().min(3, "Venue is required"),
  description: z.string().min(10, "Description is required"),
  event_date: z.string().min(1, "Event date is required"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type TierFormData = z.infer<typeof tierSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventSchema>;