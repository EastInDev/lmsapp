"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CourseFilter from "@/components/courses/CourseFilter";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  max_students: number;
  start_date: string;
  end_date: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async (search = "", startDate = "", endDate = "") => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        search,
        startDate,
        endDate,
      }).toString();
      const response = await fetch(`/api/courses?/${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        throw new Error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("강좌를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFilter = (search: string, startDate: string, endDate: string) => {
    fetchCourses(search, startDate, endDate);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">에러: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">강좌 목록</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              수강 인원: {course.max_students}명
            </p>
            <p className="text-sm text-gray-500 mb-4">
              기간: {new Date(course.start_date).toLocaleDateString()} -{" "}
              {new Date(course.end_date).toLocaleDateString()}
            </p>
            <Link
              href={`/courses/${course.id}`}
              className="text-blue-500 hover:underline"
            >
              자세히 보기
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
