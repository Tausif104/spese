"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BreakdownSlice } from "@/lib/data/dashboard";
import { usePreferences } from "@/components/preferences-provider";

export function CategoryBreakdown({ data }: { data: BreakdownSlice[] }) {
  const { money } = usePreferences();
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-4 @md:flex-row">
      <div className="size-[200px] shrink-0 self-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((slice) => (
                <Cell key={slice.categoryId} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 0,
                color: "var(--popover-foreground)",
                fontSize: 12,
              }}
              formatter={(value, name) => [money(Number(value)), name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full min-w-0 @md:flex-1 space-y-1.5">
        {data.map((slice) => (
          <li key={slice.categoryId} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: slice.color }}
            />
            <span className="flex-1 truncate text-muted-foreground">
              {slice.name}
            </span>
            <span className="tabular-nums">{money(slice.value)}</span>
            <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
              {total ? Math.round((slice.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
