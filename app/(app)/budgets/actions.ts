"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { currentMonth } from "@/lib/month";
import { budgetSchema, type BudgetInput } from "@/lib/validation/budget";

export async function createBudget(input: BudgetInput) {
  const userId = await requireUserId();
  const data = budgetSchema.parse(input);
  const month = currentMonth();
  await prisma.budget.upsert({
    where: {
      userId_categoryId_month: { userId, categoryId: data.categoryId, month },
    },
    create: { userId, categoryId: data.categoryId, amount: data.amount, month },
    update: { amount: data.amount },
  });
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}

export async function updateBudget(id: string, input: BudgetInput) {
  const userId = await requireUserId();
  const data = budgetSchema.parse(input);
  await prisma.budget.updateMany({
    where: { id, userId },
    data: { amount: data.amount },
  });
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}

export async function deleteBudget(id: string) {
  const userId = await requireUserId();
  await prisma.budget.deleteMany({ where: { id, userId } });
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}
