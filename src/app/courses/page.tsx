import CourseList from '@/components/courses/CourseList';

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">교육 과정 목록</h1>
      <CourseList />
    </div>
  );
}