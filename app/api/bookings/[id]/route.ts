import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const bookingId = params.id;

  try {
    const [rows] = await db.execute<any[]>(
      `
      SELECT 
        b.id AS booking_id,
        b.user_id,
        b.booking_date,
        b.guests_count,
        b.session,
        b.amount,
        b.status,
        u.name AS user_name,
        p.status AS payment_status,
        p.confirmed_at
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE b.id = ?
    `,
      [bookingId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = rows[0];

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
