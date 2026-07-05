import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { currentMonth, monthRange } from "@/lib/month";
import type { Category } from "@/lib/types";

export type BudgetCard = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  limit: number;
  spent: number;
  month: string;
};

async function expenseSpendMap(
  userId: string,
  month: string,
): Promise<Record<string, number>> {
  const { start, end } = monthRange(month);
  const groups = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "EXPENSE", date: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  return Object.fromEntries(
    groups.map((g) => [g.categoryId, Number(g._sum.amount ?? 0)]),
  );
}

export async function getBudgetCards(): Promise<BudgetCard[]> {
  const userId = await requireUserId();
  const month = currentMonth();
  const [rows, spend] = await Promise.all([
    prisma.budget.findMany({
      where: { userId, month },
      include: { category: true },
    }),
    expenseSpendMap(userId, month),
  ]);
  return rows
    .map((b) => ({
      id: b.id,
      categoryId: b.categoryId,
      categoryName: b.category.name,
      categoryColor: b.category.color,
      limit: Number(b.amount),
      spent: spend[b.categoryId] ?? 0,
      month,
    }))
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit);
}

export async function getExpenseCategories(): Promise<Category[]> {
  const userId = await requireUserId();
  const rows = await prisma.category.findMany({
    where: { userId, type: "EXPENSE" },
    orderBy: { name: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    color: r.color,
    icon: r.icon,
  }));
}

export async function getExpenseSpendMap(): Promise<Record<string, number>> {
  const userId = await requireUserId();
  return expenseSpendMap(userId, currentMonth());
}
