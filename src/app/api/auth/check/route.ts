import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    const decodedToken = verifyToken(token);
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [decodedToken.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    const user = result.rows[0];
    return NextResponse.json({ isLoggedIn: true, user }, { status: 200 });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
