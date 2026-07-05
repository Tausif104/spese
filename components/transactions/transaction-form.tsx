"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionSchema,
  type TransactionInput,
} from "@/lib/validation/transaction";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export type TransactionFormValues = TransactionInput;

const empty: TransactionFormValues = {
  type: "EXPENSE",
  categoryId: "",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

export function TransactionForm({
  open,
  onOpenChange,
  categories,
  initial,
  lockedType,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  initial?: TransactionFormValues | null;
  lockedType?: TransactionInput["type"];
  onSave: (values: TransactionFormValues) => void;
}) {
  const defaults = initial ?? {
    ...empty,
    type: lockedType ?? empty.type,
  };
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) form.reset(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial, lockedType, form]);

  const type = form.watch("type");
  const options = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );

  const typeItems = { EXPENSE: "Expense", INCOME: "Income" };
  const categoryItems = options.map((c) => ({ value: c.id, label: c.name }));
  const noun =
    lockedType === "INCOME"
      ? "income"
      : lockedType === "EXPENSE"
        ? "expense"
        : "transaction";

  function submit(values: TransactionFormValues) {
    onSave(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edit" : "Add"} {noun}
          </DialogTitle>
          <DialogDescription>
            {lockedType === "INCOME"
              ? "Record an income entry."
              : lockedType === "EXPENSE"
                ? "Record an expense entry."
                : "Record an expense or income entry."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className={cn("grid gap-4", lockedType ? "grid-cols-1" : "grid-cols-2")}>
              {!lockedType && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        items={typeItems}
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v ?? "EXPENSE");
                          form.setValue("categoryId", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EXPENSE">Expense</SelectItem>
                          <SelectItem value="INCOME">Income</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    items={categoryItems}
                    value={field.value}
                    onValueChange={(v) => field.onChange(v ?? "")}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{initial ? "Save changes" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
