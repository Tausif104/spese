"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, type BudgetInput } from "@/lib/validation/budget";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function BudgetForm({
  open,
  onOpenChange,
  categories,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[]; // selectable expense categories (excludes ones already budgeted, unless editing)
  initial?: BudgetInput | null;
  onSave: (values: BudgetInput) => void;
}) {
  const isEdit = Boolean(initial);
  const form = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: initial ?? { categoryId: "", amount: 0 },
  });

  useEffect(() => {
    if (open) form.reset(initial ?? { categoryId: "", amount: 0 });
  }, [open, initial, form]);

  const categoryItems = Object.fromEntries(
    categories.map((c) => [c.id, c.name]),
  );

  function submit(values: BudgetInput) {
    onSave(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit budget" : "Add budget"}</DialogTitle>
          <DialogDescription>
            Set a monthly spending limit for a category.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
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
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                    />
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
              <Button type="submit">{isEdit ? "Save changes" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
