import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE, verifyToken } from "@/lib/auth/jwt";

const publicRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = publicRoutes.some((p) => path.startsWith(p));

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const userId = token ? await verifyToken(token) : null;

  // Unauthenticated on a protected route → send to login.
  if (!userId && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Authenticated but on login/register → send to dashboard.
  if (userId && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals, and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
