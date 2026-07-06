"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";
import { usePreferences } from "@/components/preferences-provider";

export function AppSidebar({ balance }: { balance: number }) {
  const pathname = usePathname();
  const { money } = usePreferences();
  const negative = balance < 0;

  return (
    <aside className="hidden text-sidebar-foreground md:sticky md:top-0 md:flex md:h-dvh md:w-60 md:flex-col md:self-start md:border-r md:border-white/10 md:bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <CircleDollarSign className="size-6" />
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
                  ? "bg-white/15 font-semibold text-white"
                  : "font-medium text-white/65 hover:bg-white/10 hover:text-white",
              )}
            >
              {active && (
                <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white" />
              )}
              <item.icon className="size-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3">
        <div className="flex items-center gap-3 rounded-full bg-white/10 py-2 pr-4 pl-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Wallet className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.625rem] font-medium uppercase tracking-wider text-white/60">
              Total balance
            </p>
            <p
              className={cn(
                "truncate text-lg font-semibold tabular-nums tracking-tight",
                negative ? "text-rose-300" : "text-white",
              )}
            >
              {money(balance)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
