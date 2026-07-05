export type TransactionType = "EXPENSE" | "INCOME";
export type RecurrenceInterval = "DAILY" | "WEEKLY" | "MONTHLY";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  color: string; // hex or css var, used for charts/badges
  icon: string; // lucide icon name
};

export type Transaction = {
  id: string;
  categoryId: string;
  amount: number; // positive number; sign implied by type
  type: TransactionType;
  note: string;
  date: string; // ISO date (yyyy-mm-dd)
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number; // monthly limit
  month: string; // yyyy-mm
};

export type Recurring = {
  id: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  interval: RecurrenceInterval;
  nextRunDate: string; // ISO date
  active: boolean;
};
