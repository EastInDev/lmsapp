import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import pool from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string; materialId: string } }
) {
  try {
    console.log("Downloading file:", params);
    // 데이터베이스에서 파일 정보 가져오기
    const result = await pool.query(
      "SELECT file_path, title FROM course_materials WHERE id = $1 AND course_id = $2",
      [params.materialId, params.courseId]
    );

    if (result.rows.length === 0) {
      console.log("File not found in database");
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    const { file_path, title } = result.rows[0];
    const filePath = path.join(process.cwd(), "public", file_path);

    console.log("File path:", filePath);

    // 파일 존재 여부 확인
    try {
      await fs.access(filePath);
    } catch {
      console.log("File not found in filesystem");
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // 파일 읽기
    const fileBuffer = await fs.readFile(filePath);

    // 파일 타입 결정
    const fileExtension = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream"; // 기본값

    if (fileExtension === ".png") contentType = "image/png";
    else if (fileExtension === ".jpg" || fileExtension === ".jpeg")
      contentType = "image/jpeg";
    // 필요한 다른 파일 타입들 추가

    // 응답 헤더 설정
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(title)}${fileExtension}"`
    );
    headers.set("Content-Type", contentType);

    console.log("Sending file:", title, contentType);

    // 파일 반환
    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { message: "Error downloading file" },
      { status: 500 }
    );
  }
}
