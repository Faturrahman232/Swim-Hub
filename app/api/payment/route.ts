import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, transaction_status, gross_amount, payment_type } = body;

  const bookingId = order_id?.split("-")[1]; // dari 'booking-53-123123123'

  if (!bookingId) {
    return NextResponse.json({ message: "Invalid order_id" }, { status: 400 });
  }

  try {
    const connection = await db.getConnection();

    // Masukkan ke tabel payments
    await connection.execute(
      `INSERT INTO payments (booking_id, amount, method, status, confirmed_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [bookingId, gross_amount, payment_type, transaction_status]
    );

    // Update status booking
    await connection.execute(
      `UPDATE bookings SET status = 'paid' WHERE id = ?`,
      [bookingId]
    );

    return NextResponse.json({ message: "Payment status updated" });
  } catch (err) {
    console.error("[PAYMENT_STATUS_ERROR]", err);
    return NextResponse.json({ message: "Database error" }, { status: 500 });
  }
}
