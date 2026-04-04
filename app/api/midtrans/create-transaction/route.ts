// src/app/api/midtrans/create-transaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
// @ts-ignore
import Midtrans from "midtrans-client";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { booking_id } = body;

  if (!booking_id) {
    return NextResponse.json({ message: "Missing booking_id" }, { status: 400 });
  }

  try {
    const data = await db.getConnection();

    const [rows]: any = await data.execute(
      `SELECT b.id, b.booking_date, b.guests_count, b.amount, u.name, u.email
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        WHERE b.id = ?`,
      [booking_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const booking = rows[0];
    const orderId = `booking-${booking_id}-${Date.now()}`;
    const paymentAmount = booking.amount;
    const itemPrice = Math.floor(booking.amount / booking.guests_count);
    // const paymentAmount = booking.payment_amount || booking.guests_count * itemPrice; // atau rumus harga yang kamu tetapkan

    const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: paymentAmount,
        },
        customer_details: {
          first_name: booking.name,
          email: booking.email,
        },
        item_details: [
          {
            id: `ticket`,
            price: itemPrice, // harga satuan
            quantity: booking.guests_count, // jumlah tamu
            name: "Kolam Renang Ticket",
          },
        ],
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation/${orderId}`,
        },
      };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token }, { status: 200 });
  } catch (err) {
    console.error("[MIDTRANS_ERROR]", err);
    return NextResponse.json({ message: "Failed to create transaction" }, { status: 500 });
  }
}
