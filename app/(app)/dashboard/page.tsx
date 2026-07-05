import { PageHeader } from "@/components/page-header";
import { SummaryCards } from "@/components/summary-cards";
import { SpendingTrend } from "@/components/charts/spending-trend";
import { CategoryBreakdown } from "@/components/charts/category-breakdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatMonth } from "@/lib/format";
import { getUserPreferences } from "@/lib/data/preferences";
import {
  getCategoryBreakdown,
  getDashboardSummary,
  getRecentTransactions,
  getSpendingTrend,
} from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const [summary, trend, breakdown, recent, prefs] = await Promise.all([
    getDashboardSummary(),
    getSpendingTrend(),
    getCategoryBreakdown(),
    getRecentTransactions(),
    getUserPreferences(),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Overview for ${formatMonth(summary.month)}.`}
      />

      <div className="space-y-6">
        <SummaryCards summary={summary} trend={trend} />

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingTrend data={trend} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Spending by category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown data={breakdown} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent transactions</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {recent.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(t.date, { dateFormat: prefs.dateFormat })}
                  </div>
                </div>
                <Badge variant="outline">{t.categoryName}</Badge>
                <div
                  className={cn(
                    "w-24 text-right text-sm font-medium tabular-nums",
                    t.type === "INCOME" ? "text-emerald-500" : "text-rose-500",
                  )}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(t.amount, { currency: prefs.currency })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
