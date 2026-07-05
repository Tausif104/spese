import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const ALG = "HS256";

export const TOKEN_COOKIE = "token";
export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
