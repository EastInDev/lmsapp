'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/types/course';

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // 실제로는 여기서 API를 호출하여 과정 목록을 가져와야 합니다.
    // 지금은 더미 데이터를 사용합니다.
    const dummyCourses: Course[] = [
      {
        id: '1',
        title: '웹 개발 기초',
        description: 'HTML, CSS, JavaScript를 배웁니다.',
        instructor: '김강사',
        startDate: '2023-09-01',
        endDate: '2023-12-31',
        enrollmentLimit: 30,
      },
      {
        id: '2',
        title: '데이터 분석 입문',
        description: 'Python을 이용한 데이터 분석 기초를 배웁니다.',
        instructor: '이분석',
        startDate: '2023-10-01',
        endDate: '2024-01-31',
        enrollmentLimit: 25,
      },
    ];
    setCourses(dummyCourses);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
          <p className="text-gray-600 mb-2">{course.description}</p>
          <p className="text-sm text-gray-500 mb-1">강사: {course.instructor}</p>
          <p className="text-sm text-gray-500 mb-1">기간: {course.startDate} ~ {course.endDate}</p>
          <p className="text-sm text-gray-500 mb-4">정원: {course.enrollmentLimit}명</p>
          <Link href={`/courses/${course.id}`} className="text-blue-500 hover:underline">
            자세히 보기
          </Link>
        </div>
      ))}
    </div>
  );
}