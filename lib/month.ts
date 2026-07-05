export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7); // yyyy-mm
}

// UTC [start, end) range for a yyyy-mm month string.
export function monthRange(month: string): { start: Date; end: Date } {
  const [y, m] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(y, m - 1, 1)),
    end: new Date(Date.UTC(y, m, 1)),
  };
}
