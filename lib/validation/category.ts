import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(40),
  type: z.enum(["EXPENSE", "INCOME"]),
  color: z.string().min(1, "Pick a color."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
