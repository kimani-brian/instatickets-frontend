"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ArrowRight,
  Ticket,
  CheckCircle,
  Building2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import AuthBackground from "@/components/auth/AuthBackground";
import PasswordInput from "@/components/auth/PasswordInput";
import FormField from "@/components/auth/FormField";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validators/authSchemas";

// Role options shown as large clickable cards
const ROLE_OPTIONS = [
  {
    value: "BUYER" as const,
    icon: User,
    title: "Ticket Buyer",
    description: "Browse events and purchase tickets",
    perks: ["Browse all events", "Buy tickets instantly", "View your orders"],
    color: "fuchsia",
    gradient: "from-fuchsia-500/20 to-fuchsia-600/10",
    border: "border-fuchsia-500",
    iconBg: "bg-fuchsia-500/10",
    iconColor: "text-fuchsia-500",
    checkColor: "text-fuchsia-500",
    perkClass: "border-fuchsia-500/30 text-fuchsia-500",
  },
  {
    value: "ORGANIZER" as const,
    icon: Building2,
    title: "Event Organizer",
    description: "Create and manage your events",
    perks: [
      "Create events & tiers",
      "Track ticket sales",
      "View all orders",
    ],
    color: "violet",
    gradient: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    checkColor: "text-violet-500",
    perkClass: "border-violet-500/30 text-violet-500",
  },
];

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;
  const strengthLabel =
    score === 0
      ? ""
      : score === 1
      ? "Weak"
      : score === 2
      ? "Fair"
      : "Strong";

  const barColor =
    score === 1
      ? "bg-red-500"
      : score === 2
      ? "bg-amber-500"
      : "bg-emerald-500";

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full transition-all", barColor)}
            animate={{ width: `${(score / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span
          className={cn(
            "text-xs font-medium w-12",
            score === 1
              ? "text-red-500"
              : score === 2
              ? "text-amber-500"
              : "text-emerald-500"
          )}
        >
          {strengthLabel}
        </span>
      </div>

      {/* Requirement pills */}
      <div className="flex gap-2 flex-wrap">
        {checks.map((check) => (
          <span
            key={check.label}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full border transition-colors",
              check.pass
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : "bg-muted border-border text-muted-foreground"
            )}
          >
            {check.pass ? "✓ " : ""}
            {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"ORGANIZER" | "BUYER" | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  const handleRoleSelect = async (role: "ORGANIZER" | "BUYER") => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
    await trigger("role");
  };

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2">

      {/* ── Left — Form ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 lg:p-16
                      overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-7 py-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm
                         text-muted-foreground hover:text-foreground
                         transition-colors mb-4"
            >
              <Ticket className="w-3.5 h-3.5" />
              InstaTickets
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Join East Africa&apos;s fastest growing ticketing platform
            </p>
          </div>

          {/* ── STEP 1: Role selector ─────────────────────────────────── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground flex
                          items-center gap-2">
              <span className="w-5 h-5 rounded-full gradient-bg text-white
                               text-xs flex items-center justify-center
                               flex-shrink-0">
                1
              </span>
              I want to...
            </p>

            <div className="grid grid-cols-1 gap-3">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.value;

                return (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => handleRoleSelect(opt.value)}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "relative w-full text-left rounded-2xl border-2",
                      "p-4 transition-all duration-200 group",
                      isSelected
                        ? `${opt.border} bg-gradient-to-br ${opt.gradient}`
                        : "border-border/50 bg-card hover:border-border"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        "flex-shrink-0 transition-colors",
                        isSelected ? opt.iconBg : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5 transition-colors",
                          isSelected
                            ? opt.iconColor
                            : "text-muted-foreground"
                        )} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">
                            {opt.title}
                          </p>
                          {isSelected && (
                            <CheckCircle className={cn(
                              "w-4 h-4 flex-shrink-0",
                              opt.checkColor
                            )} />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {opt.description}
                        </p>

                        {/* Perks — shown when selected */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {opt.perks.map((perk) => (
                                  <span
                                    key={perk}
                                    className={cn(
                                      "text-xs px-2 py-0.5 rounded-full",
                                      "bg-background/50 border",
                                      isSelected
                                        ? opt.perkClass
                                        : "border-border text-muted-foreground"
                                    )}
                                  >
                                    ✓ {perk}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {errors.role && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full
                                 bg-destructive" />
                {errors.role.message}
              </p>
            )}
          </div>

          {/* ── STEP 2: Account details ───────────────────────────────── */}
          <AnimatePresence>
            {selectedRole && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <p className="text-sm font-semibold text-foreground flex
                              items-center gap-2">
                  <span className="w-5 h-5 rounded-full gradient-bg
                                   text-white text-xs flex items-center
                                   justify-center flex-shrink-0">
                    2
                  </span>
                  Your account details
                </p>

                <FormField
                  label="Email address"
                  htmlFor="email"
                  error={errors.email?.message}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    {...register("email")}
                    className={errors.email
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""}
                  />
                </FormField>

                <FormField
                  label="Password"
                  htmlFor="password"
                  error={errors.password?.message}
                >
                  <PasswordInput
                    id="password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    {...register("password")}
                    className={errors.password
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""}
                  />
                  <PasswordStrength password={password ?? ""} />
                </FormField>

                <FormField
                  label="Confirm password"
                  htmlFor="confirmPassword"
                  error={errors.confirmPassword?.message}
                >
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""}
                  />
                </FormField>

                {/* Terms notice */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By creating an account you agree to our{" "}
                  <Link
                    href="#"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full h-11 gradient-bg hover:opacity-90
                             transition-opacity gap-2 font-semibold"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Sign in link */}
          <div>
            <Separator className="mb-6" />
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline
                           underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right — Decorative panel ─────────────────────────────────────── */}
      <div className="hidden lg:block">
        <AuthBackground />
      </div>
    </div>
  );
}