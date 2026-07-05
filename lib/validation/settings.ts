import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(60),
});

export const preferencesSchema = z.object({
  currency: z.string().length(3, "Pick a currency."),
  dateFormat: z.enum(["MED", "DMY", "MDY", "ISO"]),
});

export const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(8, "New password must be at least 8 characters."),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export type ProfileInput = z.infer<typeof profileSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
