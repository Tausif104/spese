"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/data/dashboard";
import { formatMonth } from "@/lib/format";
import { usePreferences } from "@/components/preferences-provider";
import { cn } from "@/lib/utils";

const RANGES = [
  { label: "6M", months: 6 },
  { label: "12M", months: 12 },
] as const;

const INCOME = "var(--chart-2)";
const EXPENSE = "var(--chart-1)";

function Stat({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <span
          className="size-2 rounded-full"
          style={{ background: dot }}
          aria-hidden
        />
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold tracking-tight tabular-nums sm:text-3xl">
        {value}
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  money,
}: {
  active?: boolean;
  payload?: Array<{ payload: { label: string; income: number; expense: number } }>;
  money: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-2xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-border">
      <div className="font-medium">{p.label}</div>
      <div className="mt-1 flex items-center gap-1.5 tabular-nums text-emerald-500">
        <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
        {money(p.income)} in
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 tabular-nums text-rose-500">
        <span className="size-2 rounded-full bg-rose-500" aria-hidden />
        {money(p.expense)} out
      </div>
    </div>
  );
}

export function SpendingTrend({ data }: { data: TrendPoint[] }) {
  const { money } = usePreferences();
  const [range, setRange] = useState<number>(6);

  const visible = data.slice(-range);
  const chartData = visible.map((d) => ({
    label: formatMonth(d.month),
    income: d.income,
    expense: d.expense,
  }));

  const income = visible.reduce((s, d) => s + d.income, 0);
  const expense = visible.reduce((s, d) => s + d.expense, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex gap-5 sm:gap-6">
          <Stat label="Income" value={money(income)} dot={INCOME} />
          <Stat label="Expenses" value={money(expense)} dot={EXPENSE} />
        </div>

        <div className="inline-flex rounded-full bg-muted p-0.5 text-xs font-medium">
          {RANGES.map((r) => {
            const active = r.months === range;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => setRange(r.months)}
                aria-pressed={active}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1 transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-44 sm:h-56 lg:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          barCategoryGap="24%"
          barGap={4}
        >
          <defs>
            <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INCOME} stopOpacity={0.95} />
              <stop offset="100%" stopColor={INCOME} stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="barExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EXPENSE} stopOpacity={0.95} />
              <stop offset="100%" stopColor={EXPENSE} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            height={20}
            tickMargin={6}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5, radius: 8 }}
            content={<ChartTooltip money={money} />}
          />
          <Bar
            dataKey="income"
            fill="url(#barIncome)"
            radius={[6, 6, 6, 6]}
            maxBarSize={22}
          />
          <Bar
            dataKey="expense"
            fill="url(#barExpense)"
            radius={[6, 6, 6, 6]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
