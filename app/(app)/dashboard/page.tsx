import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GreetingHero, greetingFor } from "@/components/dashboard/greeting-hero";
import { SummaryCards } from "@/components/summary-cards";
import { SpendingTrend } from "@/components/charts/spending-trend";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { formatMonth } from "@/lib/format";
import { getUserPreferences } from "@/lib/data/preferences";
import {
  getDashboardSummary,
  getRecentTransactions,
  getSpendingTrend,
} from "@/lib/data/dashboard";
import { getRecurringRows } from "@/lib/data/recurring";

export default async function DashboardPage() {
  const [summary, trend, recent, recurring, prefs] = await Promise.all([
    getDashboardSummary(),
    getSpendingTrend(),
    getRecentTransactions(),
    getRecurringRows(),
    getUserPreferences(),
  ]);

  const upcoming = recurring.filter((r) => r.active);

  return (
    <div className="space-y-6">
      <GreetingHero
        greeting={greetingFor(new Date().getHours())}
        name={prefs.name}
        month={formatMonth(summary.month)}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent>
            <SpendingTrend data={trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This month</CardTitle>
            <CardDescription>{formatMonth(summary.month)}</CardDescription>
          </CardHeader>
          <CardContent>
            <SummaryCards summary={summary} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <RecentActivity recent={recent} upcoming={upcoming} />
        </CardContent>
      </Card>
    </div>
  );
}
