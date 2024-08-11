"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import withAuth from "@/components/auth/withAuth";

interface CourseForm {
  title: string;
  description: string;
  max_students: number;
  start_date: string;
  end_date: string;
}

function CourseManageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");

  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    max_students: 0,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setForm({
          title: data.title,
          description: data.description,
          max_students: data.max_students,
          start_date: data.start_date.split("T")[0],
          end_date: data.end_date.split("T")[0],
        });
      } else {
        console.error("Failed to fetch course");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = courseId ? `/api/courses/${courseId}` : "/api/courses";
      const method = courseId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        router.push("/courses");
      } else {
        const data = await response.json();
        alert(data.message || "강좌 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("강좌 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {courseId ? "강좌 수정" : "강좌 생성"}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            설명
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="max_students"
            className="block text-gray-700 font-bold mb-2"
          >
            최대 수강 인원
          </label>
          <input
            type="number"
            id="max_students"
            name="max_students"
            value={form.max_students}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="start_date"
            className="block text-gray-700 font-bold mb-2"
          >
            시작일
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="end_date"
            className="block text-gray-700 font-bold mb-2"
          >
            종료일
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {courseId ? "수정하기" : "생성하기"}
        </button>
      </form>
    </div>
  );
}

function CourseManagePage() {
  return <CourseManageForm />;
}

export default withAuth(CourseManagePage, ["admin", "instructor"]);
