"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function QuantitySelector({
  value,
  min = 0,
  max = 10,
  onChange,
  className,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border/50",
        "bg-card p-1",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={decrement}
        disabled={value <= min}
        className="w-8 h-8 rounded-lg disabled:opacity-30"
      >
        <Minus className="w-3.5 h-3.5" />
      </Button>

      <span
        className="w-8 text-center text-sm font-bold
                   tabular-nums select-none"
      >
        {value}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={increment}
        disabled={value >= max}
        className="w-8 h-8 rounded-lg disabled:opacity-30"
      >
        <Plus className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}