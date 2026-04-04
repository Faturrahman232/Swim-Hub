// pages/api/bookings/availability.ts

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date required" }, { status: 400 });
  }
  
  try {
    const [rows] = await db.query(
      "SELECT session FROM bookings WHERE booking_date = ?",
      [date]
    ) as any[];
  
    const sessions = rows.map((row: any) => row.session);
    return NextResponse.json({ sessions }); // akan return [] jika kosong
  } catch (err) {
    console.error("Booking availability error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }  
}
