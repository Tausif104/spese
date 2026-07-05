"use client";

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

export function SpendingTrend({ data }: { data: TrendPoint[] }) {
  const { money } = usePreferences();
  const chartData = data.map((d) => ({ ...d, label: formatMonth(d.month) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ left: 4, right: 8, top: 8 }}>
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
          width={48}
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
  );
}
