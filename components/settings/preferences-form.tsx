"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  preferencesSchema,
  type PreferencesInput,
} from "@/lib/validation/settings";
import { updatePreferences } from "@/app/(app)/settings/actions";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CurrencyCombobox } from "@/components/settings/currency-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const sample = "2026-07-05";
const dateItems = {
  MED: `Medium — ${formatDate(sample, { dateFormat: "MED" })}`,
  DMY: `Day/Month/Year — ${formatDate(sample, { dateFormat: "DMY" })}`,
  MDY: `Month/Day/Year — ${formatDate(sample, { dateFormat: "MDY" })}`,
  ISO: `ISO — ${formatDate(sample, { dateFormat: "ISO" })}`,
};

export function PreferencesForm({
  currency,
  dateFormat,
}: {
  currency: string;
  dateFormat: PreferencesInput["dateFormat"];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm<PreferencesInput>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: { currency, dateFormat },
  });

  async function onSubmit(values: PreferencesInput) {
    setPending(true);
    try {
      const res = await updatePreferences(values);
      if (!res.ok) throw new Error(res.error);
      toast.success("Preferences saved");
      router.refresh();
    } catch {
      toast.error("Could not save preferences.");
    }
    setPending(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <CurrencyCombobox value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date format</FormLabel>
              <Select
                items={dateItems}
                value={field.value}
                onValueChange={(v) => field.onChange(v ?? "MED")}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MED">{dateItems.MED}</SelectItem>
                  <SelectItem value="DMY">{dateItems.DMY}</SelectItem>
                  <SelectItem value="MDY">{dateItems.MDY}</SelectItem>
                  <SelectItem value="ISO">{dateItems.ISO}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Save preferences
        </Button>
      </form>
    </Form>
  );
}
