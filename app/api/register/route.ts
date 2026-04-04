import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]) as any[];
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    await db.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, 2]
    );

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
