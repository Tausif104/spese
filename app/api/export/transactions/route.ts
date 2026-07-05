import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  const header = ["Date", "Type", "Category", "Amount", "Note"];
  const lines = [header.join(",")];
  for (const t of rows) {
    lines.push(
      [
        t.date.toISOString().slice(0, 10),
        t.type,
        t.category.name,
        Number(t.amount).toFixed(2),
        t.note,
      ]
        .map(csvCell)
        .join(","),
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="transactions.csv"',
    },
  });
}
