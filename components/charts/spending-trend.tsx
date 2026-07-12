"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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

function Stat({
  label,
  value,
  dot,
  valueClass,
}: {
  label: string;
  value: string;
  dot?: string;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {dot && (
          <span
            className="size-2 rounded-full"
            style={{ background: dot }}
            aria-hidden
          />
        )}
        {label}
      </div>
      <div className={cn("mt-1 text-lg font-semibold tabular-nums", valueClass)}>
        {value}
      </div>
    </div>
  );
}

export function SpendingTrend({ data }: { data: TrendPoint[] }) {
  const { money } = usePreferences();
  const [range, setRange] = useState<number>(6);

  const visible = data.slice(-range);
  const chartData = visible.map((d) => ({ ...d, label: formatMonth(d.month) }));

  const income = visible.reduce((s, d) => s + d.income, 0);
  const expense = visible.reduce((s, d) => s + d.expense, 0);
  const net = income - expense;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-6">
          <Stat label="Income" value={money(income)} dot="var(--chart-2)" />
          <Stat label="Expenses" value={money(expense)} dot="var(--chart-1)" />
          <Stat
            label="Net"
            value={`${net >= 0 ? "+" : "-"}${money(Math.abs(net))}`}
            valueClass={net >= 0 ? "text-emerald-500" : "text-rose-500"}
          />
        </div>

        <div className="inline-flex rounded-full border border-border p-0.5 text-xs font-medium">
          {RANGES.map((r) => {
            const active = r.months === range;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => setRange(r.months)}
                aria-pressed={active}
                className={cn(
                  "cursor-pointer rounded-full px-2.5 py-1 transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={68}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(v) => money(Number(v))}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 0,
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
            formatter={(value, name) => [money(Number(value)), name]}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="var(--chart-2)"
            fill="url(#fillIncome)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="var(--chart-1)"
            fill="url(#fillExpense)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
