import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2">
          <CircleDollarSign className="size-7 text-primary" />
          <span className="text-xl font-semibold tracking-tight">Spese</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
