import { z } from "zod";

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Select a category."),
  amount: z
    .number({ message: "Enter a valid amount." })
    .positive("Budget must be greater than 0."),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
