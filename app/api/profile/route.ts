// app/api/profile/route.ts (GET & PUT untuk profil)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || '9acfa2c3a732b6a0ef7fa6c3a9e8123c83b59e7bd289f9bbd8b3017d3c2c4ed2';

function getUserIdFromCookie() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return (decoded as any).id;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [[user]] = await db.query(
    `SELECT u.name, u.email, u.phone, p.address, p.birthdate, p.avatar_url
     FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE u.id = ?`,
    [userId]
  ) as any[];

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const userId = getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, phone, address, birthdate } = body;

  await db.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, userId]);

  await db.query(`INSERT INTO user_profiles (user_id, address, birthdate)
    VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE address = ?, birthdate = ?`,
    [userId, address, birthdate, address, birthdate]);

  return NextResponse.json({ message: 'Profile updated successfully' });
}
