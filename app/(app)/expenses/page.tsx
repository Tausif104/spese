import { TransactionsView } from "@/components/transactions/transactions-view";
import { getCategories, getTransactionRows } from "@/lib/data/transactions";

export default async function ExpensesPage() {
  const [rows, categories] = await Promise.all([
    getTransactionRows("EXPENSE"),
    getCategories("EXPENSE"),
  ]);

  return (
    <TransactionsView
      initialRows={rows}
      categories={categories}
      fixedType="EXPENSE"
      title="Expenses"
      description="All expense entries."
      addLabel="Add expense"
    />
  );
}
