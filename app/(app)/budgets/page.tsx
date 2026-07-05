import { BudgetsView } from "@/components/budgets/budgets-view";
import { getBudgetCards, getExpenseCategories } from "@/lib/data/budgets";

export default async function BudgetsPage() {
  const [cards, expenseCategories] = await Promise.all([
    getBudgetCards(),
    getExpenseCategories(),
  ]);

  return (
    <BudgetsView initialCards={cards} expenseCategories={expenseCategories} />
  );
}
