import { NextResponse, NextRequest } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);

    // 강사 권한 확인
    const courseCheck = await pool.query(
      "SELECT instructor_id FROM courses WHERE id = $1",
      [params.id]
    );

    if (courseCheck.rows[0].instructor_id !== decodedToken.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 파일 저장 경로 설정
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, file.name);

    // 디렉토리 생성 (존재하지 않는 경우)
    await mkdir(uploadDir, { recursive: true });

    // 파일 저장
    await writeFile(filePath, buffer);

    // 데이터베이스에 저장
    const result = await pool.query(
      "INSERT INTO course_materials (course_id, title, file_path, uploader_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [params.id, title, `/uploads/${file.name}`, decodedToken.userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error uploading course material:", error);
    return NextResponse.json(
      { message: "Error uploading course material" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  console.log("Getting materials for course:", params.courseId);
  try {
    const result = await pool.query(
      "SELECT * FROM course_materials WHERE course_id = $1 ORDER BY upload_date DESC",
      [params.courseId]
    );
    console.log("Fetched materials:", result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching course materials:", error);
    return NextResponse.json(
      { message: "Error fetching course materials" },
      { status: 500 }
    );
  }
}
