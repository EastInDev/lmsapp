import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// 강좌 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  try {
    let query = "SELECT * FROM courses WHERE 1=1";
    const values = [];

    if (search) {
      query += " AND (title ILIKE $1 OR description ILIKE $1)";
      values.push(`%${search}%`);
    }

    if (startDate) {
      query += " AND start_date >= $" + (values.length + 1);
      values.push(startDate);
    }

    if (endDate) {
      query += " AND end_date <= $" + (values.length + 1);
      values.push(endDate);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Error fetching courses" },
      { status: 500 }
    );
  }
}

// 강좌 생성 (관리자/강사 전용)
export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = verifyToken(token);
    if (decodedToken.role !== "admin" && decodedToken.role !== "instructor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, description, max_students, start_date, end_date } =
      await request.json();
    const result = await pool.query(
      "INSERT INTO courses (title, description, instructor_id, max_students, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        title,
        description,
        decodedToken.userId,
        max_students,
        start_date,
        end_date,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { message: "Error creating course" },
      { status: 500 }
    );
  }
}
