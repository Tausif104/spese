"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import {
  transactionSchema,
  type TransactionInput,
} from "@/lib/validation/transaction";

function revalidate() {
  revalidatePath("/transactions");
  revalidatePath("/income");
  revalidatePath("/expenses");
  revalidatePath("/this-month");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
}

export async function createTransaction(input: TransactionInput) {
  const userId = await requireUserId();
  const data = transactionSchema.parse(input);
  await prisma.transaction.create({
    data: {
      userId,
      categoryId: data.categoryId,
      amount: data.amount,
      type: data.type,
      note: data.note ?? "",
      date: new Date(data.date),
    },
  });
  revalidate();
}

export async function updateTransaction(id: string, input: TransactionInput) {
  const userId = await requireUserId();
  const data = transactionSchema.parse(input);
  await prisma.transaction.updateMany({
    where: { id, userId },
    data: {
      categoryId: data.categoryId,
      amount: data.amount,
      type: data.type,
      note: data.note ?? "",
      date: new Date(data.date),
    },
  });
  revalidate();
}

export async function deleteTransaction(id: string) {
  const userId = await requireUserId();
  await prisma.transaction.deleteMany({ where: { id, userId } });
  revalidate();
}
