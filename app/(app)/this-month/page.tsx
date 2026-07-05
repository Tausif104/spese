import { TransactionsView } from "@/components/transactions/transactions-view";
import { getCategories, getTransactionRows } from "@/lib/data/transactions";
import { currentMonth } from "@/lib/month";
import { formatMonth } from "@/lib/format";

export default async function ThisMonthPage() {
  const month = currentMonth();
  const [rows, categories] = await Promise.all([
    getTransactionRows(),
    getCategories(),
  ]);

  return (
    <TransactionsView
      initialRows={rows}
      categories={categories}
      fixedMonth={month}
      showTotals
      title="This Month"
      description={`Income and expenses for ${formatMonth(month)}.`}
    />
  );
}
