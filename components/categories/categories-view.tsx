"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CategoryRow } from "@/lib/data/categories";
import type { CategoryInput } from "@/lib/validation/category";
import { getCategoryIcon } from "@/lib/category-icons";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/(app)/categories/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryForm } from "@/components/categories/category-form";

export function CategoriesView({
  initialCategories,
}: {
  initialCategories: CategoryRow[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);

  const expense = useMemo(
    () => initialCategories.filter((c) => c.type === "EXPENSE"),
    [initialCategories],
  );
  const income = useMemo(
    () => initialCategories.filter((c) => c.type === "INCOME"),
    [initialCategories],
  );

  async function handleSave(values: CategoryInput) {
    try {
      if (editing) {
        await updateCategory(editing.id, values);
        toast.success("Category updated");
      } else {
        await createCategory(values);
        toast.success("Category added");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      toast.success("Category removed");
      router.refresh();
    } catch {
      toast.error("Could not delete category.");
    }
  }

  function openEdit(category: CategoryRow) {
    setEditing(category);
    setOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize transactions with expense and income categories."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add category
          </Button>
        }
      />

      <div className="space-y-8">
        <Section
          title="Expense"
          categories={expense}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
        <Section
          title="Income"
          categories={income}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <CategoryForm
        open={open}
        onOpenChange={setOpen}
        initial={
          editing
            ? { name: editing.name, type: editing.type, color: editing.color }
            : null
        }
        lockType={Boolean(editing)}
        onSave={handleSave}
      />
    </>
  );
}

function Section({
  title,
  categories,
  onEdit,
  onDelete,
}: {
  title: string;
  categories: CategoryRow[];
  onEdit: (c: CategoryRow) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
          {categories.length}
        </span>
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  category: c,
  onEdit,
  onDelete,
}: {
  category: CategoryRow;
  onEdit: (c: CategoryRow) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = getCategoryIcon(c.icon);
  return (
    <Card className="group transition-shadow hover:ring-foreground/20">
      <CardContent className="flex items-center gap-3 p-4">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in oklab, ${c.color} 16%, transparent)`,
            color: c.color,
          }}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{c.name}</div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {c.count} {c.count === 1 ? "transaction" : "transactions"}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${c.name}`}
                className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(c)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(c.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
