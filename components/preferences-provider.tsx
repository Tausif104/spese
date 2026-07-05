"use client";

import { createContext, useContext } from "react";
import { formatCurrency, formatDate, type DateFormat } from "@/lib/format";

type Prefs = { currency: string; dateFormat: DateFormat };

const PreferencesContext = createContext<Prefs>({
  currency: "USD",
  dateFormat: "MED",
});

export function PreferencesProvider({
  value,
  children,
}: {
  value: Prefs;
  children: React.ReactNode;
}) {
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Currency/date formatters bound to the current user's preferences.
export function usePreferences() {
  const { currency, dateFormat } = useContext(PreferencesContext);
  return {
    currency,
    dateFormat,
    money: (value: number, cents = false) =>
      formatCurrency(value, { currency, cents }),
    date: (iso: string) => formatDate(iso, { dateFormat }),
  };
}
