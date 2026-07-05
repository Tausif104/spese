"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreHorizontal, Pencil, Trash2, Play } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import type { RecurringRow } from "@/lib/data/recurring";
import type { RecurringInput } from "@/lib/validation/recurring";
import {
  createRecurring,
  updateRecurring,
  setRecurringActive,
  deleteRecurring,
} from "@/app/(app)/recurring/actions";
import { usePreferences } from "@/components/preferences-provider";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecurringForm } from "@/components/recurring/recurring-form";

const intervalLabel = { DAILY: "Daily", WEEKLY: "Weekly", MONTHLY: "Monthly" };

export function RecurringView({
  initialRows,
  categories,
}: {
  initialRows: RecurringRow[];
  categories: Category[];
}) {
  const router = useRouter();
  const { money, date } = usePreferences();
  const rows = initialRows;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringRow | null>(null);

  async function handleSave(values: RecurringInput) {
    try {
      if (editing) {
        await updateRecurring(editing.id, values);
        toast.success("Recurring updated");
      } else {
        await createRecurring(values);
        toast.success("Recurring added");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
    setEditing(null);
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      await setRecurringActive(id, active);
      router.refresh();
    } catch {
      toast.error("Could not update.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRecurring(id);
      toast.success("Recurring removed");
      router.refresh();
    } catch {
      toast.error("Could not remove.");
    }
  }

  async function runNow() {
    try {
      const res = await fetch("/api/cron/recurring");
      const data = await res.json();
      if (!res.ok) throw new Error();
      toast.success(
        data.created > 0
          ? `Generated ${data.created} transaction${data.created === 1 ? "" : "s"}`
          : "Nothing due right now",
      );
      router.refresh();
    } catch {
      toast.error("Could not run recurring.");
    }
  }

  return (
    <>
      <PageHeader
        title="Recurring"
        description="Automate repeating expenses and income."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={runNow}>
              <Play className="size-4" />
              Run now
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add recurring
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Next run</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No recurring items yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id} className={cn(!r.active && "opacity-60")}>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: r.categoryColor }}
                      />
                      {r.categoryName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {intervalLabel[r.interval]}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {date(r.nextRunDate)}
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
                    <Switch
                      checked={r.active}
                      onCheckedChange={(v) => toggleActive(r.id, v)}
                      aria-label="Toggle active"
                    />
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
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(r);
                            setOpen(true);
                          }}
                        >
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
      </Card>

      <RecurringForm
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        initial={
          editing
            ? {
                type: editing.type,
                categoryId: editing.categoryId,
                amount: editing.amount,
                interval: editing.interval,
                nextRunDate: editing.nextRunDate,
                active: editing.active,
              }
            : null
        }
        onSave={handleSave}
      />
    </>
  );
}
