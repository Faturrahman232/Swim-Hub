// /app/api/my-bookings/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUserServer } from "@/utils/getCurrentUserServer";

export async function GET() {
  const user = getCurrentUserServer();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conn = await db.getConnection();

  try {
    const [rows]: any = await conn.execute(
      `
      SELECT 
        b.id AS booking_id,
        b.booking_date,
        b.guests_count,
        b.status AS booking_status,
        p.status AS payment_status,
        p.id AS payment_id,
        i.invoice_number
      FROM bookings b
      LEFT JOIN payments p ON p.booking_id = b.id
      LEFT JOIN invoices i ON i.booking_id = b.id
      JOIN users u ON u.id = b.user_id
      WHERE u.email = ?
      ORDER BY b.created_at DESC
      `,
      [user.email]
    );

    return NextResponse.json(rows);
  } finally {
    conn.release();
  }
}
