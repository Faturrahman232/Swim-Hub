import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// @ts-ignore
import Midtrans from "midtrans-client";

// Konfigurasi Midtrans Core API
const core = new Midtrans.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      transaction_status,
      order_id,
      payment_type,
      transaction_time,
      gross_amount,
    } = body;

    if (!order_id || !transaction_status) {
      return NextResponse.json({ error: "Missing order_id or transaction_status" }, { status: 400 });
    }

    const bookingIdMatch = order_id.match(/^booking-(\d+)-/);
    const booking_id = bookingIdMatch ? parseInt(bookingIdMatch[1]) : null;
    if (!booking_id) {
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    const paymentStatus =
      transaction_status === "settlement" || transaction_status === "capture"
        ? "paid"
        : transaction_status === "pending"
        ? "pending"
        : "failed";

    const conn = await db.getConnection();

    // Cek existing payment
    const [existing]: any = await conn.execute(
      `SELECT * FROM payments WHERE booking_id = ?`,
      [booking_id]
    );

    if (existing.length === 0) {
      await conn.execute(
        `INSERT INTO payments (booking_id, amount, method, status, confirmed_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          booking_id,
          parseInt(gross_amount),
          payment_type,
          paymentStatus,
          paymentStatus === "paid" ? transaction_time : null,
        ]
      );
    } else {
      await conn.execute(
        `UPDATE payments
         SET amount = ?, method = ?, status = ?, confirmed_at = ?, updated_at = NOW()
         WHERE booking_id = ?`,
        [
          parseInt(gross_amount),
          payment_type,
          paymentStatus,
          paymentStatus === "paid" ? transaction_time : null,
          booking_id,
        ]
      );
    }

    // Update booking status
    await conn.execute(`UPDATE bookings SET status = ? WHERE id = ?`, [
      paymentStatus,
      booking_id,
    ]);

    return NextResponse.json({ message: "Notification processed" }, { status: 200 });
  } catch (err) {
    console.error("🔴 Webhook error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
