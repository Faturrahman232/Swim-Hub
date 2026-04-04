import { NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

// Fungsi bantu untuk membuat Set-Cookie header httpOnly
function createAuthCookie(token: string): string {
  const expires = 60 * 60 * 24 * 7; // 7 hari
  return `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expires}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.redirect(new URL("/login", req.url));

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.JWT_SECRET) {
    console.error("Missing Google or JWT environment variables");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 1. Tukar kode dengan token akses
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/api/auth/google/callback",
        grant_type: "authorization_code",
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token } = tokenRes.data;

    // 2. Ambil data user dari Google
    const userRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { email, name } = userRes.data;

    // 3. Cek apakah user sudah ada
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]) as any[];
    let user = rows?.[0];

    // 4. Jika belum, register otomatis
    if (!user) {
      const [result] = await db.query(
        "INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
        [name, email, "", 2]
      ) as [ResultSetHeader, any];

      user = { id: result.insertId, name, email, role_id: 2 };
    }

    // 5. Buat token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, // ⬅️ tambahkan email
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    

    // 6. Redirect dan pasang cookie
    const res = NextResponse.redirect(new URL("/", req.url));
    res.headers.set("Set-Cookie", createAuthCookie(token));
    return res;
  } catch (err) {
    console.error("[GOOGLE_AUTH_ERROR]", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
