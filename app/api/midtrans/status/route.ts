import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// @ts-ignore
import Midtrans from "midtrans-client";

// Konfigurasi Midtrans
const core = new Midtrans.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Received Body:", body);

    const { transaction_status, order_id } = body;

    if (!order_id || !transaction_status) {
      return NextResponse.json(
        { error: "Missing order_id or transaction_status" },
        { status: 400 }
      );
    }

    const bookingIdMatch = order_id.match(/^booking-(\d+)-/);
    const booking_id = bookingIdMatch ? parseInt(bookingIdMatch[1]) : null;

    if (!booking_id) {
      console.log("❌ Invalid booking_id format from order_id:", order_id);
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    const transaction = await core.transaction.status(order_id);
    console.log("📤 Midtrans Transaction:", transaction);

    const payment_type = transaction.payment_type || "unknown";
    const transaction_time = transaction.transaction_time || null;

    const paymentStatus =
      transaction.transaction_status === "settlement" ||
      transaction.transaction_status === "capture"
        ? "paid"
        : transaction.transaction_status === "pending"
        ? "pending"
        : "failed";

    const conn = await db.getConnection();
    console.log("✅ DB connection established");

    const [bookingRows]: any = await conn.execute(
      `SELECT amount FROM bookings WHERE id = ?`,
      [booking_id]
    );

    if (bookingRows.length === 0) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const bookingAmount = bookingRows[0].amount;

    const [existing]: any = await conn.execute(
      `SELECT * FROM payments WHERE booking_id = ?`,
      [booking_id]
    );

    if (existing.length === 0) {
      console.log("➕ Inserting new payment");
      await conn.execute(
        `INSERT INTO payments (booking_id, amount, method, status, confirmed_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          booking_id,
          bookingAmount,
          payment_type,
          paymentStatus,
          paymentStatus === "paid" ? transaction_time : null,
        ]
      );
    } else {
      console.log("📝 Updating existing payment");
      await conn.execute(
        `UPDATE payments
         SET method = ?, status = ?, confirmed_at = ?, updated_at = NOW()
         WHERE booking_id = ?`,
        [
          payment_type,
          paymentStatus,
          paymentStatus === "paid" ? transaction_time : null,
          booking_id,
        ]
      );
    }

    await conn.execute(`UPDATE bookings SET status = ? WHERE id = ?`, [
      paymentStatus,
      booking_id,
    ]);
    console.log("✅ Booking updated");

    const [invoiceRows]: any = await conn.execute(
      `SELECT * FROM invoices WHERE booking_id = ?`,
      [booking_id]
    );

    if (invoiceRows.length === 0 && paymentStatus === "paid") {
      const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${booking_id.toString().padStart(4, "0")}`;
      const issueDate = new Date();
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const pdfUrl = `${baseUrl}/invoice/${invoiceNumber}`;

      await conn.execute(
        `INSERT INTO invoices (booking_id, invoice_number, issue_date, amount, pdf_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [booking_id, invoiceNumber, issueDate, bookingAmount, pdfUrl]
      );

      console.log("🧾 Invoice created:", invoiceNumber);
    }

    return NextResponse.json({ message: `Status updated to "${paymentStatus}"` });
  } catch (err: any) {
    console.error("🔴 Webhook error:", err?.message || err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
