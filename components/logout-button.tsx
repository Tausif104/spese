"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (iconOnly) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Logout"
        title="Logout"
        onClick={logout}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-4" />
      </Button>
    );
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
