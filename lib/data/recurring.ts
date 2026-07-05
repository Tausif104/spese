import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import type { Category, RecurrenceInterval, TransactionType } from "@/lib/types";

export type RecurringRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  type: TransactionType;
  amount: number;
  interval: RecurrenceInterval;
  nextRunDate: string;
  active: boolean;
};

export async function getRecurringRows(): Promise<RecurringRow[]> {
  const userId = await requireUserId();
  const rows = await prisma.recurringTransaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: [{ active: "desc" }, { nextRunDate: "asc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    categoryId: r.categoryId,
    categoryName: r.category.name,
    categoryColor: r.category.color,
    type: r.type,
    amount: Number(r.amount),
    interval: r.interval,
    nextRunDate: r.nextRunDate.toISOString().slice(0, 10),
    active: r.active,
  }));
}

export async function getCategories(): Promise<Category[]> {
  const userId = await requireUserId();
  const rows = await prisma.category.findMany({
    where: { userId },
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
