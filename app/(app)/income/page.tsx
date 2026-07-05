import { TransactionsView } from "@/components/transactions/transactions-view";
import { getCategories, getTransactionRows } from "@/lib/data/transactions";

export default async function IncomePage() {
  const [rows, categories] = await Promise.all([
    getTransactionRows("INCOME"),
    getCategories("INCOME"),
  ]);

  return (
    <TransactionsView
      initialRows={rows}
      categories={categories}
      fixedType="INCOME"
      title="Income"
      description="All income entries."
      addLabel="Add income"
    />
  );
}
