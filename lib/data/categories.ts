import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import type { Category } from "@/lib/types";

export type CategoryRow = Category & {
  count: number; // number of transactions in this category
};

export async function getCategoryList(): Promise<CategoryRow[]> {
  const userId = await requireUserId();
  const [rows, counts] = await Promise.all([
    prisma.category.findMany({
      where: { userId },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  const countByCat = new Map(counts.map((c) => [c.categoryId, c._count._all]));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    color: r.color,
    icon: r.icon,
    count: countByCat.get(r.id) ?? 0,
  }));
}
