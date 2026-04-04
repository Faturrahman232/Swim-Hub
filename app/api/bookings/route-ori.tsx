// app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const SECRET_KEY = process.env.JWT_SECRET!;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

export async function POST(req: Request) {
  try {
    // Verifikasi header Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    // Verifikasi token JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Ambil data user dari token, gunakan ini sebagai user_id yang valid
    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    // Parsing body request
    const { booking_date, guests_count, amount } = await req.json();

    // Validasi input wajib
    if (!booking_date || !guests_count || !amount) {
      return NextResponse.json({ error: "Missing booking_date or guests_count" }, { status: 400 });
    }

    // Status booking default (misal: 'pending')
    const status = "pending";

    // Simpan data booking ke database
    const [result]: any = await db.query(
      `INSERT INTO bookings (user_id, booking_date, guests_count, status)
       VALUES (?, ?, ?, ?)`,
      [userId, booking_date, guests_count, status]
    );

    // Berikan respons berhasil dengan ID booking baru
    return NextResponse.json({ 
      message: "Booking created successfully", 
      booking_id: result.insertId,
      amount: amount,
      status
    }, { status: 201 });
  } catch (error) {
    console.error("[BOOKING_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
