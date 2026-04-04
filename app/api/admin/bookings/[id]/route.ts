import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;

  const { guests_count, status, session } = await req.json();
  await db.query(
    `UPDATE bookings SET guests_count = ?, status = ?, session = ?, updated_at = NOW() WHERE id = ?`,
    [guests_count, status, session, id]
);

  return NextResponse.json({ message: "Booking updated" });
}
