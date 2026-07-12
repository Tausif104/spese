"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { usePreferences } from "@/components/preferences-provider";

function pageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/income": "Income",
    "/expenses": "Expenses",
    "/this-month": "This Month",
    "/budgets": "Budgets",
    "/recurring": "Recurring",
    "/categories": "Categories",
    "/settings": "Settings",
  };
  const key = Object.keys(map).find(
    (k) => pathname === k || pathname.startsWith(k + "/"),
  );
  if (key) return map[key];
  const nav = navItems.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
  );
  return nav?.title ?? "Spese";
}

export function AppHeader({
  balance,
  userName,
}: {
  balance: number;
  userName: string;
}) {
  const pathname = usePathname();
  const title = pageTitle(pathname);
  const { money } = usePreferences();
  const first = userName.trim().split(/\s+/)[0] || "there";
  const initial = first.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-background/85 px-4 backdrop-blur md:flex md:px-6">
      <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-xl bg-foreground text-background">
          <CircleDollarSign className="size-5" />
        </span>
        <span className="font-heading text-lg font-semibold tracking-tight">
          Spese
        </span>
      </Link>

      <span className="h-6 w-px shrink-0 bg-border" aria-hidden />
      <h1 className="truncate text-sm font-medium text-muted-foreground">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <span
          className={cn(
            "hidden text-sm font-semibold tabular-nums sm:block",
            balance < 0 ? "text-rose-500" : "text-foreground",
          )}
        >
          {money(balance)}
        </span>

        <ThemeToggle />
        <LogoutButton iconOnly />

        <Link
          href="/settings"
          aria-label="Profile and settings"
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-muted sm:pr-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
            {initial}
          </span>
          <span className="hidden text-sm font-semibold sm:block">{first}</span>
        </Link>
      </div>
    </header>
  );
}
