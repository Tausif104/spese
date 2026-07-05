"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { recurringSchema, type RecurringInput } from "@/lib/validation/recurring";

export async function createRecurring(input: RecurringInput) {
  const userId = await requireUserId();
  const data = recurringSchema.parse(input);
  await prisma.recurringTransaction.create({
    data: {
      userId,
      categoryId: data.categoryId,
      amount: data.amount,
      type: data.type,
      interval: data.interval,
      nextRunDate: new Date(data.nextRunDate),
      active: data.active,
    },
  });
  revalidatePath("/recurring");
}

export async function updateRecurring(id: string, input: RecurringInput) {
  const userId = await requireUserId();
  const data = recurringSchema.parse(input);
  await prisma.recurringTransaction.updateMany({
    where: { id, userId },
    data: {
      categoryId: data.categoryId,
      amount: data.amount,
      type: data.type,
      interval: data.interval,
      nextRunDate: new Date(data.nextRunDate),
      active: data.active,
    },
  });
  revalidatePath("/recurring");
}

export async function setRecurringActive(id: string, active: boolean) {
  const userId = await requireUserId();
  await prisma.recurringTransaction.updateMany({
    where: { id, userId },
    data: { active },
  });
  revalidatePath("/recurring");
}

export async function deleteRecurring(id: string) {
  const userId = await requireUserId();
  await prisma.recurringTransaction.deleteMany({ where: { id, userId } });
  revalidatePath("/recurring");
}
