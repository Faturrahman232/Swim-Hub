import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await db.query(
    `SELECT bookings.*, users.name as user_name 
     FROM bookings 
     JOIN users ON bookings.user_id = users.id
     ORDER BY bookings.id DESC`
  ) as any[];
  

  return NextResponse.json(rows);
}
