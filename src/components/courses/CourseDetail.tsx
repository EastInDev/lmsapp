'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/types/course';

export default function CourseDetail({ id }: { id: string }) {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // 실제로는 여기서 API를 호출하여 과정 정보를 가져와야 합니다.
    // 지금은 더미 데이터를 사용합니다.
    const dummyCourse: Course = {
      id: id,
      title: '웹 개발 기초',
      description: 'HTML, CSS, JavaScript를 배웁니다.',
      instructor: '김강사',
      startDate: '2023-09-01',
      endDate: '2023-12-31',
      enrollmentLimit: 30,
    };
    setCourse(dummyCourse);
  }, [id]);

  if (!course) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="mb-2"><strong>강사:</strong> {course.instructor}</p>
        <p className="mb-2"><strong>시작일:</strong> {course.startDate}</p>
        <p className="mb-2"><strong>종료일:</strong> {course.endDate}</p>
        <p><strong>정원:</strong> {course.enrollmentLimit}명</p>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        수강 신청
      </button>
    </div>
  );
}