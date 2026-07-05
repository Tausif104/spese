import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import type { DateFormat } from "@/lib/format";

export type UserPreferences = {
  name: string;
  email: string;
  currency: string;
  dateFormat: DateFormat;
};

export async function getUserPreferences(): Promise<UserPreferences> {
  const userId = await requireUserId();
  const u = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { name: true, email: true, currency: true, dateFormat: true },
  });
  return { ...u, dateFormat: u.dateFormat as DateFormat };
}
