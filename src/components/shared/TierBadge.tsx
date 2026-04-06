import { Badge } from "@/components/ui/badge";
import { cn, availabilityColor, availabilityLabel } from "@/lib/utils";
import type { TierAvailability } from "@/types";

interface TierBadgeProps {
  availability: TierAvailability;
  className?: string;
}

export default function TierBadge({
  availability,
  className,
}: TierBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border",
        availabilityColor(availability),
        className
      )}
    >
      {availabilityLabel(availability)}
    </Badge>
  );
}