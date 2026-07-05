export type DateFormat = "MED" | "DMY" | "MDY" | "ISO";

export function formatCurrency(
  value: number,
  opts: { currency?: string; cents?: boolean } = {},
): string {
  const { currency = "USD", cents = false } = opts;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(value);
}

export function formatMonth(month: string): string {
  // month is "yyyy-mm"
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDate(
  iso: string,
  opts: { dateFormat?: DateFormat } = {},
): string {
  const { dateFormat = "MED" } = opts;
  const [y, m, d] = iso.split("-").map(Number);
  switch (dateFormat) {
    case "ISO":
      return iso;
    case "DMY":
      return `${pad(d)}/${pad(m)}/${y}`;
    case "MDY":
      return `${pad(m)}/${pad(d)}/${y}`;
    case "MED":
    default:
      return new Date(y, m - 1, d).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  }
}
