import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { currentMonth, monthRange } from "@/lib/month";

function lastMonths(n: number): string[] {
  const arr: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    arr.push(d.toISOString().slice(0, 7));
  }
  return arr;
}

export async function getTotalBalance(): Promise<number> {
  const userId = await requireUserId();
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: "INCOME" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: "EXPENSE" },
    }),
  ]);
  return Number(incomeAgg._sum.amount ?? 0) - Number(expenseAgg._sum.amount ?? 0);
}

export type DashboardSummary = {
  income: number;
  expense: number;
  net: number;
  budgetTotal: number;
  budgetSpent: number;
  month: string;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const userId = await requireUserId();
  const month = currentMonth();
  const { start, end } = monthRange(month);

  const [incomeAgg, expenseAgg, budgetAgg, budgetCats] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: "INCOME", date: { gte: start, lt: end } },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: "EXPENSE", date: { gte: start, lt: end } },
    }),
    prisma.budget.aggregate({ _sum: { amount: true }, where: { userId, month } }),
    prisma.budget.findMany({ where: { userId, month }, select: { categoryId: true } }),
  ]);

  const income = Number(incomeAgg._sum.amount ?? 0);
  const expense = Number(expenseAgg._sum.amount ?? 0);
  const budgetTotal = Number(budgetAgg._sum.amount ?? 0);

  let budgetSpent = 0;
  if (budgetCats.length) {
    const agg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: start, lt: end },
        categoryId: { in: budgetCats.map((b) => b.categoryId) },
      },
    });
    budgetSpent = Number(agg._sum.amount ?? 0);
  }

  return { income, expense, net: income - expense, budgetTotal, budgetSpent, month };
}

export type TrendPoint = { month: string; income: number; expense: number };

export async function getSpendingTrend(): Promise<TrendPoint[]> {
  const userId = await requireUserId();
  const months = lastMonths(6);
  const start = monthRange(months[0]).start;
  const end = monthRange(months[months.length - 1]).end;

  const txns = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lt: end } },
    select: { date: true, type: true, amount: true },
  });

  const map = new Map<string, TrendPoint>(
    months.map((m) => [m, { month: m, income: 0, expense: 0 }]),
  );
  for (const t of txns) {
    const m = t.date.toISOString().slice(0, 7);
    const point = map.get(m);
    if (!point) continue;
    if (t.type === "INCOME") point.income += Number(t.amount);
    else point.expense += Number(t.amount);
  }
  return [...map.values()];
}

export type BreakdownSlice = {
  categoryId: string;
  name: string;
  value: number;
  color: string;
};

export async function getCategoryBreakdown(): Promise<BreakdownSlice[]> {
  const userId = await requireUserId();
  const { start, end } = monthRange(currentMonth());

  const groups = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "EXPENSE", date: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  const cats = await prisma.category.findMany({
    where: { userId, id: { in: groups.map((g) => g.categoryId) } },
  });
  const byId = new Map(cats.map((c) => [c.id, c]));

  return groups
    .map((g) => ({
      categoryId: g.categoryId,
      name: byId.get(g.categoryId)?.name ?? "—",
      value: Number(g._sum.amount ?? 0),
      color: byId.get(g.categoryId)?.color ?? "var(--chart-1)",
    }))
    .sort((a, b) => b.value - a.value);
}

export type RecentTransaction = {
  id: string;
  name: string;
  categoryName: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  date: string;
};

export async function getRecentTransactions(
  limit = 6,
): Promise<RecentTransaction[]> {
  const userId = await requireUserId();
  const rows = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return rows.map((t) => ({
    id: t.id,
    name: t.note || t.category.name,
    categoryName: t.category.name,
    type: t.type,
    amount: Number(t.amount),
    date: t.date.toISOString().slice(0, 10),
  }));
}
