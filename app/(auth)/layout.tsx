import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-foreground p-10 text-background lg:flex xl:p-14">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-background text-foreground">
            <CircleDollarSign className="size-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            Spese
          </span>
        </Link>

        <div>
          <h2 className="font-heading text-4xl font-semibold tracking-tight">
            Every taka,
            <br />
            accounted for.
          </h2>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Track income, expenses, and budgets in one clean, quiet place.
          </p>
        </div>

        <ul className="space-y-3 text-sm text-background/80">
          <li className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-amber-300" aria-hidden />
            Budgets that keep you honest
          </li>
          <li className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-emerald-300" aria-hidden />
            Recurring bills on autopilot
          </li>
          <li className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-violet-300" aria-hidden />
            Your money at a glance
          </li>
        </ul>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 flex items-center gap-2.5 lg:hidden"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-foreground text-background">
              <CircleDollarSign className="size-5" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight">
              Spese
            </span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
