"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const currencies = Intl.supportedValuesOf("currency");
const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });

function label(code: string): string {
  try {
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function CurrencyCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
          />
        }
      >
        <span className="truncate">
          {value} — {label(value)}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className="w-(--anchor-width) min-w-[260px] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search currency…" />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((code) => (
                <CommandItem
                  key={code}
                  value={`${code} ${label(code)}`}
                  onSelect={() => {
                    onChange(code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === code ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="font-medium">{code}</span>
                  <span className="truncate text-muted-foreground">
                    {label(code)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
