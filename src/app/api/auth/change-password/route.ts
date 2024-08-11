import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { comparePasswords, hashPassword, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];
    const isValidPassword = await comparePasswords(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      userId,
    ]);

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Error changing password" },
      { status: 500 }
    );
  }
}
