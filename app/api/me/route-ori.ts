// /app/api/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!; // pastikan sudah di .env.local

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token"); // atau nama cookie JWT kamu

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verifikasi token
    const user = jwt.verify(token.value, JWT_SECRET) as { email: string; id: number; name: string; role_id: number; };
    // console.log("[USER_VERIFIED]", user);
    
    // Kembalikan data user
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id
      }
    });    
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
