import { TransactionsView } from "@/components/transactions/transactions-view";
import { getCategories, getTransactionRows } from "@/lib/data/transactions";

export default async function TransactionsPage() {
  const [rows, categories] = await Promise.all([
    getTransactionRows(),
    getCategories(),
  ]);

  return <TransactionsView initialRows={rows} categories={categories} />;
}
