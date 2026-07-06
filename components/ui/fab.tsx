"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Floating action button — the primary "add" action on mobile, where the
// inline toolbar button is hidden. Fixed to the bottom-right, thumb-reach.
export function Fab({
  onClick,
  label,
  disabled,
  className,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "fixed right-5 bottom-5 z-40 size-14 rounded-full p-0 shadow-lg shadow-primary/30 md:hidden",
        className,
      )}
    >
      <Plus className="size-6" />
    </Button>
  );
}
