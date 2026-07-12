export function greetingFor(hour: number): string {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export function GreetingHero({
  greeting,
  name,
  month,
}: {
  greeting: string;
  name: string;
  month: string;
}) {
  const first = name.trim().split(/\s+/)[0] || "there";

  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {greeting}, {first}!
      </h1>
      <p className="text-sm text-muted-foreground">
        Here&apos;s your money at a glance for {month}.
      </p>
    </div>
  );
}
