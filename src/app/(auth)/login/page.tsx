"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AuthBackground from "@/components/auth/AuthBackground";
import PasswordInput from "@/components/auth/PasswordInput";
import FormField from "@/components/auth/FormField";
import { useAuth } from "@/lib/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validators/authSchemas";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2">

      {/* ── Left — Form panel ───────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            {/* Back to home */}
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
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Redirect notice */}
          {redirect && (
            <div className="rounded-xl border border-amber-500/30
                            bg-amber-500/10 px-4 py-3">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Please log in to access that page.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                className={errors.password
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : ""}
              />
            </FormField>

            {/* Forgot password link */}
            <div className="flex justify-end -mt-2">
              <Link
                href="#"
                className="text-xs text-muted-foreground
                           hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 gradient-bg hover:opacity-90
                         transition-opacity gap-2 font-semibold"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              New to InstaTickets?
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Register CTA */}
          <Button
            variant="outline"
            className="w-full h-11 border-border/50
                       hover:border-violet-500/50 hover:bg-violet-500/5
                       font-medium gap-2"
            asChild
          >
            <Link href="/register">
              Create an account
            </Link>
          </Button>

          {/* Demo credentials hint */}
          <div className="rounded-xl border border-border/50
                          bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground
                          uppercase tracking-wide">
              Test credentials
            </p>
            <div className="space-y-1">
              {[
                {
                  label: "Organizer",
                  email: "organizer@instatickets.com",
                  pass: "securepass123",
                },
                {
                  label: "Buyer",
                  email: "buyer@instatickets.com",
                  pass: "buyerpass123",
                },
              ].map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-center justify-between
                             text-xs text-muted-foreground"
                >
                  <span className="font-medium text-foreground">
                    {cred.label}
                  </span>
                  <span className="font-mono">{cred.email}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-1">
                Password:{" "}
                <code className="font-mono text-xs bg-muted px-1
                                  rounded">
                  securepass123
                </code>{" "}
                /{" "}
                <code className="font-mono text-xs bg-muted px-1
                                  rounded">
                  buyerpass123
                </code>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right — Decorative panel (desktop only) ─────────────────────── */}
      <div className="hidden lg:block">
        <AuthBackground />
      </div>
    </div>
  );
}