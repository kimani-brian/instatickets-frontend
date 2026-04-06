"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function EventFilters({
  search,
  onSearchChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2
                           w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 bg-card border-border/50
                     focus-visible:ring-primary/50 h-11"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange("")}
            className="absolute right-1 top-1/2 -translate-y-1/2
                       w-7 h-7 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}