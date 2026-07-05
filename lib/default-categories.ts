import type { TransactionType } from "@/lib/types";

export const DEFAULT_CATEGORIES: {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}[] = [
  { name: "Groceries", type: "EXPENSE", color: "#f59e0b", icon: "ShoppingCart" },
  { name: "Rent", type: "EXPENSE", color: "#ef4444", icon: "Home" },
  { name: "Utilities", type: "EXPENSE", color: "#3b82f6", icon: "Plug" },
  { name: "Dining", type: "EXPENSE", color: "#ec4899", icon: "UtensilsCrossed" },
  { name: "Transport", type: "EXPENSE", color: "#14b8a6", icon: "Car" },
  { name: "Entertainment", type: "EXPENSE", color: "#8b5cf6", icon: "Clapperboard" },
  { name: "Shopping", type: "EXPENSE", color: "#f97316", icon: "ShoppingBag" },
  { name: "Health", type: "EXPENSE", color: "#10b981", icon: "HeartPulse" },
  { name: "Salary", type: "INCOME", color: "#22c55e", icon: "Briefcase" },
  { name: "Freelance", type: "INCOME", color: "#06b6d4", icon: "Laptop" },
];
