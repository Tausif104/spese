"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      onClick={logout}
      className="w-full justify-start gap-3 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <LogOut className="size-4" />
      Logout
    </Button>
  );
}
