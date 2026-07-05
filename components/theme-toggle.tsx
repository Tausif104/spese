"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ expanded = false }: { expanded?: boolean }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const toggle = () => setTheme(isDark ? "light" : "dark");

  if (expanded) {
    return (
      <Button
        variant="ghost"
        aria-label="Toggle theme"
        onClick={toggle}
        className="w-full justify-start gap-3 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        {mounted ? (isDark ? "Light mode" : "Dark mode") : "Appearance"}
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
