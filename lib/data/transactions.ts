import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import type { Category, TransactionType } from "@/lib/types";

export type TransactionRow = {
  id: string;
  date: string;
  note: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  type: TransactionType;
  amount: number;
};

export async function getTransactionRows(
  type?: TransactionType,
): Promise<TransactionRow[]> {
  const userId = await requireUserId();
  const rows = await prisma.transaction.findMany({
    where: { userId, ...(type ? { type } : {}) },
    include: { category: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });
  return rows.map((t) => ({
    id: t.id,
    date: t.date.toISOString().slice(0, 10),
    note: t.note,
    categoryId: t.categoryId,
    categoryName: t.category.name,
    categoryColor: t.category.color,
    type: t.type,
    amount: Number(t.amount),
  }));
}

export async function getCategories(
  type?: TransactionType,
): Promise<Category[]> {
  const userId = await requireUserId();
  const rows = await prisma.category.findMany({
    where: { userId, ...(type ? { type } : {}) },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    color: r.color,
    icon: r.icon,
  }));
}
