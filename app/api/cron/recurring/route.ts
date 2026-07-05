import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import type { RecurrenceInterval } from "@/lib/types";

function advance(date: Date, interval: RecurrenceInterval): Date {
  const d = new Date(date);
  if (interval === "DAILY") d.setUTCDate(d.getUTCDate() + 1);
  else if (interval === "WEEKLY") d.setUTCDate(d.getUTCDate() + 7);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

// Materializes due recurring items into transactions and advances their next run
// date. Scoped to the current user (so the "Run now" button works). A production
// deployment would also expose a cron-secret path to run this for all users.
export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const due = await prisma.recurringTransaction.findMany({
    where: { userId, active: true, nextRunDate: { lte: now } },
  });

  let created = 0;
  for (const r of due) {
    let next = r.nextRunDate;
    let guard = 0;
    while (next <= now && guard < 366) {
      await prisma.transaction.create({
        data: {
          userId,
          categoryId: r.categoryId,
          amount: r.amount,
          type: r.type,
          note: "Recurring",
          date: next,
        },
      });
      created += 1;
      next = advance(next, r.interval);
      guard += 1;
    }
    await prisma.recurringTransaction.update({
      where: { id: r.id },
      data: { nextRunDate: next },
    });
  }

  return NextResponse.json({ ok: true, created });
}
