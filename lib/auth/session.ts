import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TOKEN_COOKIE, verifyToken } from "@/lib/auth/jwt";

export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// For server components / actions that require auth. Redirects to /login if absent.
export async function requireUserId(): Promise<string> {
  const id = await getUserId();
  if (!id) redirect("/login");
  return id;
}

export async function getCurrentUser() {
  const id = await getUserId();
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
  });
}
