"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAccount } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteAccount({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  async function onDelete() {
    setPending(true);
    try {
      await deleteAccount();
      // deleteAccount redirects; if it returns, treat as error.
    } catch {
      toast.error("Could not delete account.");
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        <Trash2 className="size-4" />
        Delete account
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This permanently deletes your account and all transactions, budgets,
            categories, and recurring items. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>
            Type <span className="font-medium text-foreground">{email}</span> to
            confirm
          </Label>
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={email}
            autoComplete="off"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={confirm !== email || pending}
            onClick={onDelete}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Delete my account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
