import { z } from "zod";

export const recurringSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  categoryId: z.string().min(1, "Select a category."),
  amount: z
    .number({ message: "Enter a valid amount." })
    .positive("Amount must be greater than 0."),
  interval: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  nextRunDate: z.string().min(1, "Pick a start date."),
  active: z.boolean(),
});

export type RecurringInput = z.infer<typeof recurringSchema>;
