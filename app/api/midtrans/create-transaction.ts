// src/pages/api/midtrans/create-transaction.ts (Next.js App Router / Pages Router)
import type { NextApiRequest, NextApiResponse } from "next";
import  {db}  from "@/lib/db"; // atau sesuaikan dengan koneksi MySQL kamu
// @ts-ignore
import Midtrans from "midtrans-client";

// const serverKey = "SB-Mid-server-Ho5PWqoS-Pzj8x-cDYPeQn_v"; // Ganti ke env kalau production

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ message: "Missing booking_id" });
  }

  try {
    const data = await db.getConnection();

    // Ambil data booking
    const [rows]: any = await data.execute(
      "SELECT b.id, b.booking_date, b.guests_count, u.name, u.email, p.amount AS payment_amount FROM bookings b JOIN users u ON b.user_id = u.id JOIN payments p ON p.booking_id = b.id WHERE b.id = ?",
      [booking_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    // Buat order_id unik, misalnya: booking-123-timestamp
    const orderId = `booking-${booking_id}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: booking.payment_amount,
      },
      customer_details: {
        first_name: booking.name,
        email: booking.email,
      },
      item_details: [
        {
          id: `booking-${booking_id}`,
          price: booking.payment_amount,
          quantity: 1,
          name: "Kolam Renang Ticket",
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation/${orderId}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    snap.createTransaction(parameter)
    .then((transaction: { token: any; })=>{
        // transaction token
        let transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
    })
    return res.status(200).json({ token: transaction.token });
  } catch (err) {
    console.error("[MIDTRANS_ERROR]", err);
    return res.status(500).json({ message: "Failed to create transaction" });
  }
}
