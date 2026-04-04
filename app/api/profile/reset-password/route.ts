import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

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

export async function POST(req: NextRequest) {
  const userId = getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  const [[user]] = await db.query(
    'SELECT password_hash FROM users WHERE id = ?',
    [userId]
  ) as any[];

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    return NextResponse.json({ error: 'Password lama salah' }, { status: 401 });
  }

  const hashedNew = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNew, userId]);

  return NextResponse.json({ message: 'Password berhasil diperbarui' });
}
