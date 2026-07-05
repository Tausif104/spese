import {
  LayoutDashboard,
  ArrowLeftRight,
  HandCoins,
  Receipt,
  CalendarDays,
  Wallet,
  Repeat,
  Tags,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { title: "Income", href: "/income", icon: HandCoins },
  { title: "Expenses", href: "/expenses", icon: Receipt },
  { title: "This Month", href: "/this-month", icon: CalendarDays },
  { title: "Budgets", href: "/budgets", icon: Wallet },
  { title: "Recurring", href: "/recurring", icon: Repeat },
  { title: "Categories", href: "/categories", icon: Tags },
];
