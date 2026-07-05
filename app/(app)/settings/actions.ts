"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { TOKEN_COOKIE } from "@/lib/auth/jwt";
import {
  passwordSchema,
  preferencesSchema,
  profileSchema,
  type PasswordInput,
  type PreferencesInput,
  type ProfileInput,
} from "@/lib/validation/settings";

export type ActionResult = { ok: boolean; error?: string };

export async function updateProfile(
  input: ProfileInput,
): Promise<ActionResult> {
  const userId = await requireUserId();
  const data = profileSchema.parse(input);
  await prisma.user.update({ where: { id: userId }, data: { name: data.name } });
  revalidatePath("/settings");
  return { ok: true };
}

export async function updatePreferences(
  input: PreferencesInput,
): Promise<ActionResult> {
  const userId = await requireUserId();
  const data = preferencesSchema.parse(input);
  const valid = Intl.supportedValuesOf("currency").includes(data.currency);
  if (!valid) return { ok: false, error: "Unsupported currency." };
  await prisma.user.update({
    where: { id: userId },
    data: { currency: data.currency, dateFormat: data.dateFormat },
  });
  // Currency/date formatting is used app-wide — refresh the whole tree.
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function changePassword(
  input: PasswordInput,
): Promise<ActionResult> {
  const userId = await requireUserId();
  const data = passwordSchema.parse(input);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { passwordHash: true },
  });
  const ok = await verifyPassword(data.current, user.passwordHash);
  if (!ok) return { ok: false, error: "Current password is incorrect." };
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(data.next) },
  });
  return { ok: true };
}

export async function deleteAccount(): Promise<void> {
  const userId = await requireUserId();
  await prisma.user.delete({ where: { id: userId } });
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  redirect("/register");
}
