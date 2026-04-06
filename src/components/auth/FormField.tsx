import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}

// Consistent label + input + error message layout used by every form field.
// Extracting this prevents 30+ lines of repetitive markup in each form.
export default function FormField({
  label,
  htmlFor,
  error,
  children,
  className,
  hint,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={htmlFor}
        className={cn(
          "text-sm font-medium",
          error ? "text-destructive" : "text-foreground"
        )}
      >
        {label}
      </Label>

      {children}

      {/* Hint text shown when there's no error */}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      {/* Error message — animated slide-in */}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full
                           bg-destructive flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}