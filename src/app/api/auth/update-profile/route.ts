import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { comparePasswords, hashPassword, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, currentPassword, newPassword } = await request.json();
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

    if (currentPassword) {
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
    }

    let hashedNewPassword = user.password;
    if (newPassword) {
      hashedNewPassword = await hashPassword(newPassword);
    }

    await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
      [name, email, hashedNewPassword, userId]
    );

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
}
