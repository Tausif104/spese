"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { profileSchema, type ProfileInput } from "@/lib/validation/settings";
import { updateProfile } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name },
  });

  async function onSubmit(values: ProfileInput) {
    setPending(true);
    try {
      const res = await updateProfile(values);
      if (!res.ok) throw new Error(res.error);
      toast.success("Profile updated");
      router.refresh();
    } catch {
      toast.error("Could not update profile.");
    }
    setPending(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label className="text-muted-foreground">Email</Label>
          <Input value={email} disabled readOnly />
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Save changes
        </Button>
      </form>
    </Form>
  );
}
