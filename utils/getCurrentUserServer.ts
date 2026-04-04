// Untuk digunakan di API Route (server side)
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getCurrentUserServer() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: number; name: string; email: string };
  } catch (err) {
    return null;
  }
}
