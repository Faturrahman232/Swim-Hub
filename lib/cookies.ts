// lib/cookies.ts
import { cookies } from "next/headers";

export function setCookie(res: any, name: string, value: string) {
  res.cookies.set(name, value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}
