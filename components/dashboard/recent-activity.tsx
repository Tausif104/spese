"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferences } from "@/components/preferences-provider";
import { cn } from "@/lib/utils";
import type { RecentTransaction } from "@/lib/data/dashboard";
import type { RecurringRow } from "@/lib/data/recurring";

function Avatar({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ background: color }}
      aria-hidden
    >
      {label.charAt(0).toUpperCase()}
    </span>
  );
}

function TypePill({ type }: { type: "INCOME" | "EXPENSE" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        type === "INCOME"
          ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
          : "bg-rose-500/12 text-rose-600 dark:text-rose-400",
      )}
    >
      {type === "INCOME" ? "Income" : "Expense"}
    </span>
  );
}

function titleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export function RecentActivity({
  recent,
  upcoming,
}: {
  recent: RecentTransaction[];
  upcoming: RecurringRow[];
}) {
  const { money, date } = usePreferences();

  return (
    <Tabs defaultValue="history">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-medium">Recent activity</h2>
          <p className="text-xs text-muted-foreground">
            Your latest transactions and what&apos;s scheduled next.
          </p>
        </div>
        <TabsList>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="history" className="mt-4">
        {recent.length === 0 ? (
          <EmptyRow
            title="No transactions yet"
            body="Add your first one to get started."
          />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <Avatar label={t.name} color="var(--primary)" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t.categoryName}
                  </div>
                </div>
                <div className="hidden w-28 shrink-0 text-xs text-muted-foreground sm:block">
                  {date(t.date)}
                </div>
                <div className="hidden w-24 shrink-0 sm:block">
                  <TypePill type={t.type} />
                </div>
                <div
                  className={cn(
                    "w-24 shrink-0 text-right text-sm font-semibold tabular-nums",
                    t.type === "INCOME"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground",
                  )}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {money(t.amount)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="upcoming" className="mt-4">
        {upcoming.length === 0 ? (
          <EmptyRow
            title="Nothing scheduled"
            body={
              <>
                Set up{" "}
                <Link href="/recurring" className="underline underline-offset-2">
                  recurring transactions
                </Link>{" "}
                to see them here.
              </>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.slice(0, 6).map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <Avatar label={r.categoryName} color={r.categoryColor} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {r.categoryName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {titleCase(r.interval)}
                    {!r.active && " · paused"}
                  </div>
                </div>
                <div className="hidden w-32 shrink-0 text-xs text-muted-foreground sm:block">
                  Next {date(r.nextRunDate)}
                </div>
                <div className="hidden w-24 shrink-0 sm:block">
                  <TypePill type={r.type} />
                </div>
                <div
                  className={cn(
                    "w-24 shrink-0 text-right text-sm font-semibold tabular-nums",
                    r.type === "INCOME"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground",
                  )}
                >
                  {r.type === "INCOME" ? "+" : "-"}
                  {money(r.amount)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}

function EmptyRow({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
