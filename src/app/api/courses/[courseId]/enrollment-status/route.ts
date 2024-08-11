import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ enrolled: false }, { status: 200 });
  }

  try {
    const decodedToken = verifyToken(token);

    const result = await pool.query(
      "SELECT * FROM enrollments WHERE course_id = $1 AND user_id = $2",
      [params.courseId, decodedToken.userId]
    );

    return NextResponse.json(
      { enrolled: result.rows.length > 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return NextResponse.json({ enrolled: false }, { status: 200 });
  }
}
