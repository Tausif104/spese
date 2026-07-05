import { RecurringView } from "@/components/recurring/recurring-view";
import { getCategories, getRecurringRows } from "@/lib/data/recurring";

export default async function RecurringPage() {
  const [rows, categories] = await Promise.all([
    getRecurringRows(),
    getCategories(),
  ]);

  return <RecurringView initialRows={rows} categories={categories} />;
}
