import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  categoryId: z.string().min(1, "Select a category."),
  amount: z
    .number({ message: "Enter a valid amount." })
    .positive("Amount must be greater than 0."),
  date: z.string().min(1, "Pick a date."),
  note: z.string().max(120, "Keep it under 120 characters.").optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
