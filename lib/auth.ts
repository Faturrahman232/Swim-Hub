// lib/auth.ts
import { cookies } from "next/headers";
import { verify, JwtPayload } from "jsonwebtoken";

export interface SessionUser extends JwtPayload {
  id: number;
  email: string;
  name?: string;
  role_id: number; // penting untuk identifikasi admin
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const payload = verify(token, process.env.JWT_SECRET!) as SessionUser;
    return payload;
  } catch (err) {
    console.error("[JWT_VERIFY_ERROR]", err);
    return null;
  }
}

export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || user.role_id !== 1) return null;
  return user;
}
