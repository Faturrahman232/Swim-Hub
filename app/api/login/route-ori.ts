import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // simpan di env

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Query user berdasarkan email
    const [rows] = await db.query('SELECT id, email, password_hash, role_id FROM users WHERE email = ?', [email]) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Cek password dengan bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Buat token JWT, bisa isikan data user minimal
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Jika berhasil login, kembalikan data user
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
