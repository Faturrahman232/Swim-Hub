import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const SECRET_KEY = process.env.JWT_SECRET;

  if (!SECRET_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. No token provided." }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { booking_date, guests_count, session } = await req.json();

    // Validasi input wajib
    if (!booking_date || !guests_count || !session) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof guests_count !== "number" || guests_count <= 0) {
      return NextResponse.json({ error: "Guests count must be a positive number" }, { status: 400 });
    }

    // Validasi sesi & hitung amount
    let pricePerGuest = 0;
    let minGuests = 0;

    if (session === "sesi1" || session === "sesi2") {
      pricePerGuest = 20000;
      minGuests = 20;
    } else if (session === "fullday") {
      pricePerGuest = 70000;
      minGuests = 30;
    } else {
      return NextResponse.json({ error: "Invalid session value" }, { status: 400 });
    }

    if (guests_count < minGuests) {
      return NextResponse.json({
        error: `Minimum guests for ${session} is ${minGuests}`,
      }, { status: 400 });
    }

    const amount = guests_count * pricePerGuest;
    const status = "pending";

    const [result]: any = await db.query(
      `INSERT INTO bookings (user_id, booking_date, session, guests_count, amount, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, booking_date, session, guests_count, amount, status]
    );

    console.log("[BOOKING_CREATED]", result);

    return NextResponse.json({
      message: "Booking created successfully",
      booking_id: result.insertId,
      amount,
      status,
    }, { status: 201 });

  } catch (error) {
    console.error("[BOOKING_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
