"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreditCard,
  Lock,
  Smartphone,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";

// Payment method options
type PaymentMethod = "card" | "mpesa";

const cardSchema = z.object({
  cardName: z.string().min(2, "Name is required"),
  cardNumber: z
    .string()
    .min(16, "Enter a valid card number")
    .max(19),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Format: MM/YY"),
  cvv: z.string().min(3, "Enter CVV").max(4),
});

const mpesaSchema = z.object({
  phone: z
    .string()
    .regex(/^(\+254|0)[17]\d{8}$/, "Enter a valid Kenyan number"),
});

type CardFormData = z.infer<typeof cardSchema>;
type MpesaFormData = z.infer<typeof mpesaSchema>;

interface PaymentSimulatorProps {
  amount: number;
  onPay: () => void;
  isLoading: boolean;
}

// Formats raw digits as a credit card number: 4111 1111 1111 1111
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

// Formats expiry as MM/YY
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export default function PaymentSimulator({
  amount,
  onPay,
  isLoading,
}: PaymentSimulatorProps) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");

  const cardForm = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const mpesaForm = useForm<MpesaFormData>({
    resolver: zodResolver(mpesaSchema),
    defaultValues: { phone: "" },
  });

  const handleCardSubmit = () => {
    onPay();
  };

  const handleMpesaSubmit = () => {
    onPay();
  };

  const cardName = useWatch({
    control: cardForm.control,
    name: "cardName",
  });

  return (
    <div className="space-y-5">
      {/* Method selector tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted">
        {(
          [
            {
              id: "card" as const,
              label: "Card",
              icon: CreditCard,
            },
            {
              id: "mpesa" as const,
              label: "M-Pesa",
              icon: Smartphone,
            },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-lg",
              "text-sm font-medium transition-all duration-200",
              method === id
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Card payment form */}
      {method === "card" && (
        <motion.form
          key="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={cardForm.handleSubmit(handleCardSubmit)}
          className="space-y-4"
        >
          {/* Simulated card preview */}
          <div
            className="relative h-44 rounded-2xl overflow-hidden p-5
                        flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)",
            }}
          >
            {/* Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, " +
                  "white 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Chip */}
            <div className="flex items-start justify-between relative">
              <div
                className="w-10 h-7 rounded-md border-2
                            border-white/40 bg-white/20"
              />
              <div className="text-white text-xs font-bold tracking-widest">
                VISA
              </div>
            </div>

            {/* Card number */}
            <div className="relative space-y-2">
              <p className="text-white font-mono text-lg tracking-[0.2em]">
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between text-white/80 text-xs">
                <div>
                  <p className="text-white/50 text-[10px] uppercase">
                    Card Holder
                  </p>
                  <p className="font-medium truncate max-w-[140px]">
                    {cardName || "YOUR NAME"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px] uppercase">
                    Expires
                  </p>
                  <p className="font-medium">
                    {expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test card hint */}
          <div
            className="rounded-xl border border-violet-500/20
                        bg-violet-500/5 px-3 py-2.5 text-xs
                        text-violet-500 flex items-center gap-2"
          >
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Use any details — this is a simulation. Try:{" "}
            <code className="font-mono">4111 1111 1111 1111</code>
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground
                                uppercase tracking-wide">
                Cardholder Name
              </Label>
              <Input
                placeholder="Jane Doe"
                {...cardForm.register("cardName")}
                className={
                  cardForm.formState.errors.cardName
                    ? "border-destructive"
                    : ""
                }
              />
              {cardForm.formState.errors.cardName && (
                <p className="text-xs text-destructive">
                  {cardForm.formState.errors.cardName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground
                                uppercase tracking-wide">
                Card Number
              </Label>
              <div className="relative">
                <Input
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setCardNumber(formatted);
                    cardForm.setValue(
                      "cardNumber",
                      formatted.replace(/\s/g, "")
                    );
                  }}
                  maxLength={19}
                  className={cn(
                    "font-mono pr-10",
                    cardForm.formState.errors.cardNumber
                      ? "border-destructive"
                      : ""
                  )}
                />
                <CreditCard
                  className="absolute right-3 top-1/2 -translate-y-1/2
                               w-4 h-4 text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground
                                  uppercase tracking-wide">
                  Expiry
                </Label>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => {
                    const formatted = formatExpiry(e.target.value);
                    setExpiry(formatted);
                    cardForm.setValue("expiry", formatted);
                  }}
                  maxLength={5}
                  className={
                    cardForm.formState.errors.expiry
                      ? "border-destructive"
                      : ""
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground
                                  uppercase tracking-wide">
                  CVV
                </Label>
                <Input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  {...cardForm.register("cvv")}
                  className={
                    cardForm.formState.errors.cvv
                      ? "border-destructive"
                      : ""
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Pay button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 gradient-bg hover:opacity-90
                       transition-opacity gap-2 font-bold text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing payment...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay {formatPrice(amount)}
              </>
            )}
          </Button>
        </motion.form>
      )}

      {/* M-Pesa payment form */}
      {method === "mpesa" && (
        <motion.form
          key="mpesa"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={mpesaForm.handleSubmit(handleMpesaSubmit)}
          className="space-y-4"
        >
          {/* M-Pesa branding */}
          <div
            className="rounded-2xl p-5 text-center space-y-2"
            style={{
              background:
                "linear-gradient(135deg, #00a550 0%, #007a3d 100%)",
            }}
          >
            <div className="text-white font-bold text-2xl tracking-tight">
              M-PESA
            </div>
            <p className="text-white/80 text-sm">
              Safaricom Mobile Money
            </p>
            <div className="text-white text-3xl font-bold">
              {formatPrice(amount)}
            </div>
          </div>

          {/* Test number hint */}
          <div
            className="rounded-xl border border-emerald-500/20
                        bg-emerald-500/5 px-3 py-2.5 text-xs
                        text-emerald-600 dark:text-emerald-400
                        flex items-center gap-2"
          >
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Simulation mode — use any valid Kenyan number.
            Try: <code className="font-mono">0712345678</code>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground
                              uppercase tracking-wide">
              M-Pesa Phone Number
            </Label>
            <div className="relative">
              <Smartphone
                className="absolute left-3 top-1/2 -translate-y-1/2
                             w-4 h-4 text-muted-foreground"
              />
              <Input
                placeholder="+254 712 345 678"
                {...mpesaForm.register("phone")}
                className={cn(
                  "pl-9",
                  mpesaForm.formState.errors.phone
                    ? "border-destructive"
                    : ""
                )}
              />
            </div>
            {mpesaForm.formState.errors.phone && (
              <p className="text-xs text-destructive">
                {mpesaForm.formState.errors.phone.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              In production, an STK push would be sent to this number.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 font-bold text-base gap-2 text-white"
            style={{ background: "#00a550" }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending STK push...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                Pay with M-Pesa
              </>
            )}
          </Button>
        </motion.form>
      )}
    </div>
  );
}