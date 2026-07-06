"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import type { TransactionRow } from "@/lib/data/transactions";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/app/(app)/transactions/actions";
import { formatMonth } from "@/lib/format";
import { usePreferences } from "@/components/preferences-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/lib/use-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TransactionForm,
  type TransactionFormValues,
} from "@/components/transactions/transaction-form";

export function TransactionsView({
  initialRows,
  categories,
  fixedType,
  fixedMonth,
  showTotals = false,
  title = "Transactions",
  description = "Add, edit, and filter your expenses and income.",
  addLabel = "Add transaction",
}: {
  initialRows: TransactionRow[];
  categories: Category[];
  fixedType?: "EXPENSE" | "INCOME";
  fixedMonth?: string; // yyyy-mm — restricts the view to one month
  showTotals?: boolean;
  title?: string;
  description?: string;
  addLabel?: string;
}) {
  const router = useRouter();
  const { money, date } = usePreferences();
  const rows = useMemo(
    () =>
      fixedMonth
        ? initialRows.filter((r) => r.date.startsWith(fixedMonth))
        : initialRows,
    [initialRows, fixedMonth],
  );
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionRow | null>(null);

  const months = useMemo(() => {
    const set = new Set(rows.map((r) => r.date.slice(0, 7)));
    return [...set].sort((a, b) => (a < b ? 1 : -1));
  }, [rows]);

  const totals = useMemo(() => {
    const income = rows
      .filter((r) => r.type === "INCOME")
      .reduce((s, r) => s + r.amount, 0);
    const expense = rows
      .filter((r) => r.type === "EXPENSE")
      .reduce((s, r) => s + r.amount, 0);
    return { income, expense, net: income - expense };
  }, [rows]);

  const typeItems = { all: "All types", EXPENSE: "Expenses", INCOME: "Income" };
  const categoryItems: Record<string, string> = {
    all: "All categories",
    ...Object.fromEntries(categories.map((c) => [c.id, c.name])),
  };
  const monthItems: Record<string, string> = {
    all: "All months",
    ...Object.fromEntries(months.map((m) => [m, formatMonth(m)])),
  };

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (typeFilter === "all" || r.type === typeFilter) &&
          (categoryFilter === "all" || r.categoryId === categoryFilter) &&
          (monthFilter === "all" || r.date.startsWith(monthFilter)),
      ),
    [rows, typeFilter, categoryFilter, monthFilter],
  );

  const { page, setPage, pageCount, paged } = usePagination(filtered, {
    resetKey: `${typeFilter}|${categoryFilter}|${monthFilter}`,
  });

  async function handleSave(values: TransactionFormValues) {
    try {
      if (editing) {
        await updateTransaction(editing.id, values);
        toast.success("Transaction updated");
      } else {
        await createTransaction(values);
        toast.success("Transaction added");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted");
      router.refresh();
    } catch {
      toast.error("Could not delete transaction.");
    }
  }

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(row: TransactionRow) {
    setEditing(row);
    setOpen(true);
  }

  return (
    <>
      {showTotals && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <TotalChip
            label="Income"
            value={money(totals.income)}
            icon={ArrowUpRight}
            color="text-emerald-500"
          />
          <TotalChip
            label="Expenses"
            value={money(totals.expense)}
            icon={ArrowDownRight}
            color="text-rose-500"
          />
          <TotalChip
            label="Net"
            value={money(totals.net)}
            icon={Wallet}
            color={totals.net >= 0 ? "text-emerald-500" : "text-rose-500"}
            emphasize
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {!fixedType && (
          <Select
            items={typeItems}
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v ?? "all")}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="EXPENSE">Expenses</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select
          items={categoryItems}
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v ?? "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!fixedMonth && (
        <Select
          items={monthItems}
          value={monthFilter}
          onValueChange={(v) => setMonthFilter(v ?? "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All months</SelectItem>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {formatMonth(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        )}

        <Button onClick={openAdd} className="ml-auto">
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No transactions match these filters.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {date(r.date)}
                  </TableCell>
                  <TableCell className="font-medium">{r.note}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: r.categoryColor }}
                      />
                      {r.categoryName}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium tabular-nums",
                      r.type === "INCOME" ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {r.type === "INCOME" ? "+" : "-"}
                    {money(r.amount, true)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" aria-label="Actions" />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(r)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {pageCount > 1 && (
          <div className="border-t px-4 py-3">
            <Pagination
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <TransactionForm
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        lockedType={fixedType}
        initial={
          editing
            ? {
                type: editing.type,
                categoryId: editing.categoryId,
                amount: editing.amount,
                date: editing.date,
                note: editing.note,
              }
            : null
        }
        onSave={handleSave}
      />
    </>
  );
}

function TotalChip({
  label,
  value,
  icon: Icon,
  color,
  emphasize,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={cn("size-4", color)} />
        {label}
      </span>
      <span
        className={cn(
          "text-lg font-semibold tabular-nums",
          emphasize ? color : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
