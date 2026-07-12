import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Spese account.
        </p>
      </div>

      <LoginForm />

      <p className="text-sm text-muted-foreground">
        New to Spese?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
