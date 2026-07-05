"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { categorySchema, type CategoryInput } from "@/lib/validation/category";
import { CATEGORY_COLORS } from "@/lib/colors";
import { cn } from "@/lib/utils";
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

const empty: CategoryInput = {
  name: "",
  type: "EXPENSE",
  color: CATEGORY_COLORS[0],
};

export function CategoryForm({
  open,
  onOpenChange,
  initial,
  lockType,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: CategoryInput | null;
  lockType?: boolean;
  onSave: (values: CategoryInput) => void;
}) {
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial ?? empty,
  });

  useEffect(() => {
    if (open) form.reset(initial ?? empty);
  }, [open, initial, form]);

  const typeItems = { EXPENSE: "Expense", INCOME: "Income" };

  function submit(values: CategoryInput) {
    onSave(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            Categories organize your transactions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    items={typeItems}
                    value={field.value}
                    onValueChange={(v) => field.onChange(v ?? "EXPENSE")}
                    disabled={lockType}
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

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Color ${c}`}
                        onClick={() => field.onChange(c)}
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full border-2 border-transparent transition-transform hover:scale-110",
                          field.value === c && "border-foreground",
                        )}
                        style={{ background: c }}
                      >
                        {field.value === c && (
                          <Check className="size-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
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
