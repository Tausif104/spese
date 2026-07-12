"use client";

import { cn } from "@/lib/utils";
import { usePreferences } from "@/components/preferences-provider";
import type { DashboardSummary } from "@/lib/data/dashboard";

type Tile = {
  label: string;
  value: string;
  sub?: string;
  // Solid pastel fill in light, translucent tint in dark — mirrors the
  // reference "Payment Overview" tiles.
  fill: string;
  labelColor: string;
  valueColor: string;
  // Optional real progress bar (0–100), e.g. budget used.
  progress?: number;
  barTrack?: string;
  barFill?: string;
  overBudget?: boolean;
};

function TileCard({ tile }: { tile: Tile }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-6 rounded-3xl p-5",
        tile.fill,
      )}
    >
      <span className={cn("text-sm font-medium", tile.labelColor)}>
        {tile.label}
      </span>
      <div className="space-y-1.5">
        <div
          className={cn(
            "text-xl leading-none font-semibold tracking-tight tabular-nums sm:text-2xl xl:text-3xl",
            tile.valueColor,
          )}
        >
          {tile.value}
        </div>
        {tile.progress !== undefined && (
          <div
            className={cn("h-1.5 overflow-hidden rounded-full", tile.barTrack)}
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width]",
                tile.overBudget ? "bg-rose-500" : tile.barFill,
              )}
              style={{ width: `${Math.min(100, tile.progress)}%` }}
            />
          </div>
        )}
        {tile.sub && (
          <div className={cn("text-xs tabular-nums", tile.labelColor)}>
            {tile.sub}
          </div>
        )}
      </div>
    </div>
  );
}

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const { money } = usePreferences();

  const pct = summary.budgetTotal
    ? Math.min(999, Math.round((summary.budgetSpent / summary.budgetTotal) * 100))
    : 0;

  const tiles: Tile[] = [
    {
      label: "Income",
      value: money(summary.income),
      sub: "this month",
      fill: "bg-amber-100 dark:bg-amber-400/10",
      labelColor: "text-amber-800 dark:text-amber-200/70",
      valueColor: "text-amber-950 dark:text-amber-50",
    },
    {
      label: "Expenses",
      value: money(summary.expense),
      sub: "this month",
      fill: "bg-rose-100 dark:bg-rose-400/10",
      labelColor: "text-rose-800 dark:text-rose-200/70",
      valueColor: "text-rose-950 dark:text-rose-50",
    },
    {
      label: "Net",
      value: `${summary.net < 0 ? "-" : ""}${money(Math.abs(summary.net))}`,
      sub: summary.net >= 0 ? "saved" : "over budget",
      fill: "bg-emerald-100 dark:bg-emerald-400/10",
      labelColor: "text-emerald-800 dark:text-emerald-200/70",
      valueColor: "text-emerald-950 dark:text-emerald-50",
    },
    {
      label: "Budget used",
      value: summary.budgetTotal ? money(summary.budgetSpent) : "—",
      sub: summary.budgetTotal
        ? `${pct}% of ${money(summary.budgetTotal)}`
        : "no budget set",
      fill: "bg-violet-100 dark:bg-violet-400/10",
      labelColor: "text-violet-800 dark:text-violet-200/70",
      valueColor: "text-violet-950 dark:text-violet-50",
      progress: summary.budgetTotal ? pct : undefined,
      barTrack: "bg-violet-500/15",
      barFill: "bg-violet-500",
      overBudget: pct >= 100,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((t) => (
        <TileCard key={t.label} tile={t} />
      ))}
    </div>
  );
}
