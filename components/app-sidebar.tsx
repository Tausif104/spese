"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:sticky md:top-0 md:flex md:h-dvh md:w-60 md:flex-col md:self-start md:border-r md:bg-sidebar md:text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <CircleDollarSign className="size-6 text-primary" />
        <span className="text-lg font-semibold tracking-tight">Spese</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-semibold text-foreground"
                  : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <item.icon
                className={cn("size-4 shrink-0", active && "text-primary")}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t p-3">
        <Link
          href="/settings"
          aria-current={pathname.startsWith("/settings") ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname.startsWith("/settings")
              ? "bg-primary/10 font-semibold text-foreground"
              : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Settings className="size-4" />
          Settings
        </Link>
        <ThemeToggle expanded />
        <LogoutButton />
      </div>
    </aside>
  );
}
