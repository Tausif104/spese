"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, CircleDollarSign } from "lucide-react";
import { navItems } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileNav() {
  const pathname = usePathname();

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
          <DropdownMenuContent align="end" className="w-48">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
