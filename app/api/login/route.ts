// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";


const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: Request) {

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const [rows] = await db.query(
      'SELECT id, email, password_hash, role_id FROM users WHERE email = ?',
      [email]
    ) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id, name: user.name },
      SECRET_KEY,
      { expiresIn: "2h" } // 7 hari
    );


    // Set cookie HTTP-only
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/"
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      }
    });

  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
