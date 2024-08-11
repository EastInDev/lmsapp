import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = verifyToken(token);

    // 이미 등록된 학생인지 확인
    const enrollmentCheck = await pool.query(
      "SELECT * FROM enrollments WHERE course_id = $1 AND user_id = $2",
      [params.courseId, decodedToken.userId]
    );

    if (enrollmentCheck.rows.length > 0) {
      return NextResponse.json(
        { message: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    // 수강 인원 제한 확인
    const courseCheck = await pool.query(
      "SELECT max_students, (SELECT COUNT(*) FROM enrollments WHERE course_id = $1) as current_students FROM courses WHERE id = $1",
      [params.courseId]
    );

    if (
      courseCheck.rows[0].current_students >= courseCheck.rows[0].max_students
    ) {
      return NextResponse.json({ message: "Course is full" }, { status: 400 });
    }

    // 등록 처리
    await pool.query(
      "INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)",
      [decodedToken.userId, params.courseId]
    );

    return NextResponse.json(
      { message: "Enrolled successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { message: "Error enrolling in course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = verifyToken(token);

    const result = await pool.query(
      "DELETE FROM enrollments WHERE course_id = $1 AND user_id = $2",
      [params.id, decodedToken.userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Not enrolled in this course" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Unenrolled successfully" });
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    return NextResponse.json(
      { message: "Error unenrolling from course" },
      { status: 500 }
    );
  }
}
