"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CourseMaterials from "@/components/courses/CourseMaterials";

interface Course {
  courseId: number;
  title: string;
  description: string;
  instructor_id: number;
  max_students: number;
  start_date: string;
  end_date: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);

  useEffect(() => {
    if (typeof params.courseId === "string") {
      fetchCourse();
      checkEnrollmentStatus();
    }
  }, [params.courseId]);

  const fetchCourse = async () => {
    if (typeof params.courseId !== "string") return;

    try {
      const response = await fetch(`/api/courses/${params.courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      } else {
        console.error("Failed to fetch course");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkInstructor = async () => {
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data); // 추가된 로그
        setIsInstructor(
          data.user.role === "instructor" &&
            data.user.id === course?.instructor_id
        );
      }
    };

    if (course) {
      checkInstructor();
    }
  }, [course]);

  const checkEnrollmentStatus = async () => {
    if (typeof params.courseId !== "string") return;

    try {
      const response = await fetch(
        `/api/courses/${params.courseId}/enrollment-status`
      );
      if (response.ok) {
        const data = await response.json();
        setEnrolled(data.enrolled);
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
    }
  };

  const handleEnrollment = async () => {
    if (typeof params.courseId !== "string") return;

    try {
      const response = await fetch(`/api/courses/${params.courseId}/enroll`, {
        method: enrolled ? "DELETE" : "POST",
      });
      if (response.ok) {
        setEnrolled(!enrolled);
        alert(enrolled ? "수강 취소되었습니다." : "수강 신청되었습니다.");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return <div>강좌를 찾을 수 없습니다.</div>;
  }

  console.log("Course:", course);
  console.log("Is Instructor:", isInstructor);
  console.log("Params ID:", params.courseId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          수강 인원: {course.max_students}명
        </p>
        <p className="text-sm text-gray-500 mb-4">
          기간: {new Date(course.start_date).toLocaleDateString()} -{" "}
          {new Date(course.end_date).toLocaleDateString()}
        </p>
        <button
          onClick={handleEnrollment}
          className={`px-4 py-2 rounded ${
            enrolled
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors`}
        >
          {enrolled ? "수강 취소" : "수강 신청"}
        </button>
      </div>
      {course && typeof params.courseId === "string" && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">강의 자료</h2>
          <CourseMaterials
            courseId={params.courseId}
            isInstructor={isInstructor}
          />
        </>
      )}
    </div>
  );
}
