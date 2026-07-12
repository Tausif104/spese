"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 self-start pl-3 md:flex md:flex-col md:items-center md:justify-center md:gap-1.5">
      {navItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.title}
            aria-current={active ? "page" : undefined}
            title={item.title}
            className={cn(
              "group relative flex size-11 items-center justify-center rounded-full transition-all",
              active
                ? "bg-foreground text-background shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 lg:group-hover:block">
              {item.title}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
