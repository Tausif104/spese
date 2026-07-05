import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signToken, TOKEN_COOKIE, TOKEN_MAX_AGE } from "@/lib/auth/jwt";
import { registerSchema } from "@/lib/validation/auth";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input." },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      categories: { create: DEFAULT_CATEGORIES },
    },
    select: { id: true },
  });

  const token = await signToken(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
  return res;
}
