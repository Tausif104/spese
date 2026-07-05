"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarBlank } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Parse/serialize as local yyyy-mm-dd so the calendar never shifts a day across
// timezones (the value contract the forms already use).
function parseYmd(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  id,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseYmd(value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start rounded-3xl font-normal",
              !selected && "text-muted-foreground",
            )}
          />
        }
      >
        <CalendarBlank className="size-4" />
        {selected ? format(selected, "MMM d, yyyy") : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            if (date) {
              onChange(toYmd(date));
              setOpen(false);
            }
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
