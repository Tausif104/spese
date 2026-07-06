"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, CircleDollarSign, Settings, LogOut } from "lucide-react";
import { navItems } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePreferences } from "@/components/preferences-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileNav({ balance }: { balance: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { money } = usePreferences();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <CircleDollarSign className="size-6 text-primary" />
        <span className="text-lg font-semibold tracking-tight">Spese</span>
      </Link>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu" />
            }
          >
            <Menu className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col gap-0.5 px-2 py-1.5">
              <span className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
                Total balance
              </span>
              <span
                className={`text-base font-semibold tabular-nums ${
                  balance < 0 ? "text-destructive" : ""
                }`}
              >
                {money(balance)}
              </span>
            </div>
            <DropdownMenuSeparator />
            {navItems.map((item) => (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} />}
                data-active={pathname.startsWith(item.href)}
                className="flex items-center gap-2"
              >
                <item.icon className="size-4" />
                {item.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href="/settings" />}
              data-active={pathname.startsWith("/settings")}
              className="flex items-center gap-2"
            >
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
