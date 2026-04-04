import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Pastikan semua field yang dibutuhkan dikembalikan:
    const { id, email, name, role_id } = decoded as {
      id: number;
      email: string;
      name: string;
      role_id: number;
    };    

    return NextResponse.json({
      user: { id, email, name, role_id },
    });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
