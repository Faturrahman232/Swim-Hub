// /app/api/admin/report/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [dailyResult, weeklyResult, monthlyResult] = await Promise.all([
      db.query(`
        SELECT 
          DATE(b.booking_date) as date, 
          SUM(p.amount) as total
        FROM bookings b
        JOIN payments p ON p.booking_id = b.id
        WHERE p.status = 'paid'
        GROUP BY DATE(b.booking_date)
        ORDER BY date DESC
        LIMIT 7
      `),
      db.query(`
        SELECT 
          YEARWEEK(b.booking_date, 3) AS year_week,
          MIN(DATE(b.booking_date)) AS start_date,
          MAX(DATE(b.booking_date)) AS end_date,
          SUM(p.amount) AS total
        FROM bookings b
        JOIN payments p ON p.booking_id = b.id
        WHERE p.status = 'paid'
        GROUP BY year_week
        ORDER BY year_week DESC
        LIMIT 6
      `),
      db.query(`
        SELECT 
          DATE_FORMAT(b.booking_date, '%Y-%m') as month, 
          SUM(p.amount) as total
        FROM bookings b
        JOIN payments p ON p.booking_id = b.id
        WHERE p.status = 'paid'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `),
    ]);

    const daily = (dailyResult as any[])[0];
    const weekly = (weeklyResult as any[])[0];
    const monthly = (monthlyResult as any[])[0];

    return NextResponse.json({ daily, weekly, monthly });
  } catch (err) {
    console.error("[ADMIN_REPORT_ERROR]", err);
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}

