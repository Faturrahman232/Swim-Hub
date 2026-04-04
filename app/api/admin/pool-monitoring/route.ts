import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await db.query(`SELECT * FROM pool_monitoring ORDER BY timestamp DESC`);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[POOL_MONITORING_GET]", err);
    return NextResponse.json({ error: "Failed to load monitoring data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { timestamp, occupancy, water_temperature, cleanliness_level } = body;

  try {
    await db.query(
      `INSERT INTO pool_monitoring (timestamp, occupancy, water_temperature, cleanliness_level, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [timestamp, occupancy, water_temperature, cleanliness_level]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POOL_MONITORING_POST]", err);
    return NextResponse.json({ error: "Failed to create monitoring record" }, { status: 500 });
  }
}
