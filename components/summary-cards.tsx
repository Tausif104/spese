"use client";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkline } from "@/components/sparkline";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/components/preferences-provider";
import type { DashboardSummary, TrendPoint } from "@/lib/data/dashboard";

function pctChange(series: number[]): number | null {
  if (series.length < 2) return null;
  const cur = series[series.length - 1];
  const prev = series[series.length - 2];
  if (prev === 0) return cur === 0 ? 0 : null;
  return ((cur - prev) / Math.abs(prev)) * 100;
}

function DeltaPill({ change, goodWhenUp }: { change: number; goodWhenUp: boolean }) {
  const up = change >= 0;
  const good = up === goodWhenUp;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
        good
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-rose-500/10 text-rose-500",
      )}
    >
      <Arrow className="size-3" />
      {Math.abs(Math.round(change))}%
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  valueColor,
  children,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  valueColor?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <Icon className="size-4 text-muted-foreground/60" />
        </div>
        <div
          className={cn(
            "text-3xl leading-none font-semibold tracking-tight tabular-nums",
            valueColor,
          )}
        >
          {value}
        </div>
        <div className="mt-auto">{children}</div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards({
  summary,
  trend,
}: {
  summary: DashboardSummary;
  trend: TrendPoint[];
}) {
  const { money } = usePreferences();
  const income = trend.map((t) => t.income);
  const expense = trend.map((t) => t.expense);
  const net = trend.map((t) => t.income - t.expense);

  const pct = summary.budgetTotal
    ? Math.min(100, Math.round((summary.budgetSpent / summary.budgetTotal) * 100))
    : 0;

  const incomeDelta = pctChange(income);
  const expenseDelta = pctChange(expense);
  const netDelta = pctChange(net);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Income"
        value={money(summary.income)}
        icon={TrendingUp}
        valueColor="text-foreground"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 flex-1 text-emerald-500">
            <Sparkline data={income} className="h-full w-full" />
          </div>
          {incomeDelta !== null && <DeltaPill change={incomeDelta} goodWhenUp />}
        </div>
      </StatCard>

      <StatCard
        label="Expenses"
        value={money(summary.expense)}
        icon={TrendingDown}
        valueColor="text-foreground"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 flex-1 text-rose-500">
            <Sparkline data={expense} className="h-full w-full" />
          </div>
          {expenseDelta !== null && (
            <DeltaPill change={expenseDelta} goodWhenUp={false} />
          )}
        </div>
      </StatCard>

      <StatCard
        label="Net"
        value={money(summary.net)}
        icon={Wallet}
        valueColor={summary.net >= 0 ? "text-emerald-500" : "text-rose-500"}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 flex-1",
              summary.net >= 0 ? "text-emerald-500" : "text-rose-500",
            )}
          >
            <Sparkline data={net} className="h-full w-full" />
          </div>
          {netDelta !== null && <DeltaPill change={netDelta} goodWhenUp />}
        </div>
      </StatCard>

      <StatCard
        label="Budget used"
        value={money(summary.budgetSpent)}
        icon={Target}
        valueColor="text-foreground"
      >
        <div className="space-y-2">
          <Progress
            value={pct}
            className={cn(
              "[&_[data-slot=progress-track]]:h-2",
              pct >= 100 && "[&_[data-slot=progress-indicator]]:bg-rose-500",
            )}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{pct}% used</span>
            <span className="tabular-nums">
              of {money(summary.budgetTotal)}
            </span>
          </div>
        </div>
      </StatCard>
    </div>
  );
}
