"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import type { BudgetCard } from "@/lib/data/budgets";
import type { BudgetInput } from "@/lib/validation/budget";
import {
  createBudget,
  updateBudget,
  deleteBudget,
} from "@/app/(app)/budgets/actions";
import { usePreferences } from "@/components/preferences-provider";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BudgetForm } from "@/components/budgets/budget-form";

export function BudgetsView({
  initialCards,
  expenseCategories,
}: {
  initialCards: BudgetCard[];
  expenseCategories: Category[];
}) {
  const router = useRouter();
  const { money } = usePreferences();
  const cards = initialCards;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetCard | null>(null);

  const totals = useMemo(() => {
    const limit = cards.reduce((s, c) => s + c.limit, 0);
    const spent = cards.reduce((s, c) => s + c.spent, 0);
    const over = cards.filter((c) => c.spent > c.limit).length;
    return { limit, spent, over };
  }, [cards]);

  // Categories available to add a budget for (not already budgeted).
  const available = useMemo(
    () =>
      expenseCategories.filter(
        (c) => !cards.some((card) => card.categoryId === c.id),
      ),
    [expenseCategories, cards],
  );

  async function handleSave(values: BudgetInput) {
    try {
      if (editing) {
        await updateBudget(editing.id, values);
        toast.success("Budget updated");
      } else {
        await createBudget(values);
        toast.success("Budget added");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    try {
      await deleteBudget(id);
      toast.success("Budget removed");
      router.refresh();
    } catch {
      toast.error("Could not remove budget.");
    }
  }

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(card: BudgetCard) {
    setEditing(card);
    setOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set monthly limits per category and track spending."
        action={
          <Button onClick={openAdd} disabled={available.length === 0}>
            <Plus className="size-4" />
            Add budget
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-muted-foreground">Total budget</div>
            <div className="text-xl font-semibold tabular-nums">
              {money(totals.limit)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-muted-foreground">Total spent</div>
            <div className="text-xl font-semibold tabular-nums">
              {money(totals.spent)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-muted-foreground">Over limit</div>
            <div
              className={cn(
                "text-xl font-semibold tabular-nums",
                totals.over > 0 && "text-rose-500",
              )}
            >
              {totals.over} {totals.over === 1 ? "category" : "categories"}
            </div>
          </CardContent>
        </Card>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No budgets yet. Add one to start tracking limits.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const pct = card.limit
              ? Math.round((card.spent / card.limit) * 100)
              : 0;
            const over = card.spent > card.limit;
            const remaining = card.limit - card.spent;
            return (
              <Card key={card.id}>
                <CardContent className="space-y-3 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: card.categoryColor }}
                      />
                      <span className="font-medium">{card.categoryName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {over && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="size-3" />
                          Over
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Actions"
                            />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(card)}>
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(card.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <Progress
                    value={Math.min(100, pct)}
                    className={cn(
                      "[&_[data-slot=progress-track]]:h-2",
                      over && "[&_[data-slot=progress-indicator]]:bg-rose-500",
                    )}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <span className="tabular-nums">
                      {money(card.spent)} / {money(card.limit)}
                    </span>
                    <span
                      className={cn(
                        "tabular-nums",
                        over ? "text-rose-500" : "text-muted-foreground",
                      )}
                    >
                      {over
                        ? `${money(Math.abs(remaining))} over`
                        : `${money(remaining)} left`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BudgetForm
        open={open}
        onOpenChange={setOpen}
        categories={editing ? expenseCategories : available}
        initial={
          editing
            ? { categoryId: editing.categoryId, amount: editing.limit }
            : null
        }
        onSave={handleSave}
      />
    </>
  );
}
