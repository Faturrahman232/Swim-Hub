import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// Konversi dari ISO (T dan Z) ke format MySQL
function toMySQLDatetime(isoString: string) {
    const date = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id);
  const body = await req.json();
  const { timestamp, occupancy, water_temperature, cleanliness_level } = body;
  const mysqlTimestamp = toMySQLDatetime(timestamp);


  try {
    await db.query(
        `UPDATE pool_monitoring
         SET timestamp = ?, occupancy = ?, water_temperature = ?, cleanliness_level = ?
         WHERE id = ?`,
        [mysqlTimestamp, occupancy, water_temperature, cleanliness_level, id]
      );      
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POOL_MONITORING_PUT]", err);
    return NextResponse.json({ error: "Failed to update monitoring data" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id);

  try {
    await db.query(`DELETE FROM pool_monitoring WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POOL_MONITORING_DELETE]", err);
    return NextResponse.json({ error: "Failed to delete monitoring record" }, { status: 500 });
  }
}
