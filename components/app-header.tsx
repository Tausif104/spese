"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";
import { currentMonth } from "@/lib/month";
import { formatMonth } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";

type PageMeta = { title: string; description?: string };

function pageMeta(pathname: string): PageMeta {
  const month = formatMonth(currentMonth());
  const map: Record<string, PageMeta> = {
    "/dashboard": { title: "Dashboard", description: `Overview for ${month}.` },
    "/transactions": {
      title: "Transactions",
      description: "Add, edit, and filter your expenses and income.",
    },
    "/income": { title: "Income", description: "All income entries." },
    "/expenses": { title: "Expenses", description: "All expense entries." },
    "/this-month": {
      title: "This Month",
      description: `Income and expenses for ${month}.`,
    },
    "/budgets": {
      title: "Budgets",
      description: "Set monthly limits per category and track spending.",
    },
    "/recurring": {
      title: "Recurring",
      description: "Automate repeating expenses and income.",
    },
    "/categories": {
      title: "Categories",
      description: "Organize transactions with expense and income categories.",
    },
    "/settings": {
      title: "Settings",
      description: "Manage your profile, preferences, and account.",
    },
  };

  const key = Object.keys(map).find(
    (k) => pathname === k || pathname.startsWith(k + "/"),
  );
  if (key) return map[key];

  const nav = navItems.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
  );
  return { title: nav?.title ?? "Spese" };
}

export function AppHeader() {
  const pathname = usePathname();
  const { title, description } = pageMeta(pathname);
  const settingsActive = pathname.startsWith("/settings");

  return (
    <header className="z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur md:sticky md:top-0 md:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      <div className="hidden shrink-0 items-center gap-1 md:flex">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          title="Settings"
          aria-current={settingsActive ? "page" : undefined}
          nativeButton={false}
          render={<Link href="/settings" />}
          className={cn(
            settingsActive
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Settings className="size-4" />
        </Button>
        <ThemeToggle />
        <LogoutButton iconOnly />
      </div>
    </header>
  );
}
